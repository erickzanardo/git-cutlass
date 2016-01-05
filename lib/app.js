"use strict"

var blessed = require("blessed");

var screens = require("./screens");
var MainFiles = require("./main-files");
var DiffFiles = require("./diff-files");
var Commit = require("./commit");
var Edit = require("./edit-files");
var Delete = require("./delete-file");
var History = require("./history");

class GitCutlass {

  constructor() {
    this.tabs = [];
    this.screen = blessed.screen({
      autoPadding: true,
      smartCSR: true
    });
    this.screen.title = "Git Cutlass";

    this.container = blessed.box({
      top: 3,
      width: "100%",
      bottom: 0
    });
    this.screen.append(this.container);

    this.commitLabel = blessed.box({
      width: "50%",
      height: 3,
      content: "1 - Commit",
      border: {
        type: "line"
      }
    });
    this.screen.append(this.commitLabel);
    this.tabs.push(this.commitLabel);

    this.historyLabel = blessed.box({
      left: "50%",
      width: "50%",
      height: 3,
      content: "2 - History",
      border: {
        type: "line"
      }
    });
    this.screen.append(this.historyLabel);
    this.tabs.push(this.historyLabel);
   
    this.backKeys = ["escape", "q"];
    this.screen.key(this.backKeys, (ch, key) => {
      if (!this._preventBack) {
        this.back();
      }
    });

    this.screen.key("1", (ch, key) => {
      if (this.currentTab != 0) {
        this.open(screens.MAIN);
        this.highlightTab(0);
      }
    });

    this.screen.key("2", (ch, key) => {
      if (this.currentTab != 1) {
        this.open(screens.HISTORY);
        this.highlightTab(1);
      }
    });

    this.screens = {};
    this.currentScreen = null;
    this.currentTab = null;
    this.screenStack = [];

    this.mainFiles = new MainFiles(this);
    this.screens[screens.MAIN] = this.mainFiles;

    this.diffFiles = new DiffFiles(this);
    this.screens[screens.DIFF] = this.diffFiles;

    this.commit = new Commit(this);
    this.screens[screens.COMMIT] = this.commit;

    this.edit = new Edit(this);
    this.screens[screens.EDIT] = this.edit;

    this.delete = new Delete(this);
    this.screens[screens.DELETE] = this.delete;

    this.history = new History(this);
    this.screens[screens.HISTORY] = this.history;
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
    this.container.render();
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

  highlightTab(tab) {
    if (this.currentTab !== null) {
      this.tabs[this.currentTab].style.bg = null;
      this.screenStack = [];
    }

    this.currentTab = tab;
    this.tabs[this.currentTab].style.bg = "green";
    this.tabs[this.currentTab].render();
  }

  run() {
    this.highlightTab(0);
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
