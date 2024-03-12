import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import { StreamEffects } from "../../../hooks/useHaploBlockEnrichment";
import { Rankings } from "../EnrichmentHeatmap";
import {
  CloseButton,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { StreamEffectsRef } from "../../../Explorer";

interface Props {
  snpRanking: [string, number][];
  streamEffects: Map<string, StreamEffects>;
  streamEffectName: string;
}

const StreamEffectsTable = forwardRef<StreamEffectsRef, Props>(
  ({ snpRanking, streamEffects, streamEffectName }: Props, ref) => {
    const [savedStreamEffects, setSavedStreamEffects] = useState<
      [string, [string, number][]][]
    >([["default", snpRanking]]);

    // console.log(rankings);
    // console.log(streamEffects);
    // console.log(rankings.snpRanking[0][0]);
    // console.log(streamEffects.get(rankings.snpRanking[0][0]));
    useImperativeHandle(ref, () => ({
      handleAdd() {
        setSavedStreamEffects([
          ...savedStreamEffects,
          [streamEffectName, snpRanking],
        ]);
        console.log(savedStreamEffects);
      },
    }));

    const handleDelete = (deleteTitle: string) => {
      console.log(deleteTitle);
      setSavedStreamEffects(
        savedStreamEffects.filter((title) => title[0] !== deleteTitle)
      );
    };

    return (
      <div>
        <Tabs variant="enclosed">
          <TabList>
            {savedStreamEffects.map((data, index) => (
              <HStack key={index}>
                <Tab>{data[0]}</Tab>
                {data[0] !== "default" ? (
                  <CloseButton
                    id={data[0]}
                    size="sm"
                    onClick={() => handleDelete(data[0])}
                  />
                ) : null}
              </HStack>
            ))}
          </TabList>
          <TabPanels>
            {savedStreamEffects.map((data, index) => (
              <TabPanel key={index}>
                {data[1].map((snpElement, snpIndex) => (
                  <p key={snpIndex}>
                    {streamEffects
                      .get(snpElement[0] as string)
                      ?.motifs.map((motif, motifIndex) => (
                        <span key={motifIndex}>{motif}</span>
                      ))}
                  </p>
                ))}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        {/* <table className="table-auto w-full text-sm text-left text-gray-600 mt-2 border-separate border-spacing-0">
          <tbody>
            {rankings.snpRanking.map((snpElement, snpIndex) => (
              <tr key={snpIndex}>
                {streamEffects
                  .get(snpElement[0])
                  ?.motifs.map((motif, motifIndex) => (
                    <td key={motifIndex}>{motif}</td>
                  )) ?? ""}
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    );
  }
);

StreamEffectsTable.displayName = "StreamEffectsTable";

export default StreamEffectsTable;
