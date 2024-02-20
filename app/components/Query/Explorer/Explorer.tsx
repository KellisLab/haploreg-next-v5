import React from "react";
import { RegionTableType } from "../Table/hooks/useHaploRegTableData";
import { EnrichmentDataType } from "./hooks/useHaploBlockEnrichment";

interface Props {
  tableData: RegionTableType;
  enrichmentData: EnrichmentDataType;
}

const Explorer = ({
  tableData: { isCTLoading, input, headers, regionTableData, regionTableError },
  enrichmentData: { isCELoading, enrichments },
}: Props) => {
  if (isCELoading || isCTLoading) return null;
  if (!enrichments) return null;

  return (
    <div className="tm-5 p-10 bg-slate-500">
      {headers.map((header, index) => (
        <p key={index}>{header}</p>
      ))}
      {enrichments.map((header, index) => (
        <p key={index}>{header}</p>
      ))}
    </div>
  );
};

export default Explorer;
