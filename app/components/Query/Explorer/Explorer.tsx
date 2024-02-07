import React, { useState } from "react";
import { ExplorerOptionsType } from "../Query";
import useHaploBlockEnhancement from "./hooks/useHaploBlockEnhancement";

interface Props {
  options: ExplorerOptionsType;
}

export interface ExplorerData {
  // what backend compileExplorer gives us
  isLoading: boolean;
}

const Explorer = ({
  options: { isLoading, explorerOptionsData, explorerOptionsError },
}: Props) => {
  const [snps, setSnps] = useState<string[]>([]);
  const { query, snpdata } = useHaploBlockEnhancement(snps);

  if (isLoading) return null;

  if (explorerOptionsError) return <p>{explorerOptionsError}</p>;
  if (!explorerOptionsData) return null;

  console.log(explorerOptionsData);

  return (
    <div className="tm-5 p-10 bg-slate-500">
      {Object.entries(explorerOptionsData).map(
        ([key, snps]) => (
          <p key={key}>{key}</p>
        )
        //snps.map((snp: string) => <p key={snp}>{snp}</p>)
      )}
    </div>
  );
};

export default Explorer;
