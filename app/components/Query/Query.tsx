"use client";
import InputContext from "@/app/components/Query/Input/dataManagement/inputContext";
import inputReducer, {
  InputOptions,
} from "@/app/components/Query/Input/dataManagement/inputReducer";
import QueryType from "@/app/types/QueryType";
import React, { FormEvent, useReducer, useState, Suspense } from "react";
import InputArea from "./Input/InputArea";
import HaploRegTable from "./Table/HaploRegTable";
import { Button } from "@chakra-ui/react";
import useHaploRegTableData from "./Table/hooks/useHaploRegTableData";
import Explorer from "./Explorer/Explorer";

export interface ExplorerOptionsType {
  isLoading: Boolean;
  explorerOptionsData: Map<string, string[]>;
  //   {
  //     [k: string]: string[];
  //   }
  explorerOptionsError: string | null;
}
export interface RegionTableType {
  isLoading: Boolean;
  input: InputOptions;
  headers: string[];
  regionTableData: string[][][];
  regionTableError: string | null;
}

const Query = () => {
  const [showInteractiveExplorer, setShowInteractiveExplorer] = useState(true);
  const [inputOptions, dispatch] = useReducer(inputReducer, {
    query: "",
    file: "",
    gwas: "",
    ld: 0.8,
    population: "EUR",
    source: "vanilla",
    mammalian: "SiPhy",
    relative: "GENCODE",
    condenseLists: 3,
    condenseOligos: 6,
    inputType: "query",
    outputType: "html",
    queryType: QueryType.Unknown,
  });

  const { regionTable, explorerOptions, query } =
    useHaploRegTableData(inputOptions);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    query();
  };

  return (
    <>
      <InputContext.Provider value={{ inputOptions, dispatch }}>
        <form onSubmit={handleSubmit}>
          <InputArea />
          <Button type="submit">Submit</Button>
        </form>
        {explorerOptions.explorerOptionsData ? (
          <Explorer options={explorerOptions} />
        ) : null}
        {/* <Suspense fallback={<DNALoadingSpinner />}> It would be nice to make this server side at some point*/}
        <HaploRegTable regionTable={regionTable} />
        {/* </Suspense> */}
      </InputContext.Provider>
    </>
  );
};

export default Query;
