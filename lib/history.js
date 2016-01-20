"use strict"

var blessed = require("blessed");
var screens = require("./screens");
var git = require("./git/cli");

const PAGE_SIZE = 20;
const MORE_ITENS = " [More] ";

class History {

  constructor(app) {
    this.app = app;

    this.logList = blessed.list({
      top: 0,
      height: "50%",
      left: "center",
      width: "100%",
      keys: true,
      vi: true,
      label: "Commits",
      border: {
        type: "line"
      },
      style: {
        selected: {
          bg: "blue"
        }
      }
    });
    this.logList.hide();
    this.app.container.append(this.logList);

    this.logList.on("cancel", () => this.app.back() );
    this.logList.on("select", (item, i) => {
      this.fileList.clearItems();
      if (item.getContent() == MORE_ITENS) {
        this.currentPage++;
        this._addPage();
      } else {
        this.selectedSha = this.logs[i].sha;
        var files = git.listFilesFromSha(this.selectedSha);
        files.forEach((file) => this.fileList.addItem(file));
        this.fileList.focus();
      }
    });

    this.fileList = blessed.list({
      top: "50%",
      bottom: 0,
      left: "center",
      width: "100%",
      keys: true,
      vi: true,
      label: "Files",
      border: {
        type: "line"
      },
      style: {
        selected: {
          bg: "blue"
        }
      }
    });
    this.fileList.hide();

    this.fileList.on("cancel", () => {
      this.fileList.clearItems();
      this.logList.focus()
    });

    this.fileList.on("select", (item) => {
      var filePath = item.getContent();
      var diff = git.diffFromParentSha(filePath, this.selectedSha);
      this.app.restoreBack();
      this.app.open(screens.DIFF, [filePath, diff]);
    });

    this.app.container.append(this.fileList);
  }

  _addPage() {
    var page = [];

    var showing = (this.currentPage * PAGE_SIZE);
    if (this.logList.getItem(showing) &&
        this.logList.getItem(showing).getContent() == MORE_ITENS) {
      this.logList.removeItem(showing);
    }

    if (this.logs.length > PAGE_SIZE) {
      var start = this.currentPage * PAGE_SIZE ,
          end = Math.min(start + PAGE_SIZE, this.logs.length);
      page = this.logs.slice(start, end);
    } else {
      page = this.showing.concat(this.logs.slice());
    }

    page.forEach((log) => {
      this.logList.pushItem({
        log: log,
        getContent: () => [log.sha, log.date, log.message].join(" - ")
      });
    });

    if (showing < this.logs.length) {
      this.logList.pushItem({
        getContent: () => MORE_ITENS
      });
    }
  }

  show() {
    this.app.preventBack();
    this.logList.clearItems();
    this.logList.show();

    this.logs = git.log();
    this.currentPage = 0;

    this._addPage();

    this.logList.focus();
    this.fileList.clearItems();
    this.fileList.show();
  }

  hide() {
    this.app.restoreBack();
    this.logList.hide()
    this.fileList.hide()
  }
}

module.exports = History;
