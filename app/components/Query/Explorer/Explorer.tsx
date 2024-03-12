import React, { useContext, useState, useRef } from "react";
import { EnrichmentDataType } from "./hooks/useHaploBlockEnrichment";
import EnrichmentHeatmap from "./EnrichmentHeatmap/components/EnrichmentHeatmap";
import {
  HStack,
  Input,
  Button,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import InputContext from "../Input/dataManagement/inputContext";
import { InputFields } from "../Input/dataManagement/inputReducer";
import StreamEffectsTable from "./EnrichmentHeatmap/components/components/StreamEffectsTable";
import DNALoadingSpinner from "../../Loader/DNALoadingSpinner";

export interface StreamEffectsRef {
  handleAdd: () => void;
}

interface Props {
  enrichmentData: EnrichmentDataType;
  explorerSubmit: () => void;
}

const Explorer = ({ enrichmentData, explorerSubmit }: Props) => {
  const { inputOptions, dispatch } = useContext(InputContext);
  const saveStreamEffectsRef = useRef<StreamEffectsRef | null>(null);
  const [streamEffectName, setStreamEffectName] = useState("");

  const [tissueFilter, setTissueFilter] = useState<string[]>([]);
  const [snpFilter, setSnpFilter] = useState<string[]>([]);
  const [appliedTissueFilter, setAppliedTissueFilter] = useState<string[]>([]);
  const [appliedSnpFilter, setAppliedSnpFilter] = useState<string[]>([]);

  if (enrichmentData.isCELoading) {
    return <DNALoadingSpinner />;
  } else if (!enrichmentData.enrichments) {
    return null;
  }

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
    .slice(0, 7);
  const tissueRanking = [...tissueEnrichments.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

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

  const handleApply = () => {
    console.log("applied");
    setAppliedTissueFilter(tissueFilter);
    setAppliedSnpFilter(snpFilter);
  };

  const handleReset = () => {
    setTissueFilter([]);
    setSnpFilter([]);
    setAppliedTissueFilter([]);
    setAppliedSnpFilter([]);
  };

  return (
    <div className="m-5 ">
      {/* {enrichmentData.snps.map((value, index) => (
        <div key={index}>
          <Text fontSize="xs">{value}</Text>
        </div>
      ))} */}
      <div className="pt-5 pb-5 h-500 rounded-md bg-slate-200">
        <div>
          <HStack className="bg-slate-100 p-2 m-5">
            <NumberInput
              value={inputOptions.proximityLimit}
              onChange={(value) =>
                dispatch({
                  type: "NUM",
                  field: InputFields.proximityLimit,
                  value: Number(value),
                })
              }
            >
              <NumberInputField />
            </NumberInput>
            <Button bgColor="orange.100" onClick={() => explorerSubmit()}>
              Apply Enh Prox
            </Button>
            <Button bgColor="red.100" onClick={() => handleReset()}>
              Reset Filters
            </Button>
            <Button bgColor="blue.100" onClick={() => handleApply()}>
              Apply Filters
            </Button>
            <Button bgColor="blue.100" onClick={() => handleApply()}>
              Apply Filters
            </Button>
            <Button
              bgColor="green.100"
              onClick={() => saveStreamEffectsRef.current?.handleAdd()}
            >
              Save Data
            </Button>
            <Input
              value={streamEffectName}
              onChange={(event) => setStreamEffectName(event.target.value)}
              htmlSize={4}
              width="auto"
            />
          </HStack>
        </div>
        <EnrichmentHeatmap
          enrichmentData={enrichmentData}
          tissueFilter={tissueFilter}
          snpFilter={snpFilter}
          rankings={{ tissueRanking: tissueRanking, snpRanking: snpRanking }}
          tissueSelect={(e) => handleTissueSelect(e)}
          snpSelect={(e) => handleSnpSelect(e)}
        />
        <StreamEffectsTable
          snpRanking={snpRanking}
          streamEffects={enrichmentData.streamEffects}
          streamEffectName={streamEffectName}
          ref={saveStreamEffectsRef}
        />
      </div>
    </div>
  );
};

export default Explorer;
