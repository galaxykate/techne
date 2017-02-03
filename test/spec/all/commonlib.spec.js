/**
 * Test suite for all the common functions in commonlib.
 * TODO: seperate tests for testMongooseEnvironment()
 */
/*jshint esversion:6*/

var commonlib = require("../../../js/modules/commonlib");
//FIXME instead of using an exsisting schema, maybe define one for testing?
var Art =       require("../../../js/models/art");
var Tag =       require("../../../js/models/tag");
var mongoose =  require('mongoose');

describe("Generic commonlib functionality", function(){
  var art;
  var tag;

  it("inherit", function(){
    //FIXME this set of tests for inherit isn't even close to being complete
    //FIXME but I think this is a pretty standard JS pattern.
    var Test = function(){
      String.apply(this);
    };
    Test.prototype = commonlib.inherit(String);
    Test.prototype.foo = function(){
      return 'bar';
    };

    var testObj = new Test();
    expect(typeof testObj.foo !== undefined).toBe(true);
    expect(typeof testObj.length !== undefined).toBe(true);
    expect(testObj.foo() == 'bar').toBe(true);
  });

  it("Art Model Exporting", function(){
    art = new Art();
    art.art = "ART!"; //TODO mongoose won't save any info on Mixed types,
                      //unless we actually set something and mark it
    art.markModified('art');
    expect(art instanceof mongoose.Document).toBe(true);
    expect(art.art).toBeTruthy();
    expect(art.tags).toBeTruthy();
  });

  it("Tag Model Exporting", function(){
    tag = new Tag();
    expect(tag instanceof mongoose.Document).toBe(true);
    expect(typeof tag.key !== undefined).toBe(true);
    expect(typeof tag.value !== undefined).toBe(true);
    tag.key = "foo";
    tag.value = "bar";

    expect(tag.key).toEqual("foo");
    expect(tag.value).toEqual("bar");
  });

  it("SVG Render Accuracy", function(done){
    //Checking accuracy with a simple svg string
    var svg = '<svg width="90" height="120" xmlns="http://www.w3.org/2000/svg" version="1.1"><rect x="0" y="0" width="90" height="120" fill="rgb(255,0,0)"/></svg>';
    commonlib.renderSVG(svg, 90, 120).then(pixels => {
      expect(pixels instanceof Uint8ClampedArray).toBe(true);

      for(let i = 0; i < pixels.length; i += 4){
        expect(pixels[i]).toEqual(255);
      }

      done();
    });
  });
});
