import React, { useContext, useState } from "react";
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
import CascadingEffectsTable from "./EnrichmentHeatmap/components/components/CascadingEffectsTable";
interface Props {
  enrichmentData: EnrichmentDataType;
  explorerSubmit: () => void;
}

const Explorer = ({ enrichmentData, explorerSubmit }: Props) => {
  const { inputOptions, dispatch } = useContext(InputContext);

  const [tissueFilter, setTissueFilter] = useState<string[]>([]);
  const [snpFilter, setSnpFilter] = useState<string[]>([]);
  const [appliedTissueFilter, setAppliedTissueFilter] = useState<string[]>([]);
  const [appliedSnpFilter, setAppliedSnpFilter] = useState<string[]>([]);

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
      <div className="p-5 rounded-md bg-slate-200">
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
            <Button bgColor="green.100" onClick={() => explorerSubmit()}>
              Apply Enh Prox
            </Button>
            <Button bgColor="red.100" onClick={() => handleReset()}>
              Reset Filters
            </Button>
            <Button bgColor="blue.100" onClick={() => handleApply()}>
              Apply Filters
            </Button>
          </HStack>
        </div>
        <EnrichmentHeatmap
          enrichmentData={enrichmentData}
          tissueFilter={tissueFilter}
          snpFilter={snpFilter}
          appliedTissueFilter={appliedTissueFilter}
          appliedSnpFilter={appliedSnpFilter}
          tissueSelect={(e) => handleTissueSelect(e)}
          snpSelect={(e) => handleSnpSelect(e)}
        />
        {/* <CascadingEffectsTable snpRanking={snpRanking} /> */}
      </div>
    </div>
  );
};

export default Explorer;
