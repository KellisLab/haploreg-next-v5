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
import useHaploBlockEnhancement from "./Explorer/hooks/useHaploBlockEnrichment";

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
    proximityLimit: 3000,
  });

  const { regionTable, queryTable } = useHaploRegTableData(inputOptions);

  const { enrichmentData, queryEnrichments } =
    useHaploBlockEnhancement(inputOptions);

  const handleMainSubmit = (event: FormEvent) => {
    event.preventDefault();
    queryTable();
    queryEnrichments();
  };

  const handleExplorerSubmit = () => {
    queryEnrichments();
  };

  return (
    <>
      <InputContext.Provider value={{ inputOptions, dispatch }}>
        <form onSubmit={handleMainSubmit}>
          <InputArea />
          <Button type="submit">Submit</Button>
        </form>
        {enrichmentData ? (
          <Explorer
            enrichmentData={enrichmentData}
            explorerSubmit={() => handleExplorerSubmit()}
          />
        ) : null}
        {/* <Suspense fallback={<DNALoadingSpinner />}> It would be nice to make this server side at some point*/}
        <HaploRegTable regionTable={regionTable} />
        {/* </Suspense> */}
      </InputContext.Provider>
    </>
  );
};

export default Query;
