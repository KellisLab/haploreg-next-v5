import React from "react";
import { RegionTableType } from "../Table/hooks/useHaploRegTableData";
import { EnrichmentDataType } from "./hooks/useHaploBlockEnrichment";
import EnrichmentTable from "./components/EnrichmentTable";
import { Spinner } from "@chakra-ui/react";

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
  console.log(enrichments);

  return (
    <div className="m-5 ">
      <div className="p-5 rounded-md bg-slate-200">
        <EnrichmentTable />
        {isCELoading ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner size="sm" />
          </span>
        ) : (
          Array.from(enrichments.entries()).map((snp, idx1) => (
            <div key={idx1}>
              <span>{snp[0]}:</span>
              {Array.from(snp[1].entries()).map((tissue, idx2) => (
                <span key={idx2}>
                  {tissue[0]},{tissue[1]};
                </span>
              ))}
            </div>
          ))
        )}
        {/* <EnrichmentTable /> */}
      </div>
    </div>
  );
};

export default Explorer;
