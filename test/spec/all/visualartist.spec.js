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
      expect(art.art instanceof Uint8ClampedArray).toBe(true); //TODO stronger tests here

      var widthTag = art.tags.filter(tag => tag.key == 'width')[0];
      var heightTag = art.tags.filter(tag => tag.key == 'height')[0];
      var typeTag = art.tags.filter(tag => tag.key == 'type')[0];
      var svgTag = art.tags.filter(tag => tag.key == 'svg')[0];

      expect(widthTag.value).toBe("90");
      expect(heightTag.value).toBe("120");
      expect(typeTag.value).toBe("picture");
      expect(svgTag).toBeTruthy();
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
