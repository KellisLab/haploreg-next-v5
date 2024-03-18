import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import enrichment from "./helpers/enrichment";
import { InputOptions } from "@/app/components/Query/Input/dataManagement/inputReducer";
import QueryType from "@/app/types/QueryType";
import mapToObjectRec from "./helpers/mapToObjectRec";
import { StreamEffects } from "@/app/components/Query/Explorer/hooks/useHaploBlockEnrichment";
import { PrefixPathnameNormalizer } from "next/dist/server/future/normalizers/request/prefix";

interface snpInfo {
  chr: any;
  pos: any;
  id: any;
}

interface enhancerInfo {
  start: any;
  end: any;
  tissue_id: any;
  tissue_name: any;
}

prisma.$on("query", (e) => {
  QUERY_TIME += e.duration;
  //   console.log('Query: ' + e.query);
  //   console.log('Params: ' + e.params);
  //   console.log('Duration: ' + e.duration + 'ms');
});

let QUERY_TIME: number = 0;
const MAX_DIST = 3000;
const MAX_INTERVAL: number = 10000000;
const MAX_QUERY: number = 10000;
const CHR_RANGE_PARSER: RegExp =
  /^chr(?<chr>\d+):(?<startPos>\d+)-(?<endPos>\d+)/;

export async function GET(request: NextRequest) {
  QUERY_TIME = 0;
  const start = performance.now();
  console.log("start compileExplorer");

  const searchParams = request.nextUrl.searchParams;
  const input = JSON.parse(searchParams.get("input")!) as InputOptions;

  const inputType = input.inputType;
  let queryLock: QueryType = input.queryType;

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

  const first = performance.now();
  const firstTime = first - start;
  console.log(`compileExplorer to end first prisma: ${firstTime} milliseconds`);

  const flatSnps = snps.flat();

  const streamEffects: Map<string, StreamEffects> = new Map();
  const tissueNameMap: Map<string, string> = new Map();
  const snpNameMap: Map<string, string> = new Map();

  try {
    const snpPositions: { chr: any; pos: any; id: any; motifs: any }[] =
      await prisma.snp_v2.findMany({
        select: { chr: true, pos: true, id: true, motifs: true },
        where: {
          id: {
            in: flatSnps,
          },
        },
        orderBy: [{ chr: "asc" }, { pos: "asc" }],
      });
    // SELECT chr, pos, id from snp_v2 WHERE id IN ('rs10', 'rs15', 'rs20', 'rs28716236') ORDER BY chr, pos

    const second = performance.now();
    const secondTime = second - start;
    console.log(
      `compileExplorer to end second prisma: ${secondTime} milliseconds`
    );

    const allEnhancerPromises = [];
    const max_dist = input.proximityLimit;
    for (const snp of snpPositions) {
      streamEffects.set(snp.id, {
        motifs: snp.motifs
          .split(";")
          .map((item: string, index: number) => item.split(",")[0]),
      });
      // for all snps that are of interest
      snpNameMap.set(snp.id, snp.chr + "_" + snp.pos);
      const chrNumName = "chr" + snp.chr;
      const snpEnhancers = prisma.bss.findMany({
        select: { start: true, end: true, tissue_id: true, tissue_name: true },
        where: {
          AND: [
            { chr: chrNumName },
            { start: { gte: snp.pos - max_dist } },
            { end: { lte: snp.pos + max_dist } },
          ],
        },
      });
      allEnhancerPromises.push(snpEnhancers);
    }

    console.log("waiting on queries to return");

    const allEnhancers = await Promise.all(allEnhancerPromises);
    const snpEnhancerPairs = snpPositions.map((obj, index) => [
      obj,
      allEnhancers[index],
    ]);

    const third = performance.now();
    const thirdTime = third - start;
    console.log(
      `compileExplorer to end third prisma: ${thirdTime} milliseconds`
    );

    // console.log(allEnhancers);

    const allEnrichments: Map<string, Map<string, number>> = new Map();
    const closestEnhancers: Map<string, Map<string, number>> = new Map();
    for (const pair of snpEnhancerPairs) {
      const snp: snpInfo = pair[0] as snpInfo;
      const enhancers: enhancerInfo[] = pair[1] as enhancerInfo[];
      const snpEnrichment: Map<string, number> = new Map();
      const snpEnhProximity: Map<string, number> = new Map();
      for (const enhancer of enhancers) {
        tissueNameMap.set(enhancer.tissue_id, enhancer.tissue_name);
        const enrichmentStats = enrichment(
          snp.pos,
          enhancer.start!,
          enhancer.end!
        );
        const enrichmentValue: number = enrichmentStats[0];
        const nearestEnhancer: number = enrichmentStats[1];
        snpEnrichment.set(
          enhancer.tissue_id,
          enrichmentValue + (snpEnrichment.get(enhancer.tissue_id) ?? 0)
        );
        snpEnhProximity.set(
          enhancer.tissue_id,
          Math.min(
            nearestEnhancer,
            snpEnhProximity.get(enhancer.tissue_id) ?? max_dist + 1
          )
        );
      }
      allEnrichments.set(snp.id, snpEnrichment);
      closestEnhancers.set(snp.id, snpEnhProximity);
    }

    // console.log(allEnrichments);
    // console.log(closestEnhancers);
    // console.log(tissueNameMap);
    // console.log(snpNameMap);

    const end = performance.now();
    const executionTime = end - start;
    console.log("---");
    console.log(
      `compileExplorer execution time: ${executionTime} milliseconds`
    );
    console.log(`compileExplorer query time: ${QUERY_TIME} milliseconds`);
    console.log("---");

    return NextResponse.json({
      input: input,
      success: {
        streamEffects: mapToObjectRec(streamEffects),
        enrichments: mapToObjectRec(allEnrichments),
        closestEnhancers: mapToObjectRec(closestEnhancers),
        tissueNameMap: mapToObjectRec(tissueNameMap),
        snpNameMap: mapToObjectRec(snpNameMap),
      },
    });
  } catch (error) {
    // if there is any other unexpected error
    console.log(error);
    return NextResponse.json({
      input: input,
      error:
        "Unexpected error occured in CE. Please email haploreg@mit.edu with a screenshot of this page. Thank you!",
    });
  }
}

// const snpEnrichments = [];
// const bss00043 = prisma.bss00043_adip_tissue.findMany({
//   select: { start: true, end: true },
//   where: {
//     AND: [
//       { chr: chrNumName },
//       { start: { gte: snp.pos - 2500 } },
//       { end: { lte: snp.pos + 2500 } },
//     ],
//   },
// });
// const bss00471 = prisma.bss00471_lcl_lcl_gm19238.findMany({
//   // find all enhancers
//   select: { start: true, end: true },
//   where: {
//     AND: [
//       { chr: chrNumName },
//       { start: { gte: snp.pos - 2500 } },
//       { end: { lte: snp.pos + 2500 } },
//     ],
//   },
// });
// snpEnrichments.push(bss00043);
// snpEnrichments.push(bss00471);
// const enrichments = await Promise.all(snpEnrichments);

// for each tissue, calculate enrichment

// for (const tissue of enrichments) {
//   //
//   let totalEnrichment = 0;
//   for (const enhancer of tissue) {
//     const enrichmentVal = enrichment(
//       snp.pos,
//       enhancer.start!,
//       enhancer.end!
//     );
//     totalEnrichment += enrichmentVal[0];
//   }
//   allEnrichments.set(snp.id, [
//     ...(allEnrichments.get(snp.id) ?? []),
//     totalEnrichment,
//   ]);
// }
// }
