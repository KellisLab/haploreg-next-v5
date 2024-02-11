import React from "react";
import { ExplorerOptionsType } from "../Query";
import useHaploBlockEnhancement from "./hooks/useHaploBlockEnhancement";

interface Props {
  options: ExplorerOptionsType;
}

export interface ExplorerData {
  enrichments: number[];
  isLoading: boolean;
}

const Explorer = ({
  options: { isLoading, explorerOptionsData, explorerOptionsError },
}: Props) => {
  const { snpdata } = useHaploBlockEnhancement(
    Object.entries(explorerOptionsData).map((items) => items[0].split(" ")[0])
  );
  if (isLoading) return null;

  if (explorerOptionsError) return <p>{explorerOptionsError}</p>;
  if (!explorerOptionsData) return null;

  return (
    <div className="tm-5 p-10 bg-slate-500">
      {Object.entries(explorerOptionsData).map(([key, snps]) => (
        <p key={key}>{key}</p>
      ))}
      {snpdata.enrichments
        ? snpdata.enrichments.map((val) => <p key={val}>{val}</p>)
        : null}
    </div>
  );
};

export default Explorer;
