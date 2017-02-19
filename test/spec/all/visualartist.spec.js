/**
 * Tests for the VisualArtist
 */
/*jshint esversion:6*/
var VisualArtist = require("../../../js/modules/artist/visualArtist");
var Artist = require("../../../js/modules/artist/artist");
var VisualArtGrammar = require("../../../js/modules/artist/visualArtGrammar");

describe("VisualArtist", function(){
  var visualArtist;

  beforeEach(function(){
    visualArtist = new VisualArtist();
  });

  it("Constructor", function(){
    expect(visualArtist instanceof VisualArtist).toBe(true);
    expect(visualArtist instanceof Artist).toBe(true);

    expect(visualArtist.generators.length).toBe(1);
    expect(visualArtist.generators[0] instanceof VisualArtGrammar);
  });

  it("Create Art", function(done){
    visualArtist.createArt().then((art) => {
      expect(art.art instanceof Object).toBe(true); //TODO can't pass around a Uint8ClampedArray, because dumb.
      expect(art.art.pixels).toBeTruthy();
      expect(art.art.pixels instanceof Array);
      expect(art.art.width).toBe(90 + "");
      expect(art.art.height).toBe(120 + "");
      expect(art.art.svg).toBeTruthy();

      var authorTag = art.tags.filter(tag => tag.includes("author"))[0];
      var mediumTag = art.tags.filter(tag => tag.includes("medium"))[0];
      expect(authorTag).toBeTruthy();
      expect(mediumTag).toBeTruthy();

      done();
    });
  });

  it("Select Generator", function(){
    //just checking that selectGenerator returns _something_
    //and that the something has a generate function
    var generator = visualArtist.selectGenerator();
    expect(generator).toBeTruthy();
    expect(generator.generate).toBeTruthy();
    expect(generator.generate instanceof Function).toBe(true);
  });
});
