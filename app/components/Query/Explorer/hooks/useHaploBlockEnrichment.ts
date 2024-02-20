import { useState } from "react";
import { InputOptions } from "../../Input/dataManagement/inputReducer";

export interface EnrichmentDataType {
  enrichments: number[];
  isCELoading: boolean;
}

// const useHaploBlockEnhancement = (snps: string[]) => {
const useHaploBlockEnrichment = (inputOptions: InputOptions) => {
  const [enrichmentData, setEnrichmentData] = useState<EnrichmentDataType>(
    {} as EnrichmentDataType
  );

  const queryEnrichments = async () => {
    setEnrichmentData({ ...enrichmentData, isCELoading: true });
    const url = new URL("api/compileExplorer", location.origin);
    url.searchParams.append("input", JSON.stringify(inputOptions));
    const response = await fetch(url);
    const outputJson = await response.json();
    setEnrichmentData({
      isCELoading: false,
      enrichments: outputJson.success.data,
    });
  };

  return {
    enrichmentData,
    queryEnrichments,
  };
};

export default useHaploBlockEnrichment;
