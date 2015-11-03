"use strict"

var blessed = require("blessed");
var statusParser = require("./status-parser")
var Git = require("git-shizzle");

class MainFiles {
  constructor(screen) {
    this.screen = screen;
    this.list = blessed.list({
      top: "top",
      left: "center",
      width: "100%",
      height: "100%",
      keys: true,
      vi: true,
      border: {
        type: "line"
      },
      style: {
        selected: {
          bg: "blue"
        }
      }
    });
  }

  update() {
    this.list.clearItems();
    var addToList = (file, type, color) => {
      this.list.pushItem({
        getContent: () => [type, file].join(" - ")
      }, {
        fg: color
      });
    };

    var statusRaw = Git().status("--porcelain");
    var status = statusParser.parse(statusRaw);

    status.toCommit.deleted.forEach((item) => addToList(item, "DD", "green"));
    status.toCommit.added.forEach((item) => addToList(item, "AA", "green"));
    status.toCommit.modified.forEach((item) => addToList(item, "MM", "green"));
    status.modified.forEach((item) => addToList(item, "M ", "red"));
    status.deleted.forEach((item) => addToList(item, "D ", "red"));
    status.untracked.forEach((item) => addToList(item, "? ", "red"));

    this.screen.append(this.list);
  }
}

module.exports = MainFiles;
