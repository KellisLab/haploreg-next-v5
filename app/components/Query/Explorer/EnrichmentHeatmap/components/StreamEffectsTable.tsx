import {
  CloseButton,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { StreamEffects } from "../../hooks/useHaploBlockEnrichment";
import { SavedStreamEffects } from "../../Explorer";

interface Props {
  savedStreamEffects: SavedStreamEffects[];
  streamEffects: Map<string, StreamEffects>;
  currentTab: number;
  changeCurrentTab: (idx: number) => void;
  handleDelete: (name: string) => void;
}

const StreamEffectsTable = ({
  savedStreamEffects,
  streamEffects,
  currentTab,
  changeCurrentTab,
  handleDelete,
}: Props) => {
  return (
    <div className="basis-1/2 overflow-auto pt-[35px]">
      <Tabs
        index={currentTab}
        variant="line"
        onChange={(index) => changeCurrentTab(index)}
      >
        <TabList>
          {savedStreamEffects.map((data, index) => (
            <HStack key={index}>
              <Tab>{data.label}</Tab>
              {data.label !== "current" ? (
                <CloseButton
                  id={data.label}
                  size="sm"
                  onClick={() => handleDelete(data.label)}
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
                    {data.snpRanking.map((snpElement, snpIndex) => (
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
