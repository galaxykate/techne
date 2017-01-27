/**
 * Unit Tests for a WebArtStore
 * TODO do a better job at building this out
 */

var WebArtStore = require("../../../js/modules/artstore/webArtStore");
var ArtStore = require("../../../js/modules/artstore/artStore");

describe("Web Art Store", function(){
  var artstore;
  beforeEach(function(){
    artstore = new WebArtStore(25);
  });

  it("Testing Constructor", function(){
    console.log("I'm a browser only test!");
    expect(artstore instanceof ArtStore).toBe(true);
  });
});
