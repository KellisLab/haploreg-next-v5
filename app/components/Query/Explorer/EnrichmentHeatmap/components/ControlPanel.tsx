import {
  Button,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import InputContext from "../../../Input/dataManagement/inputContext";
import { InputFields } from "../../../Input/dataManagement/inputReducer";
import { StreamEffectsRef } from "../../Explorer";

interface Props {
  explorerSubmit: () => void;
  handleReset: () => void;
  handleApply: () => void;
  setStreamEffectName: (e: string) => void;
  streamEffectName: string;
  saveStreamEffectsRef: React.MutableRefObject<StreamEffectsRef | null>;
}

const ControlPanel = ({
  explorerSubmit,
  handleReset,
  handleApply,
  setStreamEffectName,
  streamEffectName,
  saveStreamEffectsRef,
}: Props) => {
  const { inputOptions, dispatch } = useContext(InputContext);

  return (
    <div>
      <HStack className="border border-gray bg-white p-2 rounded-lg">
        <NumberInput
          value={inputOptions.proximityLimit}
          onChange={(value) =>
            dispatch({
              type: "NUM",
              field: InputFields.proximityLimit,
              value: Number(value),
            })
          }
        >
          <NumberInputField className="w-10" />
        </NumberInput>
        <Button
          bgColor="orange.100"
          onClick={() => {
            explorerSubmit();
            handleReset();
          }}
        >
          Apply Enh Prox
        </Button>
        <Button bgColor="red.100" onClick={() => handleReset()}>
          Reset Filters
        </Button>
        <Button bgColor="blue.100" onClick={() => handleApply()}>
          Apply Filters
        </Button>
        <Button bgColor="purple.100" onClick={() => {}}>
          Revert Filters
        </Button>
        <Button
          bgColor="green.100"
          // disabled={} need to prob life savedStreamEffects from StreamEffectsTable.tsx to
          // disable save button if name is already used for another tab, but its not the end
          // of the world if a user is dumb and does this
          onClick={() => {
            saveStreamEffectsRef.current?.handleAdd();
            setStreamEffectName("");
          }}
        >
          Save Data
        </Button>
        <Input
          value={streamEffectName}
          onChange={(event) => setStreamEffectName(event.target.value)}
          width="auto"
        />
      </HStack>
    </div>
  );
};

export default ControlPanel;
