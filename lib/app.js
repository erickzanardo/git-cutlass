"use strict"

var blessed = require("blessed");

var screens = require("./screens");
var MainFiles = require("./main-files");
var DiffFiles = require("./diff-files");
var Commit = require("./commit");
var Edit = require("./edit-files");

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
   
    this.backKeys = ["C-c", "escape", "q"];
    this.screen.key(this.backKeys, (ch, key) => {
      if (!this._preventBack) {
        this.back();
      }
    });

    this.screens = {};
    this.currentScreen = null;
    this.screenStack = [];

    this.mainFiles = new MainFiles(this);
    this.screens[screens.MAIN] = this.mainFiles;

    this.diffFiles = new DiffFiles(this);
    this.screens[screens.DIFF] = this.diffFiles;

    this.commit = new Commit(this);
    this.screens[screens.COMMIT] = this.commit;

    this.edit = new Edit(this);
    this.screens[screens.EDIT] = this.edit;
  }

  open(screen, over, args) {
    if (typeof(args) === "undefined") {
      args = over;
      over = false;
    }

    if (!(args instanceof Array)) {
      args = [args];
    }

    if (this.currentScreen) {
      if (!over) {
        this.currentScreen.hide();
      }
      this.screenStack.push(this.currentScreen);
    }

    this.currentScreen = this.screens[screen];
    this.currentScreen.show.apply(this.currentScreen, args);
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

  preventBack() {
    this._preventBack = true;
  }

  restoreBack() {
    this._preventBack = false;
  }
}

module.exports = new GitCutlass();
