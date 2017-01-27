/**
 * TODO right now, just a check to run some tests in node and not in the browser
 */

var NodeArtStore = require("../../../js/modules/artstore/nodeArtStore");
describe("Node Art Store", function(){
  var artstore;
  beforeEach(function(){
    artstore = new NodeArtStore();
  });

  it("Test", function(){
    console.log("I'm a node only test!");
    var ret = artstore.test();
    expect(ret == 'test!').toBe(true);
  });
});
