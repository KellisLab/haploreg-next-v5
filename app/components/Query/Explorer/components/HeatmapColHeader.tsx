import { Box, Checkbox, HStack, Text } from "@chakra-ui/react";
import React from "react";

interface Props {
  snpEnrichmentPair: Array<Array<string | number>>;
  selectCheckbox: any;
  selectedCheckboxes: string[];
}

const HeatmapColHeader = ({
  snpEnrichmentPair,
  selectCheckbox,
  selectedCheckboxes,
}: Props) => {
  if (snpEnrichmentPair.length === 0) return null;

  return (
    <>
      <div
        style={{
          marginTop: "5px",
        }}
      >
        {snpEnrichmentPair.map((pair, index) => (
          <div key={index}>
            <HStack>
              <Checkbox
                value={pair[0]}
                isChecked={selectedCheckboxes.includes(pair[0] as string)}
                size="sm"
                onChange={(e) => selectCheckbox(e.target.value)}
              />
              <Text fontSize="sm">{pair[0]}</Text>
            </HStack>
            <Box fontSize="xs">{Number(pair[1]).toPrecision(5)}</Box>
          </div>
        ))}
      </div>
    </>
  );
};

export default HeatmapColHeader;
