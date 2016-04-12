"use strict"

var git = require("./git/cli");
var blessed = require("blessed");
var path = require("path");

class EditFiles {
  constructor(app) {
    this.app = app;
    this.editor = process.env.EDITOR || "vim";

    this.container = blessed.box({
      width: "100%",
      height: "100%",
      top: 0,
      left: "top",
      parent: app.container
    });

    this.terminal = blessed.terminal({
      parent: this.container,
      top: 0,
      bottom: 0,
      left: "center",
      width: "100%",
      boder: {
        type: "line"
      }
    });
    this.hide();
    this.terminal.pty.on("data", (data) => {
      var done = data.indexOf("DONE") != -1;
      var editor = data.indexOf(this.editor + " ") != -1;
      if (done && !editor) {
        this.app.back();
      }
    });
  }

  show(filePath) {
    this.terminal.pty.write(this.editor + " " + path.join(git.basedir(), filePath) + " && echo \"DONE\"\n"); 
    this.app.preventBack();
    this.container.show();
    this.terminal.focus();
  }

  hide() {
    this.container.hide();
    this.app.restoreBack();
  }
}

module.exports = EditFiles;
