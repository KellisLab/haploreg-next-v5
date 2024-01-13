import { condenseLists } from "./condenseInfo";

export function findEnhProStates(
  data: ({ states: string | null }[] | { marks_v4: string | null }[])[],
  metadataMap: Map<string, Array<string>>
): Map<string, Map<string, Array<string>>> {
  const vanilla = data[0] as { states: string | null }[];
  const imputed = data[1] as { states: string | null }[];
  const marks = data[2] as { marks_v4: string | null }[];

  const vanillaStates: Array<string> =
    vanilla.length !== 0 ? vanilla[0].states?.split(";") ?? [] : [];
  const imputedStates: Array<string> =
    imputed.length !== 0 ? imputed[0].states?.split(";") ?? [] : [];
  const marks_v4_met: Array<string> =
    marks.length !== 0 ? marks[0].marks_v4?.split(";") ?? [] : [];
  const marks_v4_ace: Array<string> = [...marks_v4_met]; // shallow copy of strings

  const allProLongnames: Map<string, Array<string>> = new Map();
  const allEnhLongnames: Map<string, Array<string>> = new Map();
  const allProTissues: Map<string, Array<string>> = new Map();
  const allEnhTissues: Map<string, Array<string>> = new Map();

  const stateList = [
    [vanillaStates, "vanilla"],
    [imputedStates, "imputed"],
    [marks_v4_met, "methyl"],
    [marks_v4_ace, "acetyl"],
  ];

  for (let i = 0; i < stateList.length; i++) {
    const proLongnames: Array<string> = [];
    const enhLongnames: Array<string> = [];
    const proTissues: Array<string> = [];
    const enhTissues: Array<string> = [];

    for (const cellStatePair of stateList[i][0]) {
      const cellAndState = cellStatePair.split(",");
      const eid = cellAndState[0];
      const state = cellAndState[1];

      const shortname: string = metadataMap.get(eid)![0];
      const longname: string = metadataMap.get(eid)![1];

      if (stateList[i][1] === "vanilla") {
        // input is vanilla, same as core 15 input from most recent conditional block above
        if (/Tss/.test(state)) {
          // promoter
          proTissues.push(shortname);
          proLongnames.push(longname);
        } else if (/Enh/.test(state)) {
          // enhancer
          enhTissues.push(shortname);
          enhLongnames.push(longname);
        }
      } else if (stateList[i][1] === "imputed") {
        // input is imputed, same as 25 state input from most recent conditional block above
        if (/Tss|Prom/.test(state)) {
          proTissues.push(shortname);
          proLongnames.push(longname);
        } else if (/Enh|TxReg/.test(state)) {
          enhTissues.push(shortname);
          enhLongnames.push(longname);
        }
      } else if (stateList[i][1] === "methyl") {
        if (/H3K4me3_Pro/.test(state)) {
          // methyl
          proTissues.push(shortname);
          proLongnames.push(longname);
        } else if (/H3K4me1_Enh/.test(state)) {
          enhTissues.push(shortname);
          enhLongnames.push(longname);
        }
      } else if (stateList[i][1] === "acetyl") {
        if (/H3K9ac_Pro/.test(state)) {
          // acetyl
          proTissues.push(shortname);
          proLongnames.push(longname);
        } else if (/H3K27ac_Enh/.test(state)) {
          enhTissues.push(shortname);
          enhLongnames.push(longname);
        }
      }
    }

    allProLongnames.set(stateList[i][1] as string, proLongnames);
    allEnhLongnames.set(stateList[i][1] as string, enhLongnames);
    allProTissues.set(stateList[i][1] as string, proTissues);
    allEnhTissues.set(stateList[i][1] as string, enhTissues);
  }

  const enhProInfo: Map<string, Map<string, Array<string>>> = new Map();
  enhProInfo.set("proLongnames", allProLongnames);
  enhProInfo.set("enhLongnames", allEnhLongnames);
  enhProInfo.set("proTissues", allProTissues);
  enhProInfo.set("enhTissues", allEnhTissues);

  return enhProInfo;
}

/**
 *
 * @param dataForLinkedSnp
 * @param dataForCache
 * @param epigenomeSourceData
 * @param inputSource
 */
export async function addEpigenomeSource(
  dataForLinkedSnp: Array<string>,
  epigenomeSourceData: Map<string, Map<string, string[]>>,
  inputSource: string,
  inputCondenseLists: number
): Promise<void> {
  const proTissues: Array<string> = epigenomeSourceData
    .get("proTissues")!
    .get(inputSource)!;
  const uniqueProTissues = Array.from(new Set(proTissues));
  const proTissuesCount = uniqueProTissues.length;
  if (proTissuesCount > 0) {
    dataForLinkedSnp.push(
      condenseLists(uniqueProTissues, " tissues", inputCondenseLists)
    );
  } else {
    dataForLinkedSnp.push("");
  }

  const proLongNames: Array<string> = epigenomeSourceData
    .get("proLongnames")!
    .get(inputSource)!;
  // THEN PUSH PRO LONGNAMES

  const enhTissues: Array<string> = epigenomeSourceData
    .get("enhTissues")!
    .get(inputSource)!;

  const uniqueEnhTissues = Array.from(new Set(enhTissues));
  const enhTissuesCount = uniqueEnhTissues.length;
  if (enhTissuesCount > 0) {
    dataForLinkedSnp.push(
      condenseLists(uniqueEnhTissues, " tissues", inputCondenseLists)
    );
  } else {
    dataForLinkedSnp.push("");
  }

  const enhLongNames: Array<string> = epigenomeSourceData
    .get("enhLongnames")!
    .get(inputSource)!;
  // THEN PUSH ENH LONGNAMES
}

/**
 *
 * @param dataForCache
 * @param epigenomeSourceData
 */
export async function cacheEpigenomeSource(
  dataForCache: Array<string | Array<string>>,
  epigenomeSourceData: Map<string, Map<string, string[]>>
): Promise<void> {
  dataForCache.push([
    epigenomeSourceData.get("proTissues")!.get("vanilla")!.join(", "),
    epigenomeSourceData.get("proTissues")!.get("imputed")!.join(", "),
    epigenomeSourceData.get("proTissues")!.get("methyl")!.join(", "),
    epigenomeSourceData.get("proTissues")!.get("acetyl")!.join(", "),
  ]);
  // dataForCache.push([epigenomeSourceData.get('proLongNames')!.get('vanilla')!, epigenomeSourceData.get('proLongNames')!.get('imputed')!, epigenomeSourceData.get('proLongNames')!.get('methyl')!, epigenomeSourceData.get('proLongNames')!.get('acetyl')!]);
  dataForCache.push([
    epigenomeSourceData.get("enhTissues")!.get("vanilla")!.join(", "),
    epigenomeSourceData.get("enhTissues")!.get("imputed")!.join(", "),
    epigenomeSourceData.get("enhTissues")!.get("methyl")!.join(", "),
    epigenomeSourceData.get("enhTissues")!.get("acetyl")!.join(", "),
  ]);
  // dataForCache.push([epigenomeSourceData.get('enhLongNames')!.get('vanilla')!, epigenomeSourceData.get('enhLongNames')!.get('imputed')!, epigenomeSourceData.get('enhLongNames')!.get('methyl')!, epigenomeSourceData.get('enhLongNames')!.get('acetyl')!]);
}
