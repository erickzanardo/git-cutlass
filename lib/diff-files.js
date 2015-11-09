"use strict"

var blessed = require("blessed");
var git = require("./git/cli");

var diffLines = (diffStr) => {
  var lines = [];
  var linesStr = diffStr.split("\n");

  linesStr.forEach((line) => {
    var style = {};
    // XXX
    var line2 = null;
    if (line.startsWith("+")) {
      style.fg = "green";
    } else if (line.startsWith("-")) {
      style.fg = "red";
    } else if (line.startsWith("@@")) {
      style.fg = "blue";
      if (!line.endsWith("@@")) {
        line2 = line.substring(line.lastIndexOf(" @@") + 3, line.length);
        line = line.substring(0, line.lastIndexOf(" @@") + 3);
      }
    }

    lines.push({ s: line, style: style });
    if (line2) {
      lines.push({ s: line2, style: {} });
    }
  });

  return lines;
};

class DiffFiles {
  constructor(app) {
    this.app = app;

    this.list = blessed.list({
      top: 0,
      bottom: 0,
      left: "center",
      width: "100%",
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
    this.app.container.append(this.list);
    this.list.hide();
  }

  show(filePath) {
    this.list.clearItems();
    var diffStr = git.diff(filePath);
    // TODO this is a simple and temporary solution
    var lines = diffLines(diffStr);
    lines.forEach((line) => this.list.pushItem(line.s, line.style)); 
    this.list.show();
    this.list.select(0);
    this.list.focus();

    this.app.render();
  }

  hide() {
    this.list.hide();
  }
}

module.exports = DiffFiles;
