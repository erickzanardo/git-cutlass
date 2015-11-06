"use strict"

var blessed = require("blessed");
var screens = require("./screens");
var git = require("./git/cli");
var statusParser = require("./git/status-parser")

class MainFiles {
  constructor(app) {
    this.app = app;
    this.items = [];

    this.hint = blessed.box({
      width: "100%",
      height: 3,
      bottom: 0,
      left: "top",
      border: {
        type: "line"
      }
    });

    this.list = blessed.list({
      top: 0,
      bottom: 3,
      left: "center",
      width: "100%",
      keys: true,
      border: {
        type: "line"
      },
      style: {
        selected: {
          bg: "blue"
        }
      }
    });

    this.actions = {
      add: false,
      checkout: false,
      reset: false,
      diff: false,
      commit: false,
      clear: () => {
        this.actions.add = false;
        this.actions.checkout = false;
        this.actions.reset = false;
        this.actions.diff = false;
        this.actions.commit = false;
      }
    };

    this.current = 0;

    this.list.key("j", () => {
      if (this.current == this.list.items.length - 1) this.current = 0;
      else this.current++;

      this.list.select(this.current);
      this.enableActions();
      this.updateHint();
      this.app.render();
    });

    this.list.key("k", () => {
      if (this.current == 0) this.current = this.list.items.length - 1;
      else this.current--;

      this.list.select(this.current);
      this.enableActions();
      this.updateHint();
      this.app.render();
    });

    this.list.key("a", () => {
      if (this.actions.add) {
        var file = this.selected().filePath();
        git.add(file);
        this.update();
        this.app.render();
      }
    });

    this.list.key("r", () => {
      if (this.actions.reset) {
        var file = this.selected().filePath();
        git.reset(file);
        this.update();
        this.app.render();
      }
    });

    this.list.key("c", () => {
      if (this.actions.checkout) {
        var file = this.selected().filePath();
        git.checkout(file);
        this.update();
        this.app.render();
      }
    });

    this.list.key("d", () => {
      if (this.actions.diff) {
        this.hide();

        this.app.open(screens.DIFF, this.selected().filePath());
      }
    });

    this.list.key("o", () => {
      if (this.actions.commit) {
        this.app.open(screens.COMMIT, true, null);
      }
    });

    this.app.container.append(this.list);
    this.app.container.append(this.hint);
  }

  show() {
    this.update();
    this.list.show();
    this.hint.show();
    this.list.focus();
  }

  hide() {
    this.list.hide();
    this.hint.hide();
  }

  selected() {
    if (this.items[this.current]) {
      return this.items[this.current].entry;
    } else {
      return null;
    }
  }

  enableActions() {
    this.actions.clear();
    var item = this.selected();
    if (!item) return;

    if (this.status.hasToCommit()) {
      this.actions.commit = true;
    }

    if (item.type == " M" || item.type == "??" || item.type == "UU") {
      this.actions.add = true;
    }

    if (item.type == " M") {
      this.actions.checkout = true;
      this.actions.diff = true;
    }
    
    if (item.type == "M " || item.type == "D " || item.type == "A " || item.type == "R ") {
      this.actions.reset = "[r]eset";
    }
  }

  updateHint() {
    var status = [];
    if (this.actions.commit) {
      status.push("c[o]mmit");
    }

    if (this.actions.diff) {
      status.push("[d]iff");
    }
    if (this.actions.add) {
      status.push("[a]dd");
    }
    if (this.actions.checkout) {
      status.push("[c]heckout");
    }
    if (this.actions.reset) {
      status.push("[r]eset"); 
    }

    if (!this.items.length) {
      status.push("No changes");
    }

    this.hint.setContent(status.join("  "));
  }

  update() {
    this.list.clearItems();
    this.items = [];
    var addToList = (entry) => {
      var item = {
        getContent: function() { return this.entry.toString(); },
        entry: entry 
      }
      this.items.push(item);
      this.list.pushItem(item, {
        fg: entry.color()
      });
    };

    var statusRaw = git.status("--porcelain");
    var status = statusParser.parse(statusRaw);

    status.toCommit.deleted.forEach((item) => addToList(item));
    status.toCommit.added.forEach((item) => addToList(item));
    status.toCommit.modified.forEach((item) => addToList(item));
    status.toCommit.renamed.forEach((item) => addToList(item));
    status.modified.forEach((item) => addToList(item));
    status.deleted.forEach((item) => addToList(item));
    status.untracked.forEach((item) => addToList(item));
    status.bothModified.forEach((item) => addToList(item));

    this.status = status;
    this.list.select(this.current);
    this.enableActions();
    this.updateHint();
  }
}

module.exports = MainFiles;
