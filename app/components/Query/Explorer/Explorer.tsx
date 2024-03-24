import { useEffect, useState } from "react";
import DNALoadingSpinner from "../../Loader/DNALoadingSpinner";
import ControlPanel from "./EnrichmentHeatmap/components/ControlPanel";
import EnrichmentHeatmap from "./EnrichmentHeatmap/components/EnrichmentHeatmap";
import StreamEffectsTable from "./EnrichmentHeatmap/components/StreamEffectsTable";
import { EnrichmentDataType } from "./hooks/useHaploBlockEnrichment";

export interface StreamEffectsRef {
  handleAdd: () => void;
}

interface Props {
  enrichmentData: EnrichmentDataType;
  explorerSubmit: () => void;
}

let tab_default_name = 1;

const Explorer = ({ enrichmentData, explorerSubmit }: Props) => {
  const [tissueFilter, setTissueFilter] = useState<string[]>([]);
  const [snpFilter, setSnpFilter] = useState<string[]>([]);
  const [appliedTissueFilter, setAppliedTissueFilter] = useState<string[]>([]);
  const [appliedSnpFilter, setAppliedSnpFilter] = useState<string[]>([]);

  const [streamEffectName, setStreamEffectName] = useState("");
  const [savedStreamEffects, setSavedStreamEffects] = useState<
    [string, [string, number][]][]
  >([]);
  const [currentTab, setCurrentTab] = useState<number>(0);

  let partiallyFilteredEnrichments = [...enrichmentData.enrichments.entries()];
  if (appliedSnpFilter.length !== 0) {
    partiallyFilteredEnrichments = partiallyFilteredEnrichments.filter(
      (value) => appliedSnpFilter.includes(value[0])
    );
  }

  let enrichmentsToUse: Array<Array<string | Array<Array<string | number>>>>;
  if (appliedTissueFilter.length !== 0) {
    enrichmentsToUse = partiallyFilteredEnrichments.map((enrichments) => [
      enrichments[0],
      [...enrichments[1].entries()].filter((value) =>
        appliedTissueFilter.includes(value[0])
      ),
    ]);
  } else {
    // if nothing is selected, then just show everything (but still need to convey type)
    enrichmentsToUse = partiallyFilteredEnrichments.map((enrichments) => [
      enrichments[0],
      [...enrichments[1].entries()],
    ]);
  }

  const tissueEnrichments: Map<string, number> = new Map();
  const snpEnrichments: Map<string, number> = new Map();

  for (const snpEntry of enrichmentsToUse) {
    const snp: string = snpEntry[0] as string;
    const enrichments: Array<any> = snpEntry[1] as Array<any>;
    for (const tissueEntry of enrichments) {
      const tissue: string = tissueEntry[0] as string;
      const enrichment: number = tissueEntry[1] as number;
      tissueEnrichments.set(
        tissue,
        enrichment + (tissueEnrichments.get(tissue) ?? 0)
      );
      snpEnrichments.set(snp, enrichment + (snpEnrichments.get(snp) ?? 0));
    }
  }

  const snpRanking = [...snpEnrichments.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7); // take top 7 snps for now
  const tissueRanking = [...tissueEnrichments.entries()].sort(
    (a, b) => b[1] - a[1]
  );
  // .slice(0, 10); // top 15 tissues

  useEffect(() => {
    console.log("effect");
    console.log(snpRanking);
    setSavedStreamEffects([["current", snpRanking]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTissueSelect = (e: string) => {
    if (tissueFilter.includes(e)) {
      setTissueFilter(tissueFilter.filter((value) => value != e));
    } else {
      setTissueFilter([...tissueFilter, e]);
    }
  };

  const handleSnpSelect = (e: string) => {
    if (snpFilter.includes(e)) {
      setSnpFilter(snpFilter.filter((value) => value != e));
    } else {
      setSnpFilter([...snpFilter, e]);
    }
  };

  const handleReset = () => {
    setTissueFilter([]);
    setSnpFilter([]);
    setAppliedTissueFilter([]);
    setAppliedSnpFilter([]);
  };

  const handleApply = () => {
    setAppliedTissueFilter(tissueFilter);
    setAppliedSnpFilter(snpFilter);
  };

  const handleRevert = () => {
    if (currentTab === 0) return;
    // set filters to the ones that yielded the results in savedStreamEffects[currentTab]
    return;
  };

  const handleAdd = () => {
    setSavedStreamEffects([
      ...savedStreamEffects,
      [
        streamEffectName ? streamEffectName : String(tab_default_name),
        snpRanking,
      ],
    ]);
    tab_default_name++;
    console.log(savedStreamEffects);
  };

  const changeCurrentTab = (idx: number) => {
    console.log(idx);
    setCurrentTab(idx);
  };

  const handleDelete = (deleteTitle: string) => {
    console.log(deleteTitle);
    setSavedStreamEffects(
      savedStreamEffects.filter((title) => title[0] !== deleteTitle)
    );
  };

  return (
    <div className="m-5 ">
      {/* {enrichmentData.snps.map((value, index) => (
        <div key={index}>
          <Text fontSize="xs">{value}</Text>
        </div>
      ))} */}
      <div className="p-5 h-500 rounded-md border-black border bg-gray-50">
        <ControlPanel
          explorerSubmit={() => explorerSubmit()}
          handleReset={() => handleReset()}
          handleApply={() => handleApply()}
          handleRevert={() => handleRevert()}
          handleAdd={() => handleAdd()}
          setStreamEffectName={(e) => setStreamEffectName(e)}
          streamEffectName={streamEffectName}
        />
        <div className="flex flex-row mt-5 gap-4 ">
          <EnrichmentHeatmap
            enrichmentData={enrichmentData}
            tissueFilter={tissueFilter}
            snpFilter={snpFilter}
            rankings={{ tissueRanking: tissueRanking, snpRanking: snpRanking }}
            tissueSelect={(e) => handleTissueSelect(e)}
            snpSelect={(e) => handleSnpSelect(e)}
          />
          {savedStreamEffects ? (
            <StreamEffectsTable
              savedStreamEffects={savedStreamEffects}
              streamEffects={enrichmentData.streamEffects}
              changeCurrentTab={(idx) => changeCurrentTab(idx)}
              handleDelete={(name) => handleDelete(name)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
