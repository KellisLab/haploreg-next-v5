import React from "react";
import { RegionTableType } from "../Table/hooks/useHaploRegTableData";
import { EnrichmentDataType } from "./hooks/useHaploBlockEnrichment";
import EnrichmentHeatmap from "./EnrichmentHeatmap/components/EnrichmentHeatmap";
import { Text } from "@chakra-ui/react";

interface Props {
  tableData: RegionTableType;
  enrichmentData: EnrichmentDataType;
}

const Explorer = ({
  tableData: { isCTLoading, input, headers, regionTableData, regionTableError },
  enrichmentData,
}: Props) => {
  // if (isCELoading || isCTLoading) return null;
  if (!enrichmentData.enrichments || !headers) return null;
  // console.log(enrichments);

  return (
    <div className="m-5 ">
      {enrichmentData.snps.map((value, index) => (
        <div key={index}>
          <Text fontSize="xs">{value}</Text>
        </div>
      ))}
      <div className="p-5 rounded-md bg-slate-200">
        <EnrichmentHeatmap enrichmentData={enrichmentData} />
      </div>
    </div>
  );
};

export default Explorer;
