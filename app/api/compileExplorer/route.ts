import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import enrichment from "./helpers/enrichment";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = JSON.parse(searchParams.get("input")!); // input is list of snps

  try {
    const snpPositions: { chr: any; pos: any; id: any }[] =
      await prisma.snp_v2.findMany({
        select: { chr: true, pos: true, id: true },
        where: {
          id: {
            in: input,
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
