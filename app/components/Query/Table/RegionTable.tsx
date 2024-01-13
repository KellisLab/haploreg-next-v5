"use client";
import Link from "next/link";
import { clsx } from "clsx";
import { InputOptions } from "../Input/dataManagement/inputReducer";

interface RegionTableProps {
  data: Array<Array<string>>;
  inputOptions: InputOptions;
}

export default function RegionTable({ data, inputOptions }: RegionTableProps) {
  return (
    <table className="table-auto w-full text-sm text-left text-gray-600 mt-2 border-separate border-spacing-0">
      <thead className="text-xs text-gray-700 bg-gray-50 rounded-tl-lg">
        <tr>
          <th className="px-1 border-r border-b border-t py-3 rounded-tl-lg border-l">
            chr
          </th>
          <th className="px-1 border-r border-b border-t py-3">pos (hg38)</th>
          <th className="px-1 border-r border-b border-t py-3">LD(r²)</th>
          <th className="px-1 border-r border-b border-t py-3">LD(D&apos;)</th>
          <th className="px-1 border-r border-b border-t py-3">variant</th>
          <th className="px-1 border-r border-b border-t py-3">Ref</th>
          <th className="px-1 border-r border-b border-t py-3">Alt</th>
          <th className="px-1 border-r border-b border-t py-3">AFR freq</th>
          <th className="px-1 border-r border-b border-t py-3">AMR freq</th>
          <th className="px-1 border-r border-b border-t py-3">ASN freq</th>
          <th className="px-1 border-r border-b border-t py-3">EUR freq</th>
          {inputOptions.mammalian === "GERP" ||
          inputOptions.mammalian === "both" ? (
            <th className="px-1 border-r border-b border-t py-3">GERP cons</th>
          ) : null}
          {inputOptions.mammalian === "SiPhy" ||
          inputOptions.mammalian === "both" ? (
            <th className="px-1 border-r border-b border-t py-3">SiPhy cons</th>
          ) : null}
          <th className="px-1 border-r border-b border-t py-3">
            Promoter histone marks
          </th>
          <th className="px-1 border-r border-b border-t py-3">
            Enhancer histone marks
          </th>
          <th className="px-1 border-r border-b border-t py-3">DNAse</th>
          <th className="px-1 border-r border-b border-t py-3">
            Proteins bound
          </th>
          <th className="px-1 border-r border-b border-t py-3">
            Motifs changed
          </th>
          <th className="px-1 border-r border-b border-t py-3">
            NHGRI/EBI GWAS hits
          </th>
          <th className="px-1 border-r border-b border-t py-3">
            Grasp QTL hits
          </th>
          <th className="px-1 border-r border-b border-t py-3">
            Selected eQTLhits
          </th>
          {inputOptions.relative === "GENCODE" ||
          inputOptions.relative === "both" ? (
            <th className="px-1 border-r border-b border-t py-3">
              GENCODE genes
            </th>
          ) : null}
          {inputOptions.relative === "RefSeq" ||
          inputOptions.relative === "both" ? (
            <th className="px-1 border-r border-b border-t py-3">
              RefSeq genes
            </th>
          ) : null}
          <th className="px-1 border-r border-b border-t py-3 rounded-tr-lg">
            dbSNP func annot
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((element, index) => (
          <RegionRow inputOptions={inputOptions} key={index} data={element} />
        ))}
      </tbody>
    </table>
  );
}

// define types
interface RegionRowProps {
  data: Array<string>;
  inputOptions: InputOptions;
}

function RegionRow({ data, inputOptions }: RegionRowProps) {
  return (
    <tr className="">
      <td className="border-r border-b p-1 border-l ">{data[0]}</td>
      <td className="border-r border-b p-1 ">{data[1]}</td>
      <td className="border-r border-b p-1 ">{data[2]}</td>
      <td className="border-r border-b p-1 ">{data[3]}</td>
      <td className={clsx("border-r border-b p-1 underline")}>
        <Link
          href={`/detail?variant=${encodeURIComponent(data[4])}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {data[4]}
        </Link>
      </td>
      <td className="border-r border-b p-1 ">{data[5]}</td>
      <td className="border-r border-b p-1 ">{data[6]}</td>
      <td className="border-r border-b p-1 ">{data[7]}</td>
      <td className="border-r border-b p-1 ">{data[8]}</td>
      <td className="border-r border-b p-1 ">{data[9]}</td>
      <td className="border-r border-b p-1 ">{data[10]}</td>
      {inputOptions.mammalian === "GERP" ||
      inputOptions.mammalian === "both" ? (
        <th
          className={clsx(
            "border-r border-b p-1",
            data[11] === "1" ? "bg-blue-300" : ""
          )}
        ></th>
      ) : null}
      {inputOptions.mammalian === "SiPhy" ||
      inputOptions.mammalian === "both" ? (
        <th
          className={clsx(
            "border-r border-b p-1",
            data[12] === "1" ? "bg-purple-300" : ""
          )}
        ></th>
      ) : null}
      <td
        className={clsx("border-r border-b p-1", data[13] ? "bg-red-200" : "")}
      >
        {data[13]}
      </td>
      <td
        className={clsx(
          "border-r border-b p-1",
          data[14] ? "bg-orange-200" : ""
        )}
      >
        {data[14]}
      </td>
      <td
        className={clsx("border-r border-b p-1", data[15] ? "bg-gray-200" : "")}
      >
        {data[15]}
      </td>
      <td
        className={clsx(
          "border-r border-b p-1",
          data[16] ? "bg-green-200" : ""
        )}
      >
        {data[16]}
      </td>
      <td
        className={clsx("border-r border-b p-1", data[17] ? "bg-pink-200" : "")}
      >
        {data[17]}
      </td>
      <td className="border-r border-b p-1 ">{data[18]}</td>
      <td className="border-r border-b p-1 ">{data[19]}</td>
      <td className="border-r border-b p-1 ">{data[20]}</td>
      {inputOptions.relative === "GENCODE" ||
      inputOptions.relative === "both" ? (
        <td className="border-r border-b p-1 ">{data[21]}</td>
      ) : null}
      {inputOptions.relative === "RefSeq" ||
      inputOptions.relative === "both" ? (
        <td className="border-r border-b p-1 ">{data[22]}</td>
      ) : null}
      <td className="border-r border-b p-1 ">{data[23]}</td>
    </tr>
  );
}
