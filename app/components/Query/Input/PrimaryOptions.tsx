"use client";
import InputContext from "@/app/components/Query/Input/dataManagement/inputContext";
import React, { useContext } from "react";
import useAllStudies from "./hooks/useAllStudies";
import { InputFields } from "@/app/components/Query/Input/dataManagement/inputReducer";

const Query = () => {
  const { inputOptions, dispatch } = useContext(InputContext);
  const gwasList = useAllStudies();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        dispatch({ type: "STR", field: InputFields.file, value: content });
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <p className="text-[13px]">
        Use one of the three methods below to enter a set of variants. If an r²
        threshold is specified (see the Set Options tab), results for each
        variant will be shown in a separate table along with other variants in
        LD. If r² is set to NA, only queried variants will be shown, together in
        one table.
      </p>
      <div className="flex mt-2 items-center gap-2">
        <input
          type="radio"
          name="inputType"
          value="query"
          checked={inputOptions.inputType === "query"}
          onChange={() =>
            dispatch({
              type: "TYP",
              field: InputFields.inputType,
              value: "query",
            })
          }
        />
        <p className="text-[13px]">
          Query (comma-delimited list of rsIDs OR a single region as
          chrN:start-end):
        </p>
        <input
          onChange={(e) => {
            dispatch({
              type: "STR",
              field: InputFields.query,
              value: e.target.value,
            });
            dispatch({
              type: "TYP",
              field: InputFields.inputType,
              value: "query",
            });
          }}
          type="text"
          style={{ padding: "2px 35px 2px 8px" }}
          className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-[13px]"
          placeholder=""
        />
      </div>

      <div className="flex mt-2 items-center gap-2">
        <input
          type="radio"
          name="inputType"
          value="file"
          checked={inputOptions.inputType === "file"}
          onChange={() =>
            dispatch({
              type: "TYP",
              field: InputFields.inputType,
              value: "file",
            })
          }
        />
        <p className="text-[13px]">Upload File (.txt):</p>
        <input
          type="file"
          className="text-[13px]"
          onChange={(e) => {
            handleFileUpload(e);
            dispatch({
              type: "TYP",
              field: InputFields.inputType,
              value: "file",
            });
          }}
          accept=".txt"
        />
      </div>
      <div className="flex mt-2 items-center gap-2">
        <input
          type="radio"
          name="inputType"
          value="gwas"
          checked={inputOptions.inputType === "gwas"}
          onChange={() =>
            dispatch({
              type: "TYP",
              field: InputFields.inputType,
              value: "gwas",
            })
          }
        />
        <p className="whitespace-nowrap text-[13px]">Select GWAS:</p>
        <select
          onChange={(e) => {
            dispatch({
              type: "STR",
              field: InputFields.gwas,
              value: e.target.value,
            });
            dispatch({
              type: "TYP",
              field: InputFields.inputType,
              value: "gwas",
            });
          }}
          value={inputOptions.gwas}
          style={{ padding: "2px 35px 2px 8px" }}
          className="min-w-0 overflow-hidden mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-[13px]"
        >
          <option value="">-- Select a GWAS Study--</option>
          {gwasList.map((gwas, index) => (
            <option key={index} value={gwas}>
              {gwas}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Query;
