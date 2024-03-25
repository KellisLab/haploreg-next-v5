const Header = () => {
  return (
    <>
      <h1 className="mb-4 text-3xl font-bold leading-none tracking-tight">
        HaploReg v5
      </h1>
      <h4 className="mb-2 text-[15px] font-bold leading-none tracking-tight">
        with enhancer analysis from EpiMap, ... and genome visualization support
        from IGV
      </h4>
      <p className="text-[13px]">
        HaploReg is a tool for exploring annotations of the noncoding genome at
        variants on haplotype blocks, such as candidate regulatory SNPs at
        disease-associated loci. Using LD information from the 1000 Genomes
        Project, linked SNPs and small indels can be visualized along with
        chromatin state and protein binding annotation from the Roadmap
        Epigenomics and ENCODE projects, sequence conservation across mammals,
        the effect of SNPs on regulatory motifs, and the effect of SNPs on
        expression from eQTL studies. HaploReg is designed for researchers
        developing mechanistic hypotheses of the impact of non-coding variants
        on clinical phenotypes and normal variation.
      </p>
    </>
  );
};

export default Header;
