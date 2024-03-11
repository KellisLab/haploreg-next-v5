import { Button, Grid, GridItem, HStack } from "@chakra-ui/react";
import HeatmapColHeader from "./components/HeatmapColHeader";
import HeatmapRowHeader from "./components/HeatmapRowHeader";
import ClosestEnhancerTable from "./components/ClosestEnhancerTable";
import { EnrichmentDataType } from "../../hooks/useHaploBlockEnrichment";

interface Props {
  enrichmentData: EnrichmentDataType;
  tissueFilter: string[];
  snpFilter: string[];
  appliedTissueFilter: string[];
  appliedSnpFilter: string[];
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
  appliedTissueFilter,
  appliedSnpFilter,
  tissueSelect,
  snpSelect,
}: Props) => {
  if (!enrichments || isCELoading) return null;

  let partiallyFilteredEnrichments = [...enrichments.entries()];
  if (appliedSnpFilter.length !== 0) {
    partiallyFilteredEnrichments = partiallyFilteredEnrichments.filter(
      (value) => appliedSnpFilter.includes(value[0])
    );
  }

  let enrichmentsToUse: Array<Array<string | Array<Array<string | number>>>>;
  if (appliedTissueFilter.length !== 0) {
    enrichmentsToUse = partiallyFilteredEnrichments.map((enrichments) => [
      enrichments[0],
      [...enrichments[1].entries()].filter((value) =>
        appliedTissueFilter.includes(value[0])
      ),
    ]);
  } else {
    enrichmentsToUse = partiallyFilteredEnrichments.map((enrichments) => [
      enrichments[0],
      [...enrichments[1].entries()],
    ]);
  }

  const tissueEnrichments: Map<string, number> = new Map();
  const snpEnrichments: Map<string, number> = new Map();

  for (const snpEntry of enrichmentsToUse) {
    const snp: string = snpEntry[0] as string;
    const enrichments: Array<any> = snpEntry[1] as Array<any>;
    for (const tissueEntry of enrichments) {
      const tissue: string = tissueEntry[0] as string;
      const enrichment: number = tissueEntry[1] as number;
      tissueEnrichments.set(
        tissue,
        enrichment + (tissueEnrichments.get(tissue) ?? 0)
      );
      snpEnrichments.set(snp, enrichment + (snpEnrichments.get(snp) ?? 0));
    }
  }

  const snpRanking = [...snpEnrichments.entries()].sort((a, b) => b[1] - a[1]);
  const tissueRanking = [...tissueEnrichments.entries()].sort(
    (a, b) => b[1] - a[1]
  );

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
            tissueEnrichmentPair={tissueRanking}
            selectCheckbox={tissueSelect}
            selectedCheckboxes={tissueFilter}
          />
        </GridItem>
        <GridItem pl="2" bg="pink.300" area={"snps"}>
          <HeatmapColHeader
            snpEnrichmentPair={snpRanking}
            selectCheckbox={snpSelect}
            selectedCheckboxes={snpFilter}
            snpNameMap={snpNameMap}
          />
        </GridItem>
        <GridItem pl="2" bg="green.300" area={"distance"}>
          <ClosestEnhancerTable
            snpRanking={snpRanking}
            tissueRanking={tissueRanking}
            closestEnhancers={closestEnhancers}
          />
        </GridItem>
      </Grid>
    </div>
  );
};

export default EnrichmentHeatmap;
