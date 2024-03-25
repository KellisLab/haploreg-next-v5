"use client";
import { useState } from "react";
import Docs from "./Docs";
import Tabs from "./Tabs";
import PrimaryOptions from "./PrimaryOptions";
import SecondaryOptions from "./SecondaryOptions";

const InputArea = () => {
  const [tab, setTab] = useState<number>(0);

  return (
    <div className="flex flex-col">
      <Tabs tab={tab} setTab={(tab: number) => setTab(tab)} />
      <div className="mt-2 mb-4 rounded-lg border p-4">
        <div className={tab === 0 ? "block" : "hidden"}>
          <PrimaryOptions />
        </div>
        <div className={tab === 1 ? "block" : "hidden"}>
          <SecondaryOptions />
        </div>
        <div className={tab === 2 ? "block" : "hidden"}>
          <Docs />
        </div>
      </div>
    </div>
  );
};

export default InputArea;
