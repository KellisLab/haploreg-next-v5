import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { InputOptions } from "@/app/components/Query/Input/dataManagement/inputReducer";
import QueryType from "@/app/types/QueryType";
import assert from "assert";
import staticMetadataList from "@/app/data/roadmapMetadataV4";
import { compileHaploblock } from "./helpers/compileHaploBlock";
import { useSearchParams } from "next/navigation";

const MAX_INTERVAL: number = 10000000;
const MAX_QUERY: number = 10000;
const CHR_RANGE_PARSER: RegExp =
  /^chr(?<chr>\d+):(?<startPos>\d+)-(?<endPos>\d+)/;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = JSON.parse(searchParams.get("input")!) as InputOptions;

  try {
    const inputType = input.inputType;
    let queryLock: QueryType = input.queryType;

    /**
     * @description                                Takes in inputs, determines what form they are entering in
     * @returns {Array<string | Array<string>>}    snps - array of snps for which we need to build haploblocks around, or array of arrays of snps
     *                                             where a subarray is a predefined regions on the chromosome, if no valid snps are found in predefined region,
     *                                             empty list is returned for that region
     * @returns {QueryType}                        queryLock - tell us if we are dealing with snps (build haploblocks) or regions (predefined ranges) or unknown (gwas)
     * @throws                                     mainQueryFailure if format is bad, queries are too large, or types are mixed
     */
    const snps: Array<string | Array<string>> = [];
    if (inputType === "query" || inputType === "file") {
      const inputArray: Array<string> = [];

      if (inputType === "query") {
        const textInput: string = input.query;
        inputArray.push(...textInput.split(",").map((item) => item.trim()));
      } else if (inputType === "file") {
        const fileInput: string = input.file;
        inputArray.push(...fileInput.split("\n").map((item) => item.trim()));
      }

      if (inputArray.length > MAX_QUERY) {
        return NextResponse.json({
          input: input,
          error: `Error: query length exceeds ${MAX_QUERY}.`,
        });
      }

      for (let i = 0; i < inputArray.length; i++) {
        const item = inputArray[i];
        if (item === "") {
          continue;
        } else if (
          item.includes("rs") &&
          (queryLock === QueryType.SnpList || queryLock === QueryType.Unknown)
        ) {
          queryLock = QueryType.SnpList;
          input.queryType = QueryType.SnpList;
          snps.push(item);
        } else if (
          item.includes(":") &&
          (queryLock === QueryType.ChrRange || queryLock === QueryType.Unknown)
        ) {
          const ChrRangeMatches = item.match(CHR_RANGE_PARSER);
          if (ChrRangeMatches) {
            const { chr, startPos, endPos } = ChrRangeMatches.groups!;
            queryLock = QueryType.ChrRange;
            input.queryType = QueryType.ChrRange;
            if (parseInt(endPos) - parseInt(startPos) <= MAX_INTERVAL) {
              const ChrRangeInput = await prisma.snp_v2.findMany({
                select: { id: true, is_kg: true },
                where: {
                  chr: chr,
                  pos: { gte: Number(startPos), lte: Number(endPos) },
                },
                orderBy: { pos: "asc" },
              });
              snps.push([
                ...ChrRangeInput.filter((obj) => obj.is_kg === 1).map(
                  (obj) => obj.id
                ),
              ]);
            } else {
              return NextResponse.json({
                input: input,
                error: `Error: interval larger than ${MAX_INTERVAL}.`,
              });
            }
          } else {
            return NextResponse.json({
              input: input,
              error: "Error: fix input format for chromosome range.",
            });
          }
        } else {
          return NextResponse.json({
            input: input,
            error:
              "Error: fix input format, typo found. Please use either rsids or ranges exclusively.",
          });
        }
      }
    } else if (inputType === "gwas") {
      const gwasInput = await prisma.gwas_201511.findFirst({
        where: { name: input.gwas as string },
      });
      snps.push(...gwasInput!.snps!.split(";"));
    } else {
      return NextResponse.json({
        input: input,
        error: "Impossible failure 1",
      });
    }

    /**
     * @description                                Builds haploblocks around input snps or gwas snps, otherwise just checks for query length
     * @returns {Map<string, Map<string, string>>} ldValuesAll - key for the highest level map is the queried id, second level map is the linked ids and their ld values,
     *                                             if the input was a range, the highest level map is the leading snp, and all ld values are set to 0
     * @throws                                     mainQueryFailure ranges end up containing too many snps, or if region was empty
     */
    const ldValuesAll: Map<string, Map<string, string>> = new Map(); // key for the highest level map is the queried id
    const dldValuesAll: Map<string, Map<string, string>> = new Map();

    if (queryLock === QueryType.SnpList || queryLock === QueryType.Unknown) {
      const checkSnpListQuery = prisma.snp_v2.findMany({
        select: { id: true, is_kg: true },
        where: { id: { in: snps as string[] } },
      }); // for missing SNP check, use is_kg to find SNPs with no LD data
      const checkSnpListData = await checkSnpListQuery;
      const snpsToReturn = checkSnpListData.map((snp) => snp.id).join(", "); // bad query check and response
      if (checkSnpListData.length !== snps.length) {
        const badInputSnps = snps.filter(
          (id) => !snpsToReturn.includes(id as string)
        );
        if (badInputSnps.length > 0) {
          return NextResponse.json({
            input: input,
            error: `Error: SNPs not found: ${badInputSnps.join(
              ", "
            )}. Please fix your query to only include SNPs in the database.`,
          });
        } else {
          return NextResponse.json({
            input: input,
            error: "Error: duplicate SNPs in Query. Please remove duplicates.",
          });
        }
      }
      const ldFilter: Array<string> = [
        ...checkSnpListData
          .filter((obj) => obj.is_kg === 1)
          .map((obj) => obj.id),
      ];
      const validLDsnps = snps.filter((id) => ldFilter.includes(id as string));
      const noLDSnps = snps.filter((id) => !ldFilter.includes(id as string)); // no data in ld and limited data in snp_v2

      // TODO convert hg19 snps to hg38
      // foreach ($querysnps as $querysnp){
      //   if (preg_match("/^rs\d+$/", $querysnp)){					# validate string that will go into mysql calls
      //     $testrsid = mysqli_fetch_array(mysqli_query($con, "SELECT COUNT(1) AS TOTAL FROM snp_v2 WHERE id LIKE '" . $querysnp . "'"))[0];
      //     if (!$testrsid){
      //       $convertedrs = mysqli_fetch_array(mysqli_query($con, "SELECT ourname FROM alternate_rsid_lookup WHERE altname LIKE '" . $querysnp . "'"))[0];
      //       if ($convertedrs){
      //         $querysnp = $convertedrs;
      //         $testrsid = mysqli_fetch_array(mysqli_query($con, "SELECT COUNT(1) AS TOTAL FROM snp_v2 WHERE id LIKE '" . $querysnp . "'"))[0];
      //       }
      //     }
      //     if ($testrsid){
      //       $snpsforenrichment[]=$querysnp;
      //     }
      //   }
      // }

      if (input.ld === 0.0) {
        for (const queryId of snps) {
          const ldIdDataMap: Map<string, string> = new Map();
          const dldIdDataMap: Map<string, string> = new Map();
          ldIdDataMap.set(queryId as string, "1");
          dldIdDataMap.set(queryId as string, "1");
          ldValuesAll.set(queryId as string, ldIdDataMap);
          dldValuesAll.set(queryId as string, dldIdDataMap);
        }
      } else {
        let ldQuery;
        if (input.population === "EUR") {
          ldQuery = prisma.ld_v2_eur.findMany({
            select: { id: true, ld: true },
            where: { id: { in: validLDsnps as string[] } },
          });
        } else if (input.population === "AFR") {
          ldQuery = prisma.ld_v2_afr.findMany({
            select: { id: true, ld: true },
            where: { id: { in: validLDsnps as string[] } },
          });
        } else if (input.population === "AMR") {
          ldQuery = prisma.ld_v2_amr.findMany({
            select: { id: true, ld: true },
            where: { id: { in: validLDsnps as string[] } },
          });
        } else if (input.population === "ASN") {
          ldQuery = prisma.ld_v2_asn.findMany({
            select: { id: true, ld: true },
            where: { id: { in: validLDsnps as string[] } },
          });
        } else {
          return NextResponse.json({
            input: input,
            error: "Impossible failure 2",
          });
        }
        const ldData = await ldQuery;
        const nonLinkedSnps: Array<string> = validLDsnps.filter(
          (validLDsnps) =>
            !ldData.map((ldData) => ldData.id).includes(validLDsnps as string)
        ) as string[];
        for (const idLdData of ldData) {
          const ldString: string =
            idLdData.ld ?? assert.fail("ld_v2_inputPopulation is incorrect");
          const ldArray: Array<string> = ldString.split(";");
          const ldIdDataMap: Map<string, string> = new Map();
          const dldIdDataMap: Map<string, string> = new Map();
          for (const relatedIdData of ldArray) {
            const relatedIdList = relatedIdData.split(",");
            const id = relatedIdList[0];
            const ld = relatedIdList[1];
            const dld = relatedIdList[2];
            if (Number(ld) >= input.ld) {
              ldIdDataMap.set(id, ld);
              dldIdDataMap.set(id, dld);
            }
          }
          const id = idLdData.id;
          ldIdDataMap.set(id, "1");
          dldIdDataMap.set(id, "1");
          ldValuesAll.set(id, ldIdDataMap);
          dldValuesAll.set(id, dldIdDataMap);
        }
        for (const nonLinkedId of nonLinkedSnps) {
          const ldIdDataMap: Map<string, string> = new Map([
            [nonLinkedId, "1"],
          ]);
          const dldIdDataMap: Map<string, string> = new Map([
            [nonLinkedId, "1"],
          ]);
          ldValuesAll.set(nonLinkedId, ldIdDataMap);
          dldValuesAll.set(nonLinkedId, dldIdDataMap);
        }
        for (const noLDsnp of noLDSnps) {
          const ldIdDataMap: Map<string, string> = new Map([
            [noLDsnp as string, "1"],
          ]);
          const dldIdDataMap: Map<string, string> = new Map([
            [noLDsnp as string, "1"],
          ]);
          ldValuesAll.set(noLDsnp as string, ldIdDataMap);
          dldValuesAll.set(noLDsnp as string, dldIdDataMap);
        }
      }
    } else if (queryLock === QueryType.ChrRange) {
      const totalElements = snps.reduce(
        (sum, subArray) => sum + subArray.length,
        0
      );
      if (totalElements > MAX_QUERY) {
        return NextResponse.json({
          input: input,
          error: `Error: query length exceeds ${MAX_QUERY}.`,
        });
      }
      for (let i = 0; i < snps.length; i++) {
        const track: string[] = snps[i] as string[];
        if (track.length === 0) {
          let empty_range: string;
          if (inputType === "query") {
            empty_range = input.query.split(",").map((item) => item.trim())[i];
          } else if (inputType === "file") {
            empty_range = input.file.split("\n").map((item) => item.trim())[i];
          } else {
            return NextResponse.json({
              input: input,
              error: "Impossible failure 3",
            });
          }
          return NextResponse.json({
            input: input,
            error: `Error: No SNPs found in range: ${empty_range!}. Please fix your query to only include ranges with SNPs in the database.`,
          });
        } else {
          ldValuesAll.set(
            track[0],
            track.reduce((map, id) => map.set(id as string, "0"), new Map())
          );
          dldValuesAll.set(
            track[0],
            track.reduce((map, id) => map.set(id as string, "0"), new Map())
          );
        }
      }
    } else {
      return NextResponse.json({
        input: input,
        error: "Impossible failure 4",
      });
    }

    /**
     * @description                                Creates a map of key snps with frequency tags and their associated snps as values
     * @returns {Map<string, Array<string>>}       returnMap - the aforementioned map
     * @throws                                     mainQueryFailure ranges end up containing too many snps, or if region was empty
     */
    const returnMap: Map<string, Array<string>> = new Map();
    if (queryLock === QueryType.SnpList || queryLock === QueryType.Unknown) {
      const result: Array<Array<string>> = [];
      for (const queryId of snps) {
        const linkedIdsPerSnp: Array<string> = [];
        const idLdData =
          ldValuesAll.get(queryId as string) ??
          assert.fail("ld data map created incorrectly");
        linkedIdsPerSnp.push(...Array.from(idLdData.keys()));
        result.push(linkedIdsPerSnp);
      }
      const freqArray: Array<number> = result.map((item) => item.length);
      for (let i = 0; i < snps.length; i++) {
        returnMap.set(snps[i] + " (" + freqArray[i] + ")", result[i]);
      }
    } else if (queryLock === QueryType.ChrRange) {
      const result: Array<Array<string>> = [];
      for (let i = 0; i < snps.length; i++) {
        const track: string[] = snps[i] as string[];
        result.push(track);
      }
      const leadingPositions: Array<string> = [];
      if (inputType === "query") {
        leadingPositions.push(
          ...input.query
            .split(",")
            .map((item) => item.trim())
            .map((item) => item.split("-")[0])
        );
      } else if (inputType === "file") {
        leadingPositions.push(
          ...input.file
            .split("\n")
            .map((item) => item.trim())
            .map((item) => item.split("-")[0])
        );
      } else {
        return NextResponse.json({
          input: input,
          error: "Impossible failure 5",
        });
      }
      const freqArray: Array<number> = result.map((item) => item.length);
      for (let i = 0; i < snps.length; i++) {
        // will throw error if snp doesnt have a pos in hg38 table
        returnMap.set(
          leadingPositions[i] + " (" + freqArray[i] + ")",
          result[i]
        );
      }
    } else {
      return NextResponse.json({
        input: input,
        error: "Impossible failure 6",
      });
    }

    /**
     * @description                                Fills main haploblock table with data & caches results
     * @returns                                    List (served v cached data) of lists (haploblocks/regions) of lists (snps) of lists (data or list of data)
     * @throws
     */
    const metadataMap = new Map(Object.entries(staticMetadataList));
    const queriedIds: Array<string> = [];
    if (queryLock === QueryType.ChrRange) {
      queriedIds.push(...snps.map((snp) => snp[0]));
    } else {
      queriedIds.push(...(snps as Array<string>));
    }
    const resultPromises: Array<Promise<Array<Array<Array<string>>>>> = [];
    const result: Array<Array<Array<Array<string>>>> = [];
    for (const queryId of queriedIds) {
      const linkedIdsPerSnp: Array<string> = [];
      if (queryLock === QueryType.ChrRange) {
        linkedIdsPerSnp.push(...ldValuesAll.get(queryId)!.keys());
      } else if (input.ld === 0.0) {
        linkedIdsPerSnp.push(queryId);
      } else {
        const idLdData =
          ldValuesAll.get(queryId) ??
          assert.fail("ld data map created incorrectly");
        linkedIdsPerSnp.push(...Array.from(idLdData.keys()));
      }
      resultPromises.push(
        compileHaploblock(
          queryId,
          input,
          metadataMap,
          ldValuesAll,
          dldValuesAll,
          linkedIdsPerSnp
        )
      );
    }
    result.push(...(await Promise.all(resultPromises)));
    const servedData = result.map((result) => result[0]);

    return NextResponse.json({
      input: input,
      success: {
        igvExplorerResult: Object.fromEntries(returnMap.entries()),
        headers: queriedIds,
        result: servedData,
      },
    });
  } catch (error) {
    // if there is any other unexpected error
    console.log(error);
    return NextResponse.json({
      input: input,
      error:
        "Unexpected error occured in HQ. Please email haploreg@mit.edu with a screenshot of this page. Thank you!",
    });
  }
}
