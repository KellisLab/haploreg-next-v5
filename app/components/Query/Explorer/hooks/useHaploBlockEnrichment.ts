import { useState } from "react";
import { InputOptions } from "../../Input/dataManagement/inputReducer";
import objectToMap from "@/app/api/compileExplorer/helpers/objectToMap";
import objectToFlatMap from "@/app/api/compileExplorer/helpers/objectToFlatMap";

export interface StreamEffects {
  motifs: string[];
}

export interface EnrichmentDataType {
  isCELoading: boolean;
  streamEffects: Map<string, StreamEffects>;
  enrichments: Map<string, Map<string, number>>;
  closestEnhancers: Map<string, Map<string, number>>;
  tissueNameMap: Map<string, string>;
  snpNameMap: Map<string, string>;
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
    console.log(outputJson);
    setEnrichmentData({
      isCELoading: false,
      streamEffects: objectToFlatMap(outputJson.success.streamEffects),
      enrichments: objectToMap(outputJson.success.enrichments),
      closestEnhancers: objectToMap(outputJson.success.closestEnhancers),
      tissueNameMap: objectToMap(outputJson.success.tissueNameMap),
      snpNameMap: objectToMap(outputJson.success.snpNameMap),
    });
  };

  return {
    enrichmentData,
    queryEnrichments,
  };
};

export default useHaploBlockEnrichment;
