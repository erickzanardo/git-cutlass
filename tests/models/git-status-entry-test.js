"use strict"

var chai = require("chai");
var expect = chai.expect;

var GitStatusEntry = require("../../lib/models/git-status-entry");

describe("GitStatusEntry", () => {
  describe("#constructor", () => {
    var gitStatusEntry = new GitStatusEntry(" M", "/bar/bla.txt");
    it("type and file should be assigned", () => {
      expect(gitStatusEntry.type).to.equals(" M");
      expect(gitStatusEntry.file).to.equals("/bar/bla.txt");
    });
  });

  describe("#toString", () => {
    var gitStatusEntry = new GitStatusEntry(" M", "bla.txt");
    it("returns it's type and file", () => expect(gitStatusEntry.toString()).to.equals(" M - bla.txt"));
  });

  describe("#filePath", () => {
    var gitStatusEntry = new GitStatusEntry(" M", "/bar/bla.txt");
    it("returns the correctly filePath", () => expect(gitStatusEntry.filePath()).to.equals("/bar/bla.txt"));

    context("when the file is a renamed file", () => {
      var gitStatusEntry = new GitStatusEntry("R ", "b.txt -> a.txt");
      it("returns only the new file path", () => expect(gitStatusEntry.filePath()).to.equals("a.txt"));
    });
  });

  describe("#color", () => {
    context("when it's a deleted file", () => {
      var gitStatusEntry = new GitStatusEntry("D ", "/bar/bla.txt");
      it("returns green", () => expect(gitStatusEntry.color()).to.equals("green"));
    });
    context("when it's a added file", () => {
      var gitStatusEntry = new GitStatusEntry("A ", "/bar/bla.txt");
      it("returns green", () => expect(gitStatusEntry.color()).to.equals("green"));
    });
    context("when it's a modified file", () => {
      var gitStatusEntry = new GitStatusEntry("M ", "/bar/bla.txt");
      it("returns green", () => expect(gitStatusEntry.color()).to.equals("green"));
    });
    context("when it's a renamed file", () => {
      var gitStatusEntry = new GitStatusEntry("R ", "/bar/bla.txt");
      it("returns green", () => expect(gitStatusEntry.color()).to.equals("green"));
    });
    context("when it's an unstaged modifed file", () => {
      var gitStatusEntry = new GitStatusEntry(" M", "/bar/bla.txt");
      it("returns red", () => expect(gitStatusEntry.color()).to.equals("red"));
    });
    context("when it's an unstaged deleted file", () => {
      var gitStatusEntry = new GitStatusEntry(" D", "/bar/bla.txt");
      it("returns red", () => expect(gitStatusEntry.color()).to.equals("red"));
    });
    context("when it's an unstaged new file", () => {
      var gitStatusEntry = new GitStatusEntry("??", "/bar/bla.txt");
      it("returns red", () => expect(gitStatusEntry.color()).to.equals("red"));
    });
    context("when it's a both modified new file", () => {
      var gitStatusEntry = new GitStatusEntry("UU", "/bar/bla.txt");
      it("returns red", () => expect(gitStatusEntry.color()).to.equals("red"));
    });
  });
});
