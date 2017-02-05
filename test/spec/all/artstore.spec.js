/**
 * Test suite for the generic artstore object
 */
/*jshint esversion: 6*/

var ArtStore = require("../../../js/modules/artstore/artStore");

describe("ArtStore", function(){
  var artstore;

  beforeEach(function(){
    artstore = new ArtStore();
  });

  it("Test Constructor", function(){
    expect(artstore instanceof ArtStore).toBe(true);
    expect(typeof artstore.addArt !== undefined).toBe(true);
    expect(typeof artstore.forget !== undefined).toBe(true);
    expect(typeof artstore.getArt !== undefined).toBe(true);

    expect(() => artstore.addArt()).toThrow("Called ArtStore's addArt method, should be override in a subclass");
    expect(() => artstore.forget()).toThrow("Called ArtStore's forget method, should be overriden in a subclass");
    expect(() => artstore.getArt()).toThrow("Called ArtStore's getArt method, should be overriden in a subclass");

  });
});
