"use strict"

var blessed = require("blessed");

var screens = require("./screens");
var MainFiles = require("./main-files");
var DiffFiles = require("./diff-files");

class GitCutlass {
  constructor() {
    this.screen = blessed.screen({
      autoPadding: true,
      smartCSR: true
    });
    this.screen.title = "Git Cutlass";

    this.container = blessed.box({
      height: "100%",
      width: "100%"
    });
    this.screen.append(this.container);
    
    this.screen.key(["C-c", "escape", "q"], (ch, key) => {
      this.back();
    });

    this.screens = {};
    this.currentScreen = null;
    this.screenStack = [];
    this.mainFiles = new MainFiles(this);
    this.screens[screens.MAIN] = this.mainFiles;

    this.diffFiles = new DiffFiles(this);
    this.screens[screens.DIFF] = this.diffFiles;
  }

  open(screen, args) {
    if (this.currentScreen) {
      this.currentScreen.hide();
      this.screenStack.push(this.currentScreen);
    }

    this.currentScreen = this.screens[screen];
    this.currentScreen.show.call(this.currentScreen, args);
    this.render();
  }

  back() {
    if (this.screenStack.length) {
      this.currentScreen.hide();
      this.currentScreen = this.screenStack.pop();
      this.currentScreen.show();
      this.render();
    } else {
      process.exit(0);
    }
  }

  render() {
    this.screen.render();
  }

  run() {
    this.open(screens.MAIN);
  }
}

module.exports = new GitCutlass();
