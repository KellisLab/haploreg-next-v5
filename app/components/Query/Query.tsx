"use client";
import InputContext from "@/app/inputs/inputContext";
import inputReducer from "@/app/inputs/inputReducer";
import QueryType from "@/app/types/QueryType";
import React, { useReducer, useState } from "react";
import InputArea from "./Input/InputArea";

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

  return (
    <>
      <InputContext.Provider value={{ inputOptions, dispatch }}>
        <InputArea />
      </InputContext.Provider>
    </>
  );
};

export default Query;
