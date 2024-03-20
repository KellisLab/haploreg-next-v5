import { Box, Checkbox, HStack, Text } from "@chakra-ui/react";
import React from "react";

interface Props {
  tissueEnrichmentPair: Array<Array<string | number>>;
  selectCheckbox: any;
  selectedCheckboxes: string[];
  tissueNameMap: Map<string, string>;
}

const HeatmapRowHeader = ({
  tissueEnrichmentPair,
  selectCheckbox,
  selectedCheckboxes,
  tissueNameMap,
}: Props) => {
  if (tissueEnrichmentPair.length === 0) return null;

  return (
    <>
      <div
        style={{
          transform: "rotate(-90deg)",
          marginTop: "140px",
          transformOrigin: "top left",
          width: "150px",
        }}
        className="pt-1"
      >
        {tissueEnrichmentPair.map((pair, index) => (
          <div key={index}>
            <HStack>
              <Checkbox
                colorScheme="blackAlpha"
                value={pair[0]}
                isChecked={selectedCheckboxes.includes(pair[0] as string)}
                size="sm"
                onChange={(e) => selectCheckbox(e.target.value)}
              />
              <p className="text-[12px]">
                {tissueNameMap.get(pair[0] as string)}
              </p>
            </HStack>
            <p className="font-normal text-[12px]">
              {Number(pair[1]).toPrecision(5)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default HeatmapRowHeader;
