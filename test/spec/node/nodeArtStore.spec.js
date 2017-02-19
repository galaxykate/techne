/**
 * TODO right now, just a check to run some tests in node and not in the browser
 * This is probably doable via mocking artists, but I'd need to investigate how
 * to do that.

 * I'd also need to investigate how to test a server process.
 */

//var NodeArtStore = require("../../../js/modules/artstore/nodeArtStore");
describe("Node Art Store", function(){
  beforeEach(function(){
    console.log("Did you remember to fire up the node server?");
    console.log("Did you remember to drop all prior art from the Mongo DB?");
    //artstore = new NodeArtStore();
  });

  xit("Test", function(){
    //var ret = artstore.test();
    //expect(ret == 'test!').toBe(true);
  });
});
