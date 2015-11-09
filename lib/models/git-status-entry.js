"use strict"
class GitStatusEntry {
  constructor(type, file) {
    this.type = type;
    this.file = file;
  }

  toString() {
    return [this.type, this.file].join(" - ");
  }

  color() {
    if (["D ", "A ", "M ", "R "].indexOf(this.type) != -1) {
      return "green";
    } else {
      return "red";
    }
  }

  filePath() {
    if (this.type == "R ") {
      return this.file.split("-> ")[1];
    } else {
      return this.file;
    }
  }
}

module.exports = GitStatusEntry;
