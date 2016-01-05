"use strict"

var blessed = require("blessed");
var screens = require("./screens");
var git = require("./git/cli");

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

    this.logList.on("select", (item, i) => {
      this.fileList.clearItems();
      var files = git.listFilesFromSha(this.logs[i].sha);
      files.forEach((file) => this.fileList.addItem(file));
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
    this.app.container.append(this.fileList);
  }

  show() {
    this.logList.clearItems();
    this.logList.show();

    this.logs = git.log();
    this.logs.forEach((log) => {
      this.logList.pushItem({
        log: log,
        getContent: () => [log.sha, log.date, log.message].join(" - ")
      });
    });

    this.logList.focus();
    this.fileList.clearItems();
    this.fileList.show();
  }

  hide() {
    this.logList.hide()
    this.fileList.hide()
  }
}

module.exports = History;
