var chai = require("chai");
var expect = chai.expect;
var statusParser = require("../../lib/git/status-parser");

describe("ParseStatus", () => {

  var status = " M a.txt\n";
     status += " D b.txt\n";
     status += "?? c.txt\n";
     status += "M  d.txt\n";
     status += "D  e.txt\n";
     status += "A  f.txt\n";
     status += "R  g.txt";

  var parsed = statusParser.parse(status);

  it("parses correctly the 'git status --porcelain'", () => {
    expect(parsed.modified.length).to.equal(1);
    expect(parsed.modified[0].file).to.equal("a.txt");

    expect(parsed.deleted.length).to.equal(1);
    expect(parsed.deleted[0].file).to.equal("b.txt");

    expect(parsed.untracked.length).to.equal(1);
    expect(parsed.untracked[0].file).to.equal("c.txt");

    expect(parsed.toCommit.modified.length).to.equal(1);
    expect(parsed.toCommit.modified[0].file).to.equal("d.txt");

    expect(parsed.toCommit.deleted.length).to.equal(1);
    expect(parsed.toCommit.deleted[0].file).to.equal("e.txt");

    expect(parsed.toCommit.added.length).to.equal(1);
    expect(parsed.toCommit.added[0].file).to.equal("f.txt");

    expect(parsed.toCommit.renamed.length).to.equal(1);
    expect(parsed.toCommit.renamed[0].file).to.equal("g.txt");

    expect(parsed.hasToCommit()).to.be.true;
    expect(parsed.hasNotStaged()).to.be.true;
    expect(parsed.hasUntracked()).to.be.true;
  });
});
