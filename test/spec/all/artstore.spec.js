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
    expect(artstore instanceof ArtStore).toBe(true);
    expect(typeof artstore.addArt !== undefined).toBe(true);
    expect(typeof artstore.forget !== undefined).toBe(true);

    //TODO: add checks to throw the right errors here
  });
});
