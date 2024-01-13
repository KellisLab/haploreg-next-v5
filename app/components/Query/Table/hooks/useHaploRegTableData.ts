import { useState } from "react";
import { InputOptions } from "../../Input/dataManagement/inputReducer";
import { RegionTableType } from "../../Query";

const useQueryResult = (inputOptions: InputOptions) => {
  const [error, setError] = useState("");
  const [regionTable, setRegionTable] = useState<RegionTableType>(
    {} as RegionTableType
  );
  const [lociAssociations, setLociAssociations] = useState<Map<
    string,
    Array<string>
  > | null>(null);
  const [lociAssociationError, setLociAssociationError] = useState<any>();

  const query = async () => {
    switch (inputOptions.inputType) {
      case "gwas": {
        if (inputOptions.gwas === "") {
          alert("Please select a GWAS study");
          return;
        }
        break;
      }
      case "query": {
        if (inputOptions.query === "") {
          alert("Please enter a query");
          return;
        }
        break;
      }
      case "file": {
        if (inputOptions.file === "") {
          alert("Please upload a file");
          return;
        }
        break;
      }
    }
    setRegionTable({ ...regionTable, isLoading: true });
    setLociAssociations(null);
    setLociAssociationError(null);
    // hook with react query to send a get request to route .tsxin compile table  // do this in async hook in backend
    const url = new URL("api/compileTable", location.origin);
    url.searchParams.append("input", JSON.stringify(inputOptions));
    const response = await fetch(url);
    const outputJson = await response.json();
    setRegionTable({
      isLoading: false,
      input: outputJson.input,
      headers: outputJson.success.headers,
      regionTableData: outputJson.success.result,
      regionTableError: "",
    });
  };

  return {
    regionTable,
    lociAssociations,
    lociAssociationError,
    query,
  };
};

export default useQueryResult;
