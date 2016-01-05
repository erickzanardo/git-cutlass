"use strict"

var cp = require("child_process");
var path = require("path");

var asString = (bf) => bf ? bf.toString() : null;

class GitCli {
  status(args) {
    return asString(cp.execSync("git status " + args));
  }

  basedir() {
    return asString(cp.execSync("git rev-parse --show-toplevel")).replace("\n", "");
  }

  checkout(file) {
    return cp.execSync("git checkout " + path.join(this.basedir(), file));
  }

  reset(file) {
    return cp.execSync("git reset HEAD " + path.join(this.basedir(), file));
  }

  add(file) {
    return cp.execSync("git add " + path.join(this.basedir(), file));
  }

  diff(file) {
    return asString(cp.execSync("git diff " + path.join(this.basedir(), file)));
  }

  commit(message) {
    return cp.execSync("git commit -m\"" + message + "\"");
  }

  currentBranch() {
    var result = asString(cp.execSync("git branch | grep \"* \""));
    return result.replace("* ", "").replace("\n", "");
  }

  removeFile(path) {
    return cp.execSync("rm -rf " + path);
  }

  log() {
    var lines = asString(cp.execSync("git log --pretty=format:\"%H|%ad|%s%d [%an]\" --graph --date=short")).split("\n");
    var logs = [];

    lines.forEach((line) => {

      var i = line.indexOf("|");
      var sha = line.substring(2, i);
      line = line.substring(i + 1, line.length);

      i = line.indexOf("|");
      var date = line.substring(0, i);
      line = line.substring(i + 1, line.length);

      var message = line;

      logs.push({
        sha: sha,
        date: date,
        message: message
      });
    });

    return logs;
  }

  listFilesFromSha(sha) {
    return asString(cp.execSync("git diff-tree --no-commit-id --name-only -r " + sha)).split("\n");
  }
}

module.exports = new GitCli();
