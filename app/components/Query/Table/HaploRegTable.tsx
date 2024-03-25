import QueryType from "@/app/types/QueryType";
import { Fragment } from "react";
import RegionTable from "./RegionTable";
import DNALoadingSpinner from "../../Loader/DNALoadingSpinner";
import { RegionTableType } from "./hooks/useHaploRegTableData";

interface Props {
  regionTable: RegionTableType;
}

const TabledData = ({
  regionTable: {
    regionTableData,
    regionTableError,
    input,
    headers,
    isCTLoading,
  },
}: Props) => {
  if (isCTLoading)
    return (
      <div className="flex justify-center" style={{ height: "135px" }}>
        <DNALoadingSpinner />
      </div>
    );

  if (regionTableError) return <p>{regionTableError}</p>;
  if (!regionTableData) return null;

  return (
    <>
      {(((!regionTableError && input.queryType === QueryType.SnpList) ||
        input.queryType === QueryType.Unknown) &&
        input.ld === 0.0 && (
          <h2 className="text-xl font-bold mt-4">Queried Snps Table</h2>
        )) ||
        ((input.queryType === QueryType.SnpList ||
          input.queryType === QueryType.Unknown) &&
          input.ld !== 0.0 && (
            <h2 className="text-xl font-bold mt-4">Haploblock Table</h2>
          )) ||
        (input.queryType === QueryType.ChrRange && (
          <h2 className="text-xl font-bold mt-4">Region Table</h2>
        ))}

      {regionTableData && (
        <div>
          {regionTableData.map((element, index) => (
            <Fragment key={index}>
              <p className="text-sm text-gray-500 mt-4">
                Query SNP:{" "}
                <span className="text-gray-800">{headers[index]}</span> and
                variants with r² ≥{" "}
                <span className="text-gray-800">{input.ld}</span>
              </p>
              <RegionTable
                inputOptions={input}
                data={element}
                header={headers[index]}
              />
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
};

export default TabledData;
