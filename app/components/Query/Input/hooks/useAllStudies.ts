import staticGwasList from "@/app/data/gwasList";
import { useEffect, useState } from "react";

const useAllStudies = () => {
  const [gwasList, setGwasList] = useState<string[]>([]);

  // ** something with react query

  // useEffect(() => {
  //   const fetchGwasOptions = async () => {
  //     try {
  //       const response = await fetch('../../api/fetchGwasOptions', { method: 'GET' });
  //       const data = await response.json();
  //       console.log(data);
  //       setGwasList(data.options);
  //     } catch (error) {
  //       console.error('Error fetching options:', error);
  //     }
  //   };
  //   fetchGwasOptions();
  // }, []);

  useEffect(() => {
    setGwasList(staticGwasList.options);
  }, []);

  return gwasList;
};

export default useAllStudies;
