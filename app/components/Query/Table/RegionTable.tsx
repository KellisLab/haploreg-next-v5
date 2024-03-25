"use client";
import Link from "next/link";
import { clsx } from "clsx";
import { InputOptions } from "../Input/dataManagement/inputReducer";

interface RegionTableProps {
  data: Array<Array<string>>;
  inputOptions: InputOptions;
  header: string;
}

export default function RegionTable({
  data,
  inputOptions,
  header,
}: RegionTableProps) {
  return (
    <table className="table-auto w-full text-[10px] text-left text-black mt-2 border-separate border-spacing-0">
      <thead className="text-[10px] text-gray-700 bg-gray-50 rounded-tl-lg">
        <tr>
          <th className="px-1 border-r border-b border-t py-1 rounded-tl-lg border-l">
            chr
          </th>
          <th className="px-1 border-r border-b border-t py-1">pos (hg38)</th>
          <th className="px-1 border-r border-b border-t py-1">LD(r²)</th>
          <th className="px-1 border-r border-b border-t py-1">LD(D&apos;)</th>
          <th className="px-1 border-r border-b border-t py-1">variant</th>
          <th className="px-1 border-r border-b border-t py-1">Ref</th>
          <th className="px-1 border-r border-b border-t py-1">Alt</th>
          <th className="px-1 border-r border-b border-t py-1">AFR freq</th>
          <th className="px-1 border-r border-b border-t py-1">AMR freq</th>
          <th className="px-1 border-r border-b border-t py-1">ASN freq</th>
          <th className="px-1 border-r border-b border-t py-1">EUR freq</th>
          {inputOptions.mammalian === "GERP" ||
          inputOptions.mammalian === "both" ? (
            <th className="px-1 border-r border-b border-t py-1">GERP cons</th>
          ) : null}
          {inputOptions.mammalian === "SiPhy" ||
          inputOptions.mammalian === "both" ? (
            <th className="px-1 border-r border-b border-t py-1">SiPhy cons</th>
          ) : null}
          <th className="px-1 border-r border-b border-t py-1 w-[100px]">
            Promoter histone marks
          </th>
          <th className="px-1 border-r border-b border-t py-1 w-[100px]">
            Enhancer histone marks
          </th>
          <th className="px-1 border-r border-b border-t py-1 w-[100px]">
            DNAse
          </th>
          <th className="px-1 border-r border-b border-t py-1">
            Proteins bound
          </th>
          <th className="px-1 border-r border-b border-t py-1 w-[130px]">
            Motifs changed
          </th>
          <th className="px-1 border-r border-b border-t py-1">
            NHGRI/EBI GWAS hits
          </th>
          <th className="px-1 border-r border-b border-t py-1 w-[55px]">
            Grasp QTL hits
          </th>
          <th className="px-1 border-r border-b border-t py-1">
            Selected eQTLhits
          </th>
          {inputOptions.relative === "GENCODE" ||
          inputOptions.relative === "both" ? (
            <th className="px-1 border-r border-b border-t py-1 w-[150px]">
              GENCODE genes
            </th>
          ) : null}
          {inputOptions.relative === "RefSeq" ||
          inputOptions.relative === "both" ? (
            <th className="px-1 border-r border-b border-t py-1">
              RefSeq genes
            </th>
          ) : null}
          <th className="px-1 border-r border-b border-t py-1 rounded-tr-lg w-[70px]">
            dbSNP func annot
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((element, index) => (
          <RegionRow
            inputOptions={inputOptions}
            key={index}
            data={element}
            header={header}
          />
        ))}
      </tbody>
    </table>
  );
}

// define types
interface RegionRowProps {
  data: Array<string>;
  inputOptions: InputOptions;
  header: string;
}

function RegionRow({ data, inputOptions, header }: RegionRowProps) {
  return (
    <tr className="">
      <td className="border-r border-b px-1 border-l ">{data[0]}</td>
      <td className="border-r border-b px-1 ">{data[1]}</td>
      <td className="border-r border-b px-1 ">{data[2]}</td>
      <td className="border-r border-b px-1 ">{data[3]}</td>
      <td
        className={clsx(
          "border-r border-b px-1 underline",
          data[4] === header ? "text-red-500" : ""
        )}
      >
        <Link
          href={`/detail?variant=${encodeURIComponent(data[4])}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {data[4]}
        </Link>
      </td>
      <td className="border-r border-b px-1 ">{data[5]}</td>
      <td className="border-r border-b px-1 ">{data[6]}</td>
      <td className="border-r border-b px-1 ">{data[7]}</td>
      <td className="border-r border-b px-1 ">{data[8]}</td>
      <td className="border-r border-b px-1 ">{data[9]}</td>
      <td className="border-r border-b px-1 ">{data[10]}</td>
      {inputOptions.mammalian === "GERP" ||
      inputOptions.mammalian === "both" ? (
        <th
          className={clsx(
            "border-r border-b px-1",
            data[11] === "1" ? "bg-blue-500" : ""
          )}
        ></th>
      ) : null}
      {inputOptions.mammalian === "SiPhy" ||
      inputOptions.mammalian === "both" ? (
        <th
          className={clsx(
            "border-r border-b px-1",
            data[12] === "1" ? "bg-purple-500" : ""
          )}
        ></th>
      ) : null}
      <td
        className={clsx("border-r border-b px-1", data[13] ? "bg-red-300" : "")}
      >
        {data[13]}
      </td>
      <td
        className={clsx(
          "border-r border-b px-1",
          data[14] ? "bg-orange-300" : ""
        )}
      >
        {data[14]}
      </td>
      <td
        className={clsx(
          "border-r border-b px-1",
          data[15] ? "bg-gray-300" : ""
        )}
      >
        {data[15]}
      </td>
      <td
        className={clsx(
          "border-r border-b px-1",
          data[16] ? "bg-green-300" : ""
        )}
      >
        {data[16]}
      </td>
      <td
        className={clsx(
          "border-r border-b px-1",
          data[17] ? "bg-pink-300" : ""
        )}
      >
        {data[17]}
      </td>
      <td className="border-r border-b px-1 ">{data[18]}</td>
      <td className="border-r border-b px-1 ">{data[19]}</td>
      <td className="border-r border-b px-1 ">{data[20]}</td>
      {inputOptions.relative === "GENCODE" ||
      inputOptions.relative === "both" ? (
        <td className="border-r border-b px-1 ">{data[21]}</td>
      ) : null}
      {inputOptions.relative === "RefSeq" ||
      inputOptions.relative === "both" ? (
        <td className="border-r border-b px-1 ">{data[22]}</td>
      ) : null}
      <td className="border-r border-b px-1 ">{data[23]}</td>
    </tr>
  );
}
