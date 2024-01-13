import type { Metadata } from "next";
import "./globals.css";
import ChakraStyleProvider from "./components/ChakraStyleProvider";
import ReactQueryProvider from "./components/ReactQueryProvider";

export const metadata: Metadata = {
  title: "HaploReg v5 Beta",
  description:
    "HaploReg is a tool for exploring annotations of the noncoding genome at variants on haplotype blocks, such as candidate regulatory SNPs at disease-associated loci. Using LD information from the 1000 Genomes Project, linked SNPs and small indels can be visualized along with chromatin state and protein binding annotation from the Roadmap Epigenomics and ENCODE projects, sequence conservation across mammals, the effect of SNPs on regulatory motifs, and the effect of SNPs on expression from eQTL studies. HaploReg is designed for researchers developing mechanistic hypotheses of the impact of non-coding variants on clinical phenotypes and normal variation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ChakraStyleProvider>{children}</ChakraStyleProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
