import QueryType from "../../../../types/QueryType";

export enum InputFields {
  query,
  file,
  gwas,
  ld,
  population,
  source,
  mammalian,
  relative,
  condenseLists,
  condenseOligos,
  inputType,
  outputType,
  queryType,
}

export interface InputOptions {
  query: string;
  file: string;
  gwas: string;
  ld: number;
  population: string; //AFR, AMR, ASN, EUR
  source: string; //vanilla (chromHMM-15), imputed (chromHMM-25), methyl (H3K4me1), acetyl (H3K27ac)
  mammalian: string; //GERP, SiPhy, both
  relative: string; //GENCODE, RefSeq, both
  condenseLists: number;
  condenseOligos: number;
  inputType: "query" | "file" | "gwas";
  outputType: "html" | "text";
  queryType: QueryType;
}

interface ChangeNum {
  type: "NUM";
  field: InputFields;
  value: number;
}

interface ChangeStr {
  type: "STR";
  field: InputFields;
  value: string;
}

interface InputType {
  type: "TYP";
  field: InputFields.inputType;
  value: "query" | "file" | "gwas";
}

interface OutputType {
  type: "TYP";
  field: InputFields.outputType;
  value: "html" | "text";
}

export type InputAction = ChangeStr | ChangeNum | InputType | OutputType;

const inputReducer = (
  inputOptions: InputOptions,
  action: InputAction
): InputOptions => {
  if (action.type === "STR") {
    switch (action.field) {
      case InputFields.query:
        return { ...inputOptions, query: action.value };
      case InputFields.file:
        return { ...inputOptions, file: action.value };
      case InputFields.gwas:
        return { ...inputOptions, gwas: action.value };
      case InputFields.population:
        return { ...inputOptions, population: action.value };
      case InputFields.source:
        return { ...inputOptions, source: action.value };
      case InputFields.mammalian:
        return { ...inputOptions, mammalian: action.value };
      case InputFields.relative:
        return { ...inputOptions, relative: action.value };
    }
  } else if (action.type === "NUM") {
    switch (action.field) {
      case InputFields.ld:
        return { ...inputOptions, ld: action.value };
      case InputFields.condenseLists:
        return { ...inputOptions, condenseLists: action.value };
      case InputFields.condenseOligos:
        return { ...inputOptions, condenseOligos: action.value };
    }
  } else if (action.type === "TYP") {
    switch (action.field) {
      case InputFields.inputType:
        return { ...inputOptions, inputType: action.value };
      case InputFields.outputType:
        return { ...inputOptions, outputType: action.value };
    }
  }

  return inputOptions;
};

export default inputReducer;
