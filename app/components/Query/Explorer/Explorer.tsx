import { useEffect, useState } from "react";
import ControlPanel from "./EnrichmentHeatmap/components/ControlPanel";
import EnrichmentHeatmap from "./EnrichmentHeatmap/components/EnrichmentHeatmap";
import StreamEffectsTable from "./EnrichmentHeatmap/components/StreamEffectsTable";
import { EnrichmentDataType } from "./hooks/useHaploBlockEnrichment";

export interface SavedStreamEffects {
  label: string;
  snpFilters: string[];
  tissueFilters: string[];
  snpRanking: [string, number][];
  // motifs: string[];
}
interface Props {
  enrichmentData: EnrichmentDataType;
  explorerSubmit: () => void;
}

let tab_default_label = 1;
let changed_filters = 1;

const Explorer = ({ enrichmentData, explorerSubmit }: Props) => {
  const [tissueFilter, setTissueFilter] = useState<string[]>([]);
  const [snpFilter, setSnpFilter] = useState<string[]>([]);
  const [appliedTissueFilter, setAppliedTissueFilter] = useState<string[]>([]);
  const [appliedSnpFilter, setAppliedSnpFilter] = useState<string[]>([]);

  const [streamEffectLabel, setStreamEffectName] = useState("");
  const [savedStreamEffects, setSavedStreamEffects] = useState<
    SavedStreamEffects[]
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
  const tissueRanking = [...tissueEnrichments.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20); // top <x> tissues

  useEffect(() => {
    setSavedStreamEffects([
      {
        label: "current",
        snpFilters: snpFilter,
        tissueFilters: tissueFilter,
        snpRanking: snpRanking,
      },
      ...savedStreamEffects.filter((data) => data.label !== "current"),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changed_filters]);

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
    changed_filters++;
  };

  const handleApply = () => {
    setAppliedTissueFilter(tissueFilter);
    setAppliedSnpFilter(snpFilter);
    changed_filters++;
  };

  const handleRevert = () => {
    if (currentTab === 0) return;
    // set filters to the ones that yielded the results in savedStreamEffects[currentTab]
    setTissueFilter(savedStreamEffects[currentTab].tissueFilters);
    setSnpFilter(savedStreamEffects[currentTab].snpFilters);
    setAppliedTissueFilter(savedStreamEffects[currentTab].tissueFilters);
    setAppliedSnpFilter(savedStreamEffects[currentTab].snpFilters);
    changed_filters++;
    return;
  };

  const handleAdd = () => {
    setSavedStreamEffects([
      ...savedStreamEffects,
      {
        label: streamEffectLabel
          ? streamEffectLabel
          : String(tab_default_label),
        snpFilters: snpFilter,
        tissueFilters: tissueFilter,
        snpRanking: snpRanking,
      },
    ]);
    tab_default_label++;
  };

  const changeCurrentTab = (idx: number) => {
    setCurrentTab(idx);
  };

  const handleDelete = (deleteLabel: string) => {
    setSavedStreamEffects(
      savedStreamEffects.filter((data) => data.label !== deleteLabel)
    );
    if (deleteLabel === savedStreamEffects[currentTab].label)
      setCurrentTab(currentTab - 1);
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
          streamEffectLabel={streamEffectLabel}
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
              currentTab={currentTab}
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
