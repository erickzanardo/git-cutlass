"use strict"

var blessed = require("blessed");
var git = require("./git/cli");

class Delete {
  constructor(app) {
    this.app = app;

    this.modal = blessed.box({
      height: 6,
      width: 75,
      left: "center",
      top: "center",
      border: {
        type: "line"
      }
    });

    this.textbox = blessed.textbox({
      height: 3,
      top: 0,
      inputOnFocus: true,
      border: {
        type: "line"
      }
    });
    this.modal.append(this.textbox);

    this.hint = blessed.box({
      height: 1,
      bottom: 0,
      left: "top",
      tags: true,
      content: "{red-fg}Confirm deletion?{/red-fg} Type y to confirm"
    });
    this.modal.append(this.hint);

    this.modal.hide();

    this.textbox.key("escape", () => this.app.back());
    this.textbox.key("enter", () => {
      var v = this.textbox.getValue();
      if (v == "y") {
        git.removeFile(this.filePath);
      }
      this.app.back();
    });

    this.app.container.append(this.modal);
  }

  show(file) {
    this.filePath = file;
    this.modal.show();
    this.textbox.setValue("");
    this.textbox.focus();
  }

  hide() {
    this.modal.hide();
  }
}

module.exports = Delete;

