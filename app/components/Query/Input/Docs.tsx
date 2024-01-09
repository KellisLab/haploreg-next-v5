const Docs = () => {
  return (
    <>
      <p>
        For details on data sources and methods along with usage examples, see
        the{" "}
        <a
          className="text-blue-600 hover:underline"
          href="https://pubs.broadinstitute.org/mammals/haploreg/documentation_v4.1.html"
          target="popup"
        >
          full documentation
        </a>{" "}
        (opens in a pop-up window.)
      </p>{" "}
      <br></br>{" "}
      <p>
        The HaploReg database and web interface were originally produced by{" "}
        <a
          className="text-blue-600 hover:underline"
          href="http://www.mit.edu/~lukeward"
        >
          Luke Ward
        </a>{" "}
        in the <a href="http://compbio.mit.edu/">Kellis Lab at MIT</a>. HaploReg
        is hosted by the{" "}
        <a
          className="text-blue-600 hover:underline"
          href="http://www.broadinstitute.org/"
        >
          Broad Institute
        </a>
        .{" "}
      </p>
      <br></br>
      <p>
        To cite HaploReg, please refer to our publication in Nucleic Acids
        Research:{" "}
        <a
          className="text-blue-600 hover:underline"
          href="http://nar.oxfordjournals.org/content/early/2011/11/07/nar.gkr917.long"
        >
          HaploReg: a resource for exploring chromatin states, conservation, and
          regulatory motif alterations within sets of genetically linked
          variants.
        </a>{" "}
        (PMID:22064851).{" "}
      </p>
      <br></br>
      <p>
        The underlying data are available in the following{" "}
        <a
          className="text-blue-600 hover:underline"
          href="https://pubs.broadinstitute.org/mammals/haploreg/data"
        >
          directory
        </a>
        .{" "}
      </p>
      <br></br>
      <p>Contact: haploreg@mit.edu </p>
    </>
  );
};

export default Docs;
