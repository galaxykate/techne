/**
 * Test suite for the generic artstore object
 */

var ArtStore = require("../../../js/modules/artstore/artStore");

describe("ArtStore", function(){
  var artstore;

  beforeEach(function(){
    artstore = new ArtStore();
  });

  it("Test constructor", function(){
    console.log("I'm a different test that's getting run!");
    expect(artstore instanceof ArtStore).toBe(true);
  });
});
