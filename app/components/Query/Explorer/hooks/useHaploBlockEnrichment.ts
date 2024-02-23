import { useState } from "react";
import { InputOptions } from "../../Input/dataManagement/inputReducer";
import objectToMap from "@/app/api/compileExplorer/helpers/objectToMap";

export interface EnrichmentDataType {
  snps: string[];
  enrichments: Map<string, Map<string, number>>;
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
      snps: outputJson.success.snps,
      enrichments: objectToMap(outputJson.success.enrichments),
    });
  };

  return {
    enrichmentData,
    queryEnrichments,
  };
};

export default useHaploBlockEnrichment;
