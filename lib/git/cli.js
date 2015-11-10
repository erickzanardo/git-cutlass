"use strict"

var cp = require("child_process");

var asString = (bf) => bf ? bf.toString() : null;

class GitCli {
  status(args) {
    return asString(cp.execSync("git status " + args));
  }

  checkout(file) {
    return cp.execSync("git checkout " + file);
  }

  reset(file) {
    return cp.execSync("git reset HEAD " + file);
  }

  add(file) {
    return cp.execSync("git add " + file);
  }

  diff(file) {
    return asString(cp.execSync("git diff " + file));
  }

  commit(message) {
    return cp.execSync("git commit -m\"" + message + "\"");
  }

  currentBranch() {
    var result = asString(cp.execSync("git branch | grep \"* \""));
    return result.replace("* ", "").replace("\n", "");
  }
}

module.exports = new GitCli();
