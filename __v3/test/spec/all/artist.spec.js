/**
 * Expose all the modules that we plan on testing to the global scope
 * FIXME: find some way to split this into seperate files, rather than one giant test spec
 */
 var Artist = require("../../../js/modules/artist/artist");

 describe("Artist", function(){
   var artist;

   beforeEach(function(){
     artist = new Artist();
   });

   it("Test constructor", function(){
     console.log("I'm a test that's getting run!");
     expect(artist instanceof Artist).toBe(true);
     expect(artist.id !== undefined).toBe(true);
     expect(artist.generators === undefined).toBe(true);
     expect(artist.evaluators === undefined).toBe(true);
   });
 });
