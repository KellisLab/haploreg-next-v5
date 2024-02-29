import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import HeatmapColHeader from "./HeatmapColHeader";
import HeatmapRowHeader from "./HeatmapRowHeader";

interface Props {
  enrichments: Map<string, Map<string, number>>;
}

const EnrichmentHeatmap = ({ enrichments }: Props) => {
  // on new enrichments, we should just have nothin in the tissue filters,
  // if it updates, we should change the subset of enrichments that go into the output
  // create a new
  const [tissueFilters, setTissueFilters] = useState<string[]>([]);
  const [snpFilters, setSnpFilters] = useState<string[]>([]);

  // add another state that changes only when the filter submit button is hit,

  //   const enrichmentsToUse = new Map();
  //   for (const snp in enrichments.keys()) {
  //     if (snpFilters.includes(snp))
  //       enrichmentsToUse.set(snp, enrichments.get(snp));
  //   } // table with only snps we want with references to the prop

  let partiallyFilteredEnrichments = [...enrichments.entries()];
  if (snpFilters.length !== 0) {
    partiallyFilteredEnrichments = partiallyFilteredEnrichments.filter(
      (value) => snpFilters.includes(value[0])
    );
  }

  let enrichmentsToUse: Array<Array<string | Array<Array<string | number>>>>;
  if (tissueFilters.length !== 0) {
    enrichmentsToUse = partiallyFilteredEnrichments.map((enrichments) => [
      enrichments[0],
      [...enrichments[1].entries()].filter((value) =>
        tissueFilters.includes(value[0])
      ),
    ]);
  } else {
    enrichmentsToUse = partiallyFilteredEnrichments.map((enrichments) => [
      enrichments[0],
      [...enrichments[1].entries()],
    ]);
  }

  // console.log(enrichmentsToUse);

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

  console.log(snpRanking);
  console.log(tissueRanking);

  const handleSnpSelect = (e: string) => {
    if (snpFilters.includes(e)) {
      setSnpFilters(snpFilters.filter((value) => value != e));
    } else {
      setSnpFilters([...snpFilters, e]);
    }
  };

  const handleTissueSelect = (e: string) => {
    if (tissueFilters.includes(e)) {
      setTissueFilters(tissueFilters.filter((value) => value != e));
    } else {
      setTissueFilters([...tissueFilters, e]);
    }
  };

  return (
    <div>
      <Grid
        templateAreas={`"gap header"
                  "nav main"`}
        gridTemplateRows={"150px 1fr"}
        gridTemplateColumns={"150px 1fr"}
        h="500px"
        gap="2"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem pl="2" bg="orange.300" area={"header"}>
          <HeatmapRowHeader
            tissueEnrichmentPair={tissueRanking}
            selectCheckbox={handleTissueSelect}
            selectedCheckboxes={tissueFilters}
          />
        </GridItem>
        <GridItem pl="2" bg="pink.300" area={"nav"}>
          <HeatmapColHeader
            snpEnrichmentPair={snpRanking}
            selectCheckbox={handleSnpSelect}
            selectedCheckboxes={snpFilters}
          />
        </GridItem>
        <GridItem pl="2" bg="green.300" area={"main"}></GridItem>
      </Grid>
    </div>
  );
};

export default EnrichmentHeatmap;
