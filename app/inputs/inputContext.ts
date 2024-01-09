import { Dispatch, createContext } from "react";
import { InputAction, InputOptions } from "./inputReducer";

interface InputContextType {
  inputOptions: InputOptions;
  dispatch: Dispatch<InputAction>;
}

const InputContext = createContext<InputContextType>({} as InputContextType);

export default InputContext;
