import { Box, Checkbox, HStack, Text } from "@chakra-ui/react";
import React from "react";

interface Props {
  snpEnrichmentPair: Array<Array<string | number>>;
  selectCheckbox: any;
  selectedCheckboxes: string[];
  snpNameMap: Map<string, string>;
}

const HeatmapColHeader = ({
  snpEnrichmentPair,
  selectCheckbox,
  selectedCheckboxes,
  snpNameMap,
}: Props) => {
  if (snpEnrichmentPair.length === 0) return null;

  return (
    <>
      <div className="pl-5">
        {snpEnrichmentPair.map((pair, index) => (
          <div key={index} className="">
            <HStack>
              <Checkbox
                value={pair[0]}
                isChecked={selectedCheckboxes.includes(pair[0] as string)}
                size="sm"
                onChange={(e) => selectCheckbox(e.target.value)}
              />
              <p className="text-[12px]">{snpNameMap.get(pair[0] as string)}</p>
            </HStack>
            <p className="font-normal text-[11px]">
              {Number(pair[1]).toPrecision(5)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default HeatmapColHeader;
