"use client";
import InputContext from "@/app/components/Query/Input/dataManagement/inputContext";
import { InputFields } from "@/app/components/Query/Input/dataManagement/inputReducer";
import { HStack, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useContext } from "react";

const SecondaryOptions = () => {
  const { inputOptions, dispatch } = useContext(InputContext);
  return (
    <>
      <div className="flex items-center gap-2 mb-1 ">
        <p className="mr-1">
          LD threshold, r² (select NA to only show query variants):{" "}
        </p>
        <select
          onChange={(e) =>
            dispatch({
              type: "NUM",
              field: InputFields.ld,
              value: Number(e.target.value),
            })
          }
          value={inputOptions.ld}
          className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          style={{ padding: "4px 35px 4px 8px" }}
        >
          <option value={0.2}>0.2</option>
          <option value={0.4}>0.4</option>
          <option value={0.6}>0.6</option>
          <option value={0.8}>0.8</option>
          <option value={1.0}>1.0</option>
          <option value={0.0}>N/A</option>
        </select>
      </div>
      <HStack className="mt-2">
        <p>1000G Phase 1 population for LD calculation:</p>
        <RadioGroup
          onChange={(selected) =>
            dispatch({
              type: "STR",
              field: InputFields.population,
              value: selected,
            })
          }
          value={inputOptions.population}
          className="ml-2"
        >
          <Stack direction="row">
            <Radio value="AFR">AFR</Radio>
            <Radio value="AMR">AMR</Radio>
            <Radio value="ASN">ASN</Radio>
            <Radio value="EUR">EUR</Radio>
          </Stack>
        </RadioGroup>
      </HStack>
      <div className="flex mt-2 items-center gap-2">
        <p className="mr-1">Source for epigenomes: </p>
        <select
          onChange={(e) =>
            dispatch({
              type: "STR",
              field: InputFields.source,
              value: e.target.value,
            })
          }
          value={inputOptions.source}
          className="block mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          style={{ padding: "4px 8px" }}
        >
          <option value="vanilla">ChromHMM (Core 15-state model)</option>
          <option value="imputed">
            ChromHMM (25-state model using 12 imputed marks)
          </option>
          <option value="methyl">H3K4me1/H3K4me3 peaks</option>
          <option value="acetyl">H3K27ac/H3K9ac peaks</option>
        </select>
      </div>
      <HStack className="mt-2 mb-3">
        <p>Mammalian conservation algorithm:</p>
        <RadioGroup
          onChange={(selected) =>
            dispatch({
              type: "STR",
              field: InputFields.mammalian,
              value: selected,
            })
          }
          value={inputOptions.mammalian}
          className="ml-2"
        >
          <Stack direction="row">
            <Radio value="GERP">GERP</Radio>
            <Radio value="SiPhy">SiPhy-omega</Radio>
            <Radio value="both">both</Radio>
          </Stack>
        </RadioGroup>
      </HStack>
      <HStack className="mt-2">
        <p>Show positive relative to:</p>
        <RadioGroup
          onChange={(selected) =>
            dispatch({
              type: "STR",
              field: InputFields.relative,
              value: selected,
            })
          }
          value={inputOptions.relative}
          className="ml-2"
        >
          <Stack direction="row">
            <Radio value="GENCODE">GENCODE</Radio>
            <Radio value="RefSeq">RefSeq</Radio>
            <Radio value="both">both</Radio>
          </Stack>
        </RadioGroup>
      </HStack>
      <div className="flex mt-2 items-center gap-2">
        <p className="mr-1">Condense lists in table longer than: </p>
        <select
          onChange={(e) =>
            dispatch({
              type: "NUM",
              field: InputFields.condenseLists,
              value: Number(e.target.value),
            })
          }
          value={inputOptions.condenseLists}
          className="block mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          style={{ padding: "4px 8px" }}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="0">Never condense</option>
        </select>
      </div>
      <div className="flex mt-1 items-center gap-2">
        <p className="mr-1">Condense indel oligos longer than: </p>
        <select
          onChange={(e) =>
            dispatch({
              type: "NUM",
              field: InputFields.condenseOligos,
              value: Number(e.target.value),
            })
          }
          id="condenseOligos"
          value={inputOptions.condenseOligos}
          className="block mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          style={{ padding: "4px 8px" }}
        >
          <option value="1">1</option>
          <option value="6">6</option>
          <option value="0">Never condense</option>
        </select>
      </div>
      <HStack className="mt-2">
        <p>Output mode</p>
        <RadioGroup
          onChange={(selected) =>
            dispatch({
              type: "TYP",
              field: InputFields.outputType,
              value: selected as "html" | "text",
            })
          }
          value={inputOptions.outputType}
          className="ml-2"
        >
          <Stack direction="row">
            <Radio value="html">HTML</Radio>
            <Radio value="text">Text</Radio>
          </Stack>
        </RadioGroup>
      </HStack>
    </>
  );
};

export default SecondaryOptions;
