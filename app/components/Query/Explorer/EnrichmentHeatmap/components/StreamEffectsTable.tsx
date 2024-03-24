import {
  CloseButton,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { StreamEffectsRef } from "../../Explorer";
import { StreamEffects } from "../../hooks/useHaploBlockEnrichment";

interface Props {
  savedStreamEffects: [string, [string, number][]][];
  streamEffects: Map<string, StreamEffects>;
  changeCurrentTab: (idx: number) => void;
  handleDelete: (name: string) => void;
}

const StreamEffectsTable = ({
  savedStreamEffects,
  streamEffects,
  changeCurrentTab,
  handleDelete,
}: Props) => {
  return (
    <div className="basis-1/2 overflow-auto pt-[35px]">
      <Tabs variant="line" onChange={(index) => changeCurrentTab(index)}>
        <TabList>
          {savedStreamEffects.map((data, index) => (
            <HStack key={index}>
              <Tab>{data[0]}</Tab>
              {data[0] !== "current" ? (
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
              <Tabs variant="line">
                <TabList>
                  <Tab>{"Motifs"}</Tab>
                  <Tab>{"Enhancers"}</Tab>
                  <Tab>{"Promoters"}</Tab>
                  <Tab>{"Frequency"}</Tab>
                  <Tab></Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {data[1].map((snpElement, snpIndex) => (
                      <p key={snpIndex} className="py-[10px] text-[10px]">
                        {streamEffects
                          .get(snpElement[0] as string)
                          ?.motifs.map((motif, motifIndex) => (
                            <span key={motifIndex}>{motif};</span>
                          ))}
                      </p>
                    ))}
                  </TabPanel>
                </TabPanels>
              </Tabs>
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
};

export default StreamEffectsTable;
