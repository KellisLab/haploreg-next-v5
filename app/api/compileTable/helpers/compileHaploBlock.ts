import prisma from "@/prisma/client";
import { condenseLists, condenseOligos, humanReadable } from "./condenseInfo";
import {
  addEpigenomeSource,
  cacheEpigenomeSource,
  findEnhProStates,
} from "./findEnhPro";
import { InputOptions } from "@/app/components/Query/Input/dataManagement/inputReducer";

export async function compileHaploblock(
  queryId: string,
  input: InputOptions,
  metadataMap: any,
  ldValuesAll: Map<string, Map<string, string>>,
  dldValuesAll: Map<string, Map<string, string>>,
  linkedIdsPerSnp: Array<string>
): Promise<any> {
  const dataForQueriedSnp: Array<Array<string>> = [];
  const allDataForCache: Array<Array<string | Array<string>>> = [];

  //
  const inputSource = input.source;
  const inputCondenseLists = input.condenseLists;
  const inputCondenseOligos = input.condenseOligos;

  for (const linkedId of linkedIdsPerSnp) {
    // console.log(linkedId, 'not found, querying db');
    const dataForLinkedSnp: Array<string> = [];
    const dataForCache: Array<string | Array<string>> = [];

    const snpQuery = prisma.snp_v2.findMany({ where: { id: linkedId } }); // TODO we should select for specific data here
    const hg38Query = prisma.hg38.findMany({ where: { id: linkedId } }); //TODO
    const dnase_v3Query = prisma.dnase_v3.findMany({
      select: { dnase_v3: true },
      where: { id: linkedId },
    }); // TODO

    const epigenomeSourceQuery = [
      prisma.vanillastates.findMany({
        select: { states: true },
        where: { id: linkedId },
      }),
      prisma.imputedstates.findMany({
        select: { states: true },
        where: { id: linkedId },
      }),
      prisma.marks_v4.findMany({
        select: { marks_v4: true },
        where: { id: linkedId },
      }),
    ];

    const gwasQuery = prisma.nhgri_per_snp_201511.findMany({
      select: { associations: true },
      where: { rsid: linkedId },
    });
    const qtlQuery = prisma.grasp_qtl_201511.findMany({
      select: { associations: true },
      where: { rsid: linkedId },
    });
    const eQtlQuery = prisma.eqtl_201511.findMany({
      select: { marks_v4: true },
      where: { id: linkedId },
    });

    // Sequence Facts
    const hg38 = await hg38Query;
    if (hg38.length === 0) {
      dataForLinkedSnp.push(
        "",
        "",
        ldValuesAll.get(queryId)!.get(linkedId)!,
        dldValuesAll.get(queryId)!.get(linkedId)!,
        linkedId
      );
      dataForCache.push("", "", "-100", "-100", linkedId);
    } else {
      dataForLinkedSnp.push(
        hg38[0].chr!,
        String(hg38[0].pos!),
        ldValuesAll.get(queryId)!.get(hg38[0].id)!,
        dldValuesAll.get(queryId)!.get(hg38[0].id)!,
        linkedId
      );
      dataForCache.push(
        hg38[0].chr!,
        String(hg38[0].pos!),
        "-100",
        "-100",
        linkedId
      );
    }

    const snp = await snpQuery; // TODO
    dataForLinkedSnp.push(
      condenseOligos(snp[0].ref!, inputCondenseOligos),
      condenseOligos(snp[0].alt!, inputCondenseOligos)
    );
    dataForCache.push(snp[0].ref!, snp[0].alt!);

    dataForLinkedSnp.push(
      snp[0].afr!.toFixed(2),
      snp[0].amr!.toFixed(2),
      snp[0].asn!.toFixed(2),
      snp[0].eur!.toFixed(2)
    );
    dataForCache.push(
      snp[0].afr!.toFixed(2),
      snp[0].amr!.toFixed(2),
      snp[0].asn!.toFixed(2),
      snp[0].eur!.toFixed(2)
    );
    //

    // GERP/SIPhy
    dataForLinkedSnp.push(
      String(snp[0].gerp) ?? "",
      String(snp[0].omega) ?? ""
    ); // GERP & SIPhy cons
    dataForCache.push(String(snp[0].gerp) ?? "", String(snp[0].omega) ?? "");
    //

    // promoters & enhancers

    const allStatesData = await Promise.all(epigenomeSourceQuery);

    const epigenomeSourceData = findEnhProStates(allStatesData, metadataMap);
    const addedData = addEpigenomeSource(
      dataForLinkedSnp,
      epigenomeSourceData,
      inputSource,
      inputCondenseLists
    );
    const cachedData = cacheEpigenomeSource(dataForCache, epigenomeSourceData); // TODO cluster module for parallelization

    //

    // DNAse
    const eids: string[] = [];

    const dnase_v3 = await dnase_v3Query;
    const toAdd =
      dnase_v3.length !== 0 ? dnase_v3[0].dnase_v3?.split(";") ?? [] : [];
    eids.push(...toAdd);

    const dnaseTissues: string[] = [];
    const dnaseLongnames: string[] = [];
    for (let i = 0; i < eids.length; i++) {
      let shortname: string;
      let longname: string;

      if (metadataMap.has(eids[i])) {
        shortname = metadataMap.get(eids[i])![0];
        longname = metadataMap.get(eids[i])![1];
      } else {
        throw new Error("eid not found in metadataMap");
      }

      dnaseTissues.push(shortname);
      dnaseLongnames.push(longname);
    }

    const uniqueDNAseTissues = Array.from(new Set(dnaseTissues));
    const nUniqueTissues = uniqueDNAseTissues.length;

    await addedData;
    await cachedData;

    if (nUniqueTissues > 0) {
      dataForLinkedSnp.push(
        condenseLists(dnaseTissues, " tissues", inputCondenseLists)
      );
      dataForCache.push(dnaseTissues.join(", "));
    } else {
      dataForLinkedSnp.push("");
      dataForCache.push("");
    }

    // THEN PUSH DNASE LONGNAMES

    //

    // Proteins Bound
    const proteins = [];
    const toAddProteins =
      snp[0].proteins === "." ? [] : snp[0].proteins?.split(";") ?? [];
    proteins.push(...toAddProteins.map((protein) => protein.split(",")[1]));
    const uniqueProteins = Array.from(new Set(proteins));
    if (uniqueProteins.length > 0) {
      dataForLinkedSnp.push(
        condenseLists(uniqueProteins, " bound proteins", inputCondenseLists)
      ); // TODO hover data
      dataForCache.push(uniqueProteins.join(", "));
      // THEN PUSH UNIQUE PROTEINS (Array.from(uniqueProteins).join(', ')) FOR HOVER DATA
    } else {
      dataForLinkedSnp.push("");
      dataForCache.push("");
      // THEN PUSH EMPTY STRING FOR NO HOVER DATA
    }
    //

    // Motifs
    const motifs = [];
    const toAddMotifs =
      snp[0].motifs === "." ? [] : snp[0].motifs?.split(";") ?? [];
    motifs.push(
      ...toAddMotifs.map((motif) => motif.split(",")[0].split("_")[0])
    );
    const uniqueMotifs = Array.from(new Set(motifs));
    if (uniqueMotifs.length > 0) {
      dataForLinkedSnp.push(
        condenseLists(uniqueMotifs, " altered motifs", inputCondenseLists)
      ); // TODO hover data
      dataForCache.push(uniqueMotifs.join(", "));
      // THEN PUSH UNIQUE MOTIFS (Array.from(uniqueMotifs).join(', ')) FOR HOVER DATA
    } else {
      dataForLinkedSnp.push("");
      dataForCache.push("");
      // THEN PUSH EMPTY STRING FOR NO HOVER DATA
    }
    //

    // GWAS hits
    const gwas = await gwasQuery;
    if (gwas.length > 0) {
      const gwasHits = gwas[0].associations?.split(";") ?? [];
      const nGwasHits = gwasHits.length;
      dataForLinkedSnp.push(String(nGwasHits + " hits"));
      dataForCache.push(String(nGwasHits + " hits"));
      // THEN PUSH ENTIRE ASSOCIATIONS STRING FOR HOVER DATA
      // dataForLinkedSnp.push(gwas[0].associations ?? '');
    } else {
      dataForLinkedSnp.push("");
      dataForCache.push("");
    }
    //

    // QTL
    const qtl = await qtlQuery;
    if (qtl.length > 0) {
      const qtlHits = qtl[0].associations?.split(";") ?? [];
      const nQtlHits = qtlHits.length;
      dataForLinkedSnp.push(String(nQtlHits + " hits"));
      dataForCache.push(String(nQtlHits + " hits"));
      // THEN PUSH ENTIRE ASSOCIATIONS STRING FOR HOVER DATA
      // dataForLinkedSnp.push(qtl[0].associations ?? '');
    } else {
      dataForLinkedSnp.push("");
      dataForCache.push("");
    }
    //

    // eQTL
    const eQtl = await eQtlQuery;
    if (eQtl.length > 0) {
      const eQtlHits = eQtl[0].marks_v4?.split(";") ?? [];
      const nEQtlHits = eQtlHits.length;
      dataForLinkedSnp.push(String(nEQtlHits + " hits"));
      dataForCache.push(String(nEQtlHits + " hits"));
      // THEN PUSH ENTIRE MARKS_V4 STRING FOR HOVER DATA
      // dataForLinkedSnp.push(eQtl[0].marks_v4 ?? '');
    } else {
      dataForLinkedSnp.push("");
      dataForCache.push("");
    }
    //

    // GENCODE/RefSeq /
    const gencodeName = snp[0].gencode_name;
    if (snp[0].gencode_distance === 0) {
      dataForLinkedSnp.push(gencodeName ?? "");
      dataForCache.push(gencodeName ?? "");
    } else {
      const gencodeDistance = snp[0].gencode_distance!;
      dataForLinkedSnp.push(
        humanReadable(gencodeDistance) +
          " " +
          snp[0].gencode_direction +
          "' of " +
          gencodeName
      );
      dataForCache.push(
        humanReadable(gencodeDistance) +
          " " +
          snp[0].gencode_direction +
          "' of " +
          gencodeName
      );
    }

    const refseqName = snp[0].refseq_name;
    if (snp[0].refseq_distance === 0) {
      dataForLinkedSnp.push(refseqName ?? "");
      dataForCache.push(refseqName ?? "");
    } else {
      const refseqDistance = snp[0].refseq_distance!;
      dataForLinkedSnp.push(
        humanReadable(refseqDistance) +
          " " +
          snp[0].refseq_direction +
          "' of " +
          refseqName
      );
      dataForCache.push(
        humanReadable(refseqDistance) +
          " " +
          snp[0].refseq_direction +
          "' of " +
          refseqName
      );
    }
    //

    // dbSNP func annot
    const functionalAnnotation = snp[0].consequences!;
    if (functionalAnnotation === ".") {
      dataForLinkedSnp.push("");
      dataForCache.push("");
    } else {
      const annotations = functionalAnnotation.split(";");
      if (annotations.includes("NSF")) {
        dataForLinkedSnp.push("frameshift");
        dataForCache.push("frameshift");
      } else if (annotations.includes("NSN")) {
        dataForLinkedSnp.push("nonsense");
        dataForCache.push("nonsense");
      } else if (annotations.includes("NSM")) {
        dataForLinkedSnp.push("missense");
        dataForCache.push("missense");
      } else if (annotations.includes("ASS")) {
        dataForLinkedSnp.push("splice acceptor");
        dataForCache.push("splice acceptor");
      } else if (annotations.includes("DSS")) {
        dataForLinkedSnp.push("splice donor");
        dataForCache.push("splice donor");
      } else if (annotations.includes("SYN")) {
        dataForLinkedSnp.push("synonymous");
        dataForCache.push("synonymous");
      } else if (annotations.includes("U5")) {
        dataForLinkedSnp.push("5'-UTR");
        dataForCache.push("5'-UTR");
      } else if (annotations.includes("U3")) {
        dataForLinkedSnp.push("3'-UTR");
        dataForCache.push("3'-UTR");
      } else if (annotations.includes("INT")) {
        dataForLinkedSnp.push("intronic");
        dataForCache.push("intronic");
      }
    }
    dataForQueriedSnp.push(dataForLinkedSnp); // TODO write snp data to cache
    allDataForCache.push(dataForCache);
  }

  return [dataForQueriedSnp, allDataForCache];
}
