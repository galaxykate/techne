/**
 * Expose all the modules that we plan on testing to the global scope
 * FIXME: find some way to split this into seperate files, rather than one giant test spec
 */
/*jshint esversion: 6 */
/*jslint node: true */
var Artist = require("../../../js/modules/artist/artist");
var Tag = require("../../../js/models/tag");

describe("Artist", function(){
  var artist;

  beforeEach(function(){
    artist = new Artist();
  });

  it("Constructor", function(){
    expect(artist instanceof Artist).toBe(true);
    expect(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/.test(artist.id)).toBe(true);
    expect(artist.generators === undefined).toBe(true);
    expect(artist.evaluators === undefined).toBe(true);
  });

  it("Unimplemented Methods", function(){
    expect(() => artist.createArt()).toThrow("This function should be overriden by a subclass!");
    expect(() => artist.evaluateArt()).toThrow("This function should be overriden by a subclass!");
    expect(() => artist.publishArt()).toThrow("This function should be overriden by a subclass!");
  });

  it("Create Author Tag", function(){
    var tag = artist.createAuthorTag();
    expect(tag instanceof Tag);
    expect(tag.key == 'author').toBe(true);
    expect(tag.value == artist.id).toBe(true);
  });

  it("Create Timestamp Tag", function(){
    var tag = artist.createTimestampTag();
    expect(tag instanceof Tag).toBe(true);
    expect(tag.key == 'timestamp').toBe(true);

    var tagTime = new Date(parseInt(tag.value, 10));
    expect(tagTime.getTime()).toBeGreaterThan(0);
    expect(tagTime.getTime()).not.toBeGreaterThan(Date.now());
   });

   it("Sign Art", function(){
    var taglist = artist.signArt();
    //check for the exsistance of the correct keys
    var authorTag = taglist.filter(item => item.key == 'author');
    var timestampTag = taglist.filter(item => item.key == 'timestamp');

    expect(taglist.length).toEqual(2);

    expect(authorTag).toBeTruthy();
    expect(timestampTag).toBeTruthy(true);
  });
});
