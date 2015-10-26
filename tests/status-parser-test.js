var chai = require("chai");
var expect = chai.expect;
var statusParser = require("../lib/status-parser");

describe("ParseStatus", () => {

  var status = " M a.txt\n";
     status += " D b.txt\n";
     status += "?? c.txt\n";
     status += "M  d.txt\n";
     status += "D  e.txt\n";
     status += "A  f.txt";

  var parsed = statusParser.parse(status);

  it("parses correctly the 'git status --porcelain'", () => {
    expect(parsed.modified.length).to.equal(1);
    expect(parsed.modified[0]).to.equal("a.txt");

    expect(parsed.deleted.length).to.equal(1);
    expect(parsed.deleted[0]).to.equal("b.txt");

    expect(parsed.untracked.length).to.equal(1);
    expect(parsed.untracked[0]).to.equal("c.txt");

    expect(parsed.toCommit.modified.length).to.equal(1);
    expect(parsed.toCommit.modified[0]).to.equal("d.txt");

    expect(parsed.toCommit.deleted.length).to.equal(1);
    expect(parsed.toCommit.deleted[0]).to.equal("e.txt");

    expect(parsed.toCommit.added.length).to.equal(1);
    expect(parsed.toCommit.added[0]).to.equal("f.txt");
  });
});
