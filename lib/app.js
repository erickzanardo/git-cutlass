"use strict"

var blessed = require("blessed");
var MainFiles = require("./main-files");
var DiffFiles = require("./diff-files");

class GitCutlass {
  constructor() {
    this.screen = blessed.screen({
      autoPadding: true,
      smartCSR: true
    });
    this.screen.title = "Git Cutlass";
    
    // Quit on Escape, q, or Control-C.
    this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      process.exit(0);
    });
  }

  run() {
    var mainFiles = new MainFiles(this.screen);
    mainFiles.update();
    mainFiles.list.focus();
    
    DiffFiles(this.screen);
    
    this.screen.render();
  }
}

module.exports = new GitCutlass();
