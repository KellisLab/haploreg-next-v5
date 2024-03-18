import React from "react";
import { Rankings } from "../EnrichmentHeatmap";

interface Props {
  rankings: Rankings;
  closestEnhancers: Map<string, Map<string, number>>;
}

const ClosestEnhancerTable = ({ rankings, closestEnhancers }: Props) => {
  return (
    <table className="table-fixed text-[10px] text-center border-collapse">
      <thead></thead>
      <tbody>
        <tr>
          {rankings.tissueRanking.map((tissueElement, tissueIndex) => (
            <td className="border px-3.5 py-2" key={tissueIndex}>
              {0}
            </td>
          ))}
        </tr>
        {rankings.snpRanking.map((snpElement, snpIndex) => (
          <tr key={snpIndex}>
            {rankings.tissueRanking.map((tissueElement, tissueIndex) => (
              <td className="border px-.8 py-2" key={tissueIndex}>
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
