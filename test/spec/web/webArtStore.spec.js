/**
 * Unit Tests for a WebArtStore
 * TODO do a better job at building this out
 */
/*jshint esversion: 6*/
var WebArtStore = require("../../../js/modules/artstore/webArtStore");
var ArtStore = require("../../../js/modules/artstore/artStore");
var VisualWebArtist = require("../../../js/modules/artist/visualWebArtist");

describe("Web Art Store", function(){
  var artstore;
  var artist1;
  var artist2;

  beforeEach(function(){
    artstore = new WebArtStore(3);
    artist1 = new VisualWebArtist(artstore);
    artist2 = new VisualWebArtist(artstore);
  });

  it("Testing Constructor", function(){
    var tempstore = new WebArtStore(1);
    expect(tempstore.maxNumArts).toBe(1);
    expect(tempstore instanceof WebArtStore).toBe(true);
    expect(tempstore instanceof ArtStore).toBe(true);

    tempstore = new WebArtStore(0);
    expect(tempstore.arts.length).toBe(0);
    tempstore = new WebArtStore(-1);
    expect(tempstore.arts.length).toBe(0);
  });

  it("Testing Adding Published", function(done){
    console.log("A WebVisualArtist Object:", artist1);
    artist1.createArt()
      .then(() => {
        expect(artstore.arts.length).toBe(1);
        artist2.createArt()
      .then(() => {
        expect(artstore.arts.length).toBe(2);
        done();
      });
    }).catch(error => {console.error(error); fail();});
  });

  it("Testing Direct Removal of Art", function(done){
    artist1.createArt()
      .then(() => {
        artstore.forget();
        expect(artstore.arts.length).toBe(0);
        done();
      }).catch(error => {console.error(error); fail();});
  });

  it("Testing Implied Removal of Oldest Art", function(done){
    artist1.createArt()
      .then(() => {
        setTimeout(function(){
          artist1.createArt()
            .then(art => {
              expect(artstore.arts.length).toBe(2);
              artstore.forget();
              var storedArt = artstore.arts[0];
              var storedArtId = art.tags.filter(tag => tag.key == 'author');
              var artId = art.tags.filter(tag => tag.key == 'author');

              expect(artId).toEqual(storedArtId);
              done();
            });
        }, 1000);
    }).catch(error => {console.error(error); fail();});
  });
});
