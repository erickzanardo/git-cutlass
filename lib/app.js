"use strict"

var blessed = require("blessed");
var MainFiles = require("./main-files");

class GitCutlass {
  constructor() {
    this.screen = blessed.screen({
      autoPadding: true,
      smartCSR: true
    });
    this.screen.title = "Git Cutlass";
    
    this.screen.key(['C-c'], function(ch, key) {
      process.exit(0);
    });
  }

  run() {
    var mainFiles = new MainFiles(this.screen);
    mainFiles.update();
    mainFiles.list.focus();
    
    this.screen.render();
  }
}

module.exports = new GitCutlass();
