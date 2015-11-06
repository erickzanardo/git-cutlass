"use strict"

var blessed = require("blessed");
var git = require("./git/cli");

class Commit {
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
      label: "Commit message",
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
      content: "{green-fg}[ENTER] - commit{/green-fg} - {red-fg}[ESC] - cancel{/red-fg}"
    });
    this.modal.append(this.hint);

    this.modal.hide();

    this.textbox.key("escape", () => this.app.back());
    this.textbox.key("enter", () => {
      var message = this.textbox.getValue();
      if (message) {
        git.commit(message);
        this.app.back();
      }
    });

    this.app.container.append(this.modal);
  }

  show() {
    this.modal.show();
    this.textbox.clearValue();
    this.textbox.focus();
  }

  hide() {
    this.modal.hide();
  }
}

module.exports = Commit;
