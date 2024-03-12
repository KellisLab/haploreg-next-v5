import React from "react";
import { Rankings } from "../EnrichmentHeatmap";

interface Props {
  rankings: Rankings;
  closestEnhancers: Map<string, Map<string, number>>;
}

const ClosestEnhancerTable = ({ rankings, closestEnhancers }: Props) => {
  return (
    <table className="table-auto w-full text-sm text-left text-gray-600 mt-2 border-separate border-spacing-0">
      <tbody>
        {rankings.snpRanking.map((snpElement, snpIndex) => (
          <tr key={snpIndex}>
            {rankings.tissueRanking.map((tissueElement, tissueIndex) => (
              <td key={tissueIndex}>
                {closestEnhancers.get(snpElement[0])?.get(tissueElement[0])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClosestEnhancerTable;
