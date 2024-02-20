import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import enrichment from "./helpers/enrichment";
import { InputOptions } from "@/app/components/Query/Input/dataManagement/inputReducer";
import QueryType from "@/app/types/QueryType";

const MAX_INTERVAL: number = 10000000;
const MAX_QUERY: number = 10000;
const CHR_RANGE_PARSER: RegExp =
  /^chr(?<chr>\d+):(?<startPos>\d+)-(?<endPos>\d+)/;

export async function GET(request: NextRequest) {
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

  const flatSnps = snps.flat();

  try {
    const snpPositions: { chr: any; pos: any; id: any }[] =
      await prisma.snp_v2.findMany({
        select: { chr: true, pos: true, id: true },
        where: {
          id: {
            in: flatSnps,
          },
        },
        orderBy: [{ chr: "asc" }, { pos: "asc" }],
      });
    // SELECT chr, pos, id from snp_v2 WHERE id IN ('rs10', 'rs15', 'rs20', 'rs28716236') ORDER BY chr, pos

    const allEnrichments = [];
    for (const snp of snpPositions) {
      // for all snps that are of interest
      const chrNumName = "chr" + snp.chr;
      const enhancers = await prisma.lcl_gm19238.findMany({
        // find all enhancers
        select: { start: true, end: true },
        where: {
          AND: [
            { chr: chrNumName },
            { start: { gte: snp.pos - 2500 } },
            { end: { lte: snp.pos + 2500 } },
          ],
        },
      });
      // for each enhancer, calculate enrichment
      let totalEnrichment = 0;
      for (const enhancer of enhancers) {
        const enrichmentVal = enrichment(
          snp.pos,
          enhancer.start!,
          enhancer.end!
        );
        totalEnrichment += enrichmentVal[0];
      }
      allEnrichments.push(totalEnrichment);
    }

    return NextResponse.json({
      input: input,
      success: {
        data: allEnrichments,
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
