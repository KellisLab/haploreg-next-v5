import { useState } from "react";
import { InputOptions } from "../../Input/dataManagement/inputReducer";

export interface RegionTableType {
  isCTLoading: Boolean;
  input: InputOptions;
  headers: string[];
  regionTableData: string[][][];
  regionTableError: string | null;
}

const useQueryResult = (inputOptions: InputOptions) => {
  const [regionTable, setRegionTable] = useState<RegionTableType>(
    {} as RegionTableType
  );
  // const [explorerOptions, setExplorerOptions] = useState<ExplorerOptionsType>(
  //   {} as ExplorerOptionsType
  // );

  const queryTable = async () => {
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
    setRegionTable({ ...regionTable, isCTLoading: true });
    // setExplorerOptions({ ...explorerOptions, isLoading: true });
    // hook with react query to send a get request to route .tsxin compile table  // do this in async hook in backend
    const url = new URL("api/compileTable", location.origin);
    url.searchParams.append("input", JSON.stringify(inputOptions));
    const response = await fetch(url);
    const outputJson = await response.json();
    // console.log(outputJson);
    setRegionTable({
      isCTLoading: false,
      input: outputJson.input,
      headers: outputJson.success.headers,
      regionTableData: outputJson.success.result,
      regionTableError: outputJson.error,
    });
    // setExplorerOptions({
    //   isLoading: false,
    //   explorerOptionsData: outputJson.success.igvExplorerResult,
    //   explorerOptionsError: outputJson.error,
    // });
  };

  return {
    regionTable,
    // explorerOptions,
    queryTable,
  };
};

export default useQueryResult;
