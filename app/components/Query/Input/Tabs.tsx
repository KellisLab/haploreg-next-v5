"use client";
import clsx from "clsx";
import React from "react";

interface Props {
  tab: number;
  setTab: (tab: number) => void;
}

const tabs = ({ tab, setTab }: Props) => {
  return (
    <>
      <ul className="flex space-x-1 p-2 bg-gray-100 rounded-lg mt-4 w-[20rem] justify-around">
        <li>
          <a
            href="#"
            onClick={() => setTab(0)}
            className={clsx(
              "inline-block px-2 py-1 rounded-lg text-[12px] font-semibold",
              tab == 0 ? "bg-white" : "bg-gray-100"
            )}
          >
            Build Query
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => setTab(1)}
            className={clsx(
              "inline-block px-2 py-1 rounded-lg text-[12px] font-semibold",
              tab == 1 ? "bg-white" : "bg-gray-100"
            )}
          >
            Set Options
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => setTab(2)}
            className={clsx(
              "inline-block px-2 py-1 rounded-lg text-[12px] font-semibold",
              tab == 2 ? "bg-white" : "bg-gray-100"
            )}
          >
            Documentation
          </a>
        </li>
      </ul>
    </>
  );
};

export default tabs;
