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
}

module.exports = new GitCli();
