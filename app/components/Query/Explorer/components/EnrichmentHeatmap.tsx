import { Button, Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import HeatmapColHeader from "./HeatmapColHeader";
import HeatmapRowHeader from "./HeatmapRowHeader";

interface Props {
  enrichments: Map<string, Map<string, number>>;
}

const EnrichmentHeatmap = ({ enrichments }: Props) => {
  const [tissueFilter, setTissueFilter] = useState<string[]>([]);
  const [snpFilter, setSnpFilter] = useState<string[]>([]);
  const [appliedTissueFilter, setAppliedTissueFilter] = useState<string[]>([]);
  const [appliedSnpFilter, setAppliedSnpFilter] = useState<string[]>([]);

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

  const handleSnpSelect = (e: string) => {
    if (snpFilter.includes(e)) {
      setSnpFilter(snpFilter.filter((value) => value != e));
    } else {
      setSnpFilter([...snpFilter, e]);
    }
  };

  const handleTissueSelect = (e: string) => {
    if (tissueFilter.includes(e)) {
      setTissueFilter(tissueFilter.filter((value) => value != e));
    } else {
      setTissueFilter([...tissueFilter, e]);
    }
  };

  const handleApply = () => {
    setAppliedTissueFilter(tissueFilter);
    setAppliedSnpFilter(snpFilter);
  };

  const handleReset = () => {
    setTissueFilter([]);
    setSnpFilter([]);
    setAppliedTissueFilter([]);
    setAppliedSnpFilter([]);
  };

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
        >
          <Button
            bgColor="red.100"
            onClick={() => handleReset()}
            marginTop="10px"
          >
            Reset Filters
          </Button>
          <Button
            bgColor="blue.100"
            onClick={() => handleApply()}
            marginTop="10px"
          >
            Apply Filters
          </Button>
        </GridItem>
        <GridItem pl="2" bg="orange.300" area={"tissues"}>
          <HeatmapRowHeader
            tissueEnrichmentPair={tissueRanking}
            selectCheckbox={handleTissueSelect}
            selectedCheckboxes={tissueFilter}
          />
        </GridItem>
        <GridItem pl="2" bg="pink.300" area={"snps"}>
          <HeatmapColHeader
            snpEnrichmentPair={snpRanking}
            selectCheckbox={handleSnpSelect}
            selectedCheckboxes={snpFilter}
          />
        </GridItem>
        <GridItem pl="2" bg="green.300" area={"distance"}></GridItem>
      </Grid>
    </div>
  );
};

export default EnrichmentHeatmap;
