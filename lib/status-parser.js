function ParseResult(modified, deleted, untracked, toCommit) {
  this.modified = modified;
  this.deleted = deleted;
  this.untracked = untracked;
  this.toCommit = toCommit;
}

ParseResult.prototype.hasToCommit = function() {
  var toCommit = this.toCommit;
  return (toCommit.modified.length + toCommit.deleted.length + toCommit.added.length) > 0;
}

ParseResult.prototype.hasNotStaged = function() { return (this.modified.length + this.deleted.length) > 0};
ParseResult.prototype.hasUntracked = function() { return this.untracked.length >  0 };

module.exports = {
  parse: function(status) {
    var modified = [],
        deleted = [],
        untracked = [],
        toCommit = {
          modified: [],
          deleted: [],
          added: []
        };
   
    if (status) {
      var files = status.split("\n");
      files.forEach((line) => {
        var id1 = line.substring(0, 1);
        var id2 = line.substring(1, 2);
        var file = line.substring(3, line.length);

        if (id1 == " " && id2 == "M") {
          modified.push(file);
        } else if (id1 == " " && id2 == "D") {
          deleted.push(file);
        } else if (id1 == "?" && id2 == "?") {
          untracked.push(file);
        } else if (id1 == "D" && id2 == " ") {
          toCommit.deleted.push(file);
        } else if (id1 == "M" && id2 == " ") {
          toCommit.modified.push(file);
        } else if (id1 == "A" && id2 == " ") {
          toCommit.added.push(file);
        } 
      });
    }

    return new ParseResult(modified, deleted, untracked, toCommit);
  }
};
