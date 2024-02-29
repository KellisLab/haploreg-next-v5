import React from "react";
import { RegionTableType } from "../Table/hooks/useHaploRegTableData";
import { EnrichmentDataType } from "./hooks/useHaploBlockEnrichment";
import EnrichmentTable from "./components/EnrichmentTable";
import { Spinner } from "@chakra-ui/react";
import EnrichmentHeatmap from "./components/EnrichmentHeatmap";
import { Text } from "@chakra-ui/react";

interface Props {
  tableData: RegionTableType;
  enrichmentData: EnrichmentDataType;
}

const Explorer = ({
  tableData: { isCTLoading, input, headers, regionTableData, regionTableError },
  enrichmentData: { isCELoading, snps, enrichments },
}: Props) => {
  // if (isCELoading || isCTLoading) return null;
  if (!enrichments || !headers) return null;
  // console.log(enrichments);

  return (
    <div className="m-5 ">
      {snps.map((value, index) => (
        <div key={index}>
          <Text fontSize="xs">{value}</Text>
        </div>
      ))}
      <div className="p-5 rounded-md bg-slate-200">
        <EnrichmentHeatmap enrichments={enrichments} />
      </div>
    </div>
  );
};

export default Explorer;
