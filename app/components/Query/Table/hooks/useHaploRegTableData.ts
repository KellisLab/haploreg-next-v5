import { useState } from "react";
import { InputOptions } from "../../Input/dataManagement/inputReducer";
import { ExplorerOptionsType, RegionTableType } from "../../Query";

const useQueryResult = (inputOptions: InputOptions) => {
  const [regionTable, setRegionTable] = useState<RegionTableType>(
    {} as RegionTableType
  );
  const [explorerOptions, setExplorerOptions] = useState<ExplorerOptionsType>(
    {} as ExplorerOptionsType
  );

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
    setExplorerOptions({ ...explorerOptions, isLoading: true });
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
      regionTableError: outputJson.error,
    });
    setExplorerOptions({
      isLoading: false,
      explorerOptionsData: outputJson.success.igvExplorerResult,
      explorerOptionsError: outputJson.error,
    });
  };

  return {
    regionTable,
    explorerOptions,
    query,
  };
};

export default useQueryResult;
