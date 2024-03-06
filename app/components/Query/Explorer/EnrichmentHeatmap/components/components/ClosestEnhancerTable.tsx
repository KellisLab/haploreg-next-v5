import React from "react";

interface Props {
  snpRanking: [string, number][];
  tissueRanking: [string, number][];
  closestEnhancers: Map<string, Map<string, number>>;
}

const ClosestEnhancerTable = ({
  snpRanking,
  tissueRanking,
  closestEnhancers,
}: Props) => {
  return (
    <table className="table-auto w-full text-sm text-left text-gray-600 mt-2 border-separate border-spacing-0">
      <tbody>
        {snpRanking.map((snpElement, snpIndex) => (
          <tr key={snpIndex}>
            {tissueRanking.map((tissueElement, tissueIndex) => (
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
