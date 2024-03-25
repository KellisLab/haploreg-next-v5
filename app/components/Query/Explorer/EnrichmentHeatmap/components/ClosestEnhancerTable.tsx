import React from "react";
import { Rankings } from "../../EnrichmentHeatmap";

interface Props {
  rankings: Rankings;
  closestEnhancers: Map<string, Map<string, number>>;
}

const ClosestEnhancerTable = ({ rankings, closestEnhancers }: Props) => {
  return (
    <div>
      <div className="divide-y divide-black border-t border-l border-r border-b border-black float-left">
        {rankings.snpRanking.map((snpElement, snpIndex) => (
          <div
            className="divide-x divide-black flex flex-row flex-1 "
            key={snpIndex}
          >
            {rankings.tissueRanking.map((tissueElement, tissueIndex) => (
              <div
                className={`w-9 h-[34px] ${
                  closestEnhancers.get(snpElement[0])?.get(tissueElement[0])
                    ? closestEnhancers
                        .get(snpElement[0])
                        ?.get(tissueElement[0])! > 100
                      ? closestEnhancers
                          .get(snpElement[0])
                          ?.get(tissueElement[0])! > 300
                        ? closestEnhancers
                            .get(snpElement[0])
                            ?.get(tissueElement[0])! > 600
                          ? closestEnhancers
                              .get(snpElement[0])
                              ?.get(tissueElement[0])! > 1000
                            ? closestEnhancers
                                .get(snpElement[0])
                                ?.get(tissueElement[0])! > 1500
                              ? closestEnhancers
                                  .get(snpElement[0])
                                  ?.get(tissueElement[0])! > 3000
                                ? ""
                                : "bg-blue-100"
                              : "bg-blue-200"
                            : "bg-blue-300"
                          : "bg-blue-400"
                        : "bg-blue-500"
                      : "bg-blue-600"
                    : ""
                }`}
                key={tissueIndex}
              >
                <p className="text-[11px] text-center pt-[9px]">
                  {closestEnhancers.get(snpElement[0])?.get(tissueElement[0])}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClosestEnhancerTable;
