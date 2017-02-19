/**
 * Unit tests for a Web Artist
 */
/*jshint esversion: 6*/

var WebArtist = require("../../../js/modules/artist/webArtist");
var WebArtStore = require("../../../js/modules/artstore/webArtStore");

describe("Web Artist Testing", function(){
  var webArtist;
  var artStore;

  it("Test Constructor (no arguments)", function(){
    webArtist = new WebArtist();
    expect(typeof webArtist.artStore !== undefined).toBe(true);
    expect(typeof webArtist.publishArt !== undefined).toBe(true);
    expect(typeof webArtist.setPublishLocation !== undefined).toBe(true);
    expect(typeof webArtist.createArt !== undefined).toBe(true);
    expect(typeof webArtist.evaluateArt !== undefined).toBe(true);

    expect(webArtist.artStore).toEqual(undefined);
    expect(() => webArtist.createArt()).toThrow("This function should be overriden by a subclass!");
    expect(() => webArtist.evaluateArt()).toThrow("This function should be overriden by a subclass!");
  });

  it("Test Constructor (provided webstore)", function(){
    artStore = new WebArtStore(5);
    webArtist = new WebArtist(artStore);
    //FIXME retest stuff from the other version
    expect(webArtist.artStore).toBe(artStore);
  });

  it("Test Set Publish Location", function(){
    webArtist = new WebArtist();
    artStore = new WebArtStore(5);

    webArtist.setPublishLocation(artStore);
    expect(webArtist.artStore instanceof WebArtStore).toBe(true);
    expect(webArtist.artStore).toEqual(artStore);
  });

  it("Test Publish Art (throwing errors)", function(done){
    webArtist = new WebArtist();
    webArtist.publishArt(undefined).catch(err => {
      expect(err).toBe("No Provided ArtStore!");
      done();
    });
  });

  xit("Test Publish Art");
});
