"use strict"

var blessed = require("blessed");
var git = require("./git/cli");
var statusParser = require("./git/status-parser")

class MainFiles {
  constructor(screen) {
    this.screen = screen;
    this.items = [];
    this.container = blessed.box({
      height: "100%",
      width: "100%"
    });

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
      clear: () => {
        this.actions.add = false;
        this.actions.checkout = false;
        this.actions.reset = false;
      }
    };

    this.current = 0;

    this.list.key("j", () => {
      if (this.current == this.list.items.length - 1) this.current = 0;
      else this.current++;

      this.list.select(this.current);
      this.enableActions();
      this.updateHint();
      this.screen.render();
    });

    this.list.key("k", () => {
      if (this.current == 0) this.current = this.list.items.length - 1;
      else this.current--;

      this.list.select(this.current);
      this.enableActions();
      this.updateHint();
      this.screen.render();
    });

    this.list.key("a", () => {
      if (this.actions.add) {
        var file = this.selected().filePath();
        git.add(file);
        this.update();
        this.screen.render();
      }
    });

    this.list.key("r", () => {
      if (this.actions.reset) {
        var file = this.selected().filePath();
        git.reset(file);
        this.update();
        this.screen.render();
      }
    });

    this.list.key("c", () => {
      if (this.actions.checkout) {
        var file = this.selected().filePath();
        git.checkout(file);
        this.update();
        this.screen.render();
      }
    });
  }

  selected() {
    return this.items[this.current].entry;
  }

  enableActions() {
    this.actions.clear();
    var item = this.selected();

    if (item.type == " M" || item.type == "??") {
      this.actions.add = true;
    }

    if (item.type == " M") {
      this.actions.checkout = true;
    }
    
    if (item.type == "M " || item.type == "D " || item.type == "A " || item.type == "R ") {
      this.actions.reset = "[r]eset";
    }
  }

  updateHint() {
    var status = [];
    if (this.actions.add) {
      status.push("[a]dd");
    }
    if (this.actions.checkout) {
      status.push("[c]heckout");
    }
    if (this.actions.reset) {
      status.push("[r]eset"); 
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

    this.list.select(this.current);
    this.container.append(this.list);
    this.container.append(this.hint);
    this.screen.append(this.container);
    this.enableActions();
    this.updateHint();
  }
}

module.exports = MainFiles;
