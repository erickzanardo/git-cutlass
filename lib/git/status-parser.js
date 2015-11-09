var GitStatusEntry = require("./../models/git-status-entry");
//UU app/assets/javascripts/modules/eula.js

function ParseResult(bothModified, modified, deleted, untracked, toCommit) {
  this.bothModified = bothModified;
  this.modified = modified;
  this.deleted = deleted;
  this.untracked = untracked;
  this.toCommit = toCommit;
}

ParseResult.prototype.hasToCommit = function() {
  var toCommit = this.toCommit;
  return (toCommit.modified.length + toCommit.deleted.length + toCommit.added.length) > 0;
}

ParseResult.prototype.hasNotStaged = function() { return (this.modified.length + this.deleted.length + this.bothModified.length) > 0};
ParseResult.prototype.hasUntracked = function() { return this.untracked.length >  0 };

module.exports = {
  parse: function(status) {
    var bothModified = [],
        modified = [],
        deleted = [],
        untracked = [],
        toCommit = {
          modified: [],
          deleted: [],
          added: [],
          renamed: []
        };
   
    if (status) {
      var files = status.split("\n");
      files.forEach((line) => {
        var id1 = line.substring(0, 1);
        var id2 = line.substring(1, 2);
        var file = line.substring(3, line.length);

        var entryfile = new GitStatusEntry(id1 + id2, file);

        if (id1 == " " && id2 == "M") {
          modified.push(entryfile);
        } else if (id1 == " " && id2 == "D") {
          deleted.push(entryfile);
        } else if (id1 == "?" && id2 == "?") {
          untracked.push(entryfile);
        } else if (id1 == "U" && id2 == "U") {
          bothModified.push(entryfile);
        } else if (id1 == "D" && id2 == " ") {
          toCommit.deleted.push(entryfile);
        } else if (id1 == "M" && id2 == " ") {
          toCommit.modified.push(entryfile);
        } else if (id1 == "A" && id2 == " ") {
          toCommit.added.push(entryfile);
        } else if (id1 == "R" && id2 == " ") {
          toCommit.renamed.push(entryfile);
        } 
      });
    }

    return new ParseResult(bothModified, modified, deleted, untracked, toCommit);
  }
};
