import { Box, Checkbox, HStack, Text } from "@chakra-ui/react";
import React from "react";

interface Props {
  tissueEnrichmentPair: Array<Array<string | number>>;
  selectCheckbox: any;
  selectedCheckboxes: string[];
}

const HeatmapRowHeader = ({
  tissueEnrichmentPair,
  selectCheckbox,
  selectedCheckboxes,
}: Props) => {
  if (tissueEnrichmentPair.length === 0) return null;

  return (
    <>
      <div
        style={{
          transform: "rotate(-90deg)",
          // transformOrigin: "left",
          // marginLeft: "5px",
          marginTop: "140px",
          transformOrigin: "top left",
          // transformOrigin: "bottom",
          width: "150px",
        }}
        className="overflow-clip"
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
              <p className="oldstyle-nums text-[12px]">{pair[0]}</p>
            </HStack>
            <p className="oldstyle-nums text-[11px]">
              {Number(pair[1]).toPrecision(5)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default HeatmapRowHeader;
