import { useState } from "react";
import { ExplorerData } from "../Explorer";

const useHaploBlockEnhancement = (snps: string[]) => {
  const [snpdata, setSnpData] = useState<ExplorerData>({} as ExplorerData);

  // probabily just do a useEffect hook instead of this crap
  const query = async () => {
    setSnpData({ ...snpdata, isLoading: true });
    // hook with react query to send a get request to route .tsxin compile table  // do this in async hook in backend
    const url = new URL("api/compileExplorer", location.origin);
    //url.searchParams.append("input", );
    const response = await fetch(url);
    const outputJson = await response.json();
    setSnpData({
      isLoading: false,
    });
  };

  return {
    snpdata,
    query,
  };
};

export default useHaploBlockEnhancement;
