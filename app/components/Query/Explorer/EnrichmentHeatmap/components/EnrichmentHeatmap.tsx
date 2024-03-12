import { Button, Grid, GridItem, HStack } from "@chakra-ui/react";
import HeatmapColHeader from "./components/HeatmapColHeader";
import HeatmapRowHeader from "./components/HeatmapRowHeader";
import ClosestEnhancerTable from "./components/ClosestEnhancerTable";
import { EnrichmentDataType } from "../../hooks/useHaploBlockEnrichment";

export interface Rankings {
  tissueRanking: [string, number][];
  snpRanking: [string, number][];
}

interface Props {
  enrichmentData: EnrichmentDataType;
  tissueFilter: string[];
  snpFilter: string[];
  rankings: Rankings;
  tissueSelect: (e: string) => void;
  snpSelect: (e: string) => void;
}

const EnrichmentHeatmap = ({
  enrichmentData: {
    isCELoading,
    enrichments,
    closestEnhancers,
    tissueNameMap,
    snpNameMap,
  },
  tissueFilter,
  snpFilter,
  rankings,
  tissueSelect,
  snpSelect,
}: Props) => {
  if (!enrichments || isCELoading) return null;
  return (
    <div>
      <Grid
        templateAreas={`"settings tissues"
                  "snps distance"`}
        gridTemplateRows={"150px 1fr"}
        gridTemplateColumns={"150px 1fr"}
        h="500px"
        gap="2"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem
          style={{
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "column",
          }}
          pl="2"
          area={"settings"}
        ></GridItem>
        <GridItem pl="2" bg="orange.300" area={"tissues"}>
          <HeatmapRowHeader
            tissueEnrichmentPair={rankings.tissueRanking}
            selectCheckbox={tissueSelect}
            selectedCheckboxes={tissueFilter}
          />
        </GridItem>
        <GridItem pl="2" bg="pink.300" area={"snps"}>
          <HeatmapColHeader
            snpEnrichmentPair={rankings.snpRanking}
            selectCheckbox={snpSelect}
            selectedCheckboxes={snpFilter}
            snpNameMap={snpNameMap}
          />
        </GridItem>
        <GridItem pl="2" bg="green.300" area={"distance"}>
          <ClosestEnhancerTable
            rankings={rankings}
            closestEnhancers={closestEnhancers}
          />
        </GridItem>
      </Grid>
    </div>
  );
};

export default EnrichmentHeatmap;
