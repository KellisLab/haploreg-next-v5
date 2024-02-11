import { useEffect, useState } from "react";
import { ExplorerData } from "../Explorer";
import { RSC_ACTION_CLIENT_WRAPPER_ALIAS } from "next/dist/lib/constants";

const useHaploBlockEnhancement = (snps: string[]) => {
  const [snpdata, setSnpData] = useState<ExplorerData>({} as ExplorerData);

  useEffect(() => {
    const query = async () => {
      setSnpData({ ...snpdata, isLoading: true });
      const url = new URL("api/compileExplorer", location.origin);
      url.searchParams.append("input", JSON.stringify(snps));
      const response = await fetch(url);
      const outputJson = await response.json();
      setSnpData({
        isLoading: false,
        enrichments: outputJson.success.data,
      });
    };
    query();
  }, []);

  return {
    snpdata,
  };
};

export default useHaploBlockEnhancement;
