/**
 * Expose all the modules that we plan on testing to the global scope
 * FIXME: find some way to split this into seperate files, rather than one giant test spec
 */
/*jshint esversion: 6 */
/*jslint node: true */
var Artist = require("../../../js/modules/artist/artist");

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
    console.log("Tag: ", tag);
    expect(tag instanceof String);
    expect(tag.includes("author")).toBe(true);
    //TODO: test the things wi  th a UUID
  });

   it("Sign Art", function(){
     //TODO need WAY better testing here.
    var taglist = artist.signArt();
    //check for the exsistance of the correct keys
    var authorTag = taglist.filter(item => item.includes('author'));

    expect(taglist.length).toEqual(1);

    expect(authorTag).toBeTruthy();
  });
});
