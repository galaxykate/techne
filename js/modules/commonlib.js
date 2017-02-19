/**
 * A set of functions that is shared amongst a lot of code.
 * Most of this is non-neat code to do things like environment checking.
 * @author Johnathan Pagnutti
 */
/*jshint esversion: 6 */
/*jslint node: true */

"use strict";

//we mixin different code depending on if this is for a browser or not.  SO!
var envSpecific;
if(!process.env.BROWSER){
  //node context
  envSpecific = require('./nodelib');
} else {
  envSpecific = require('./browserlib');
}

var lib = {
  //===========================================================================
  //MONGOOSE MULTIPLE ENVIRONMENT HELPER FUNCTIONS
  //===========================================================================
  /**
   * Unpacks a mongoose error and logs it to the console
   * @param  {Object} error Mongoose error Object
   * @return {None}       just logs, does not return
   */
  reportMongooseError: function(error){
    console.log(error.errors);
    console.log(error.name);
    for(let errPart in error.errors){
      if(error.errors.hasOwnProperty(errPart)){
        console.log(errPart);
        console.error(error.errors[errPart].message);
      }
    }
  },
    //===========================================================================
    //GENERIC JAVASCRIPT HELPER FUNCTIONS
    //===========================================================================
  /**
   * create OOP-styled inheritance in JavaScript.
   * @param  {object}   proto   the prototype chain to inherit from
   * @return {function}         a constructor that inherits from the provided prototype chain
   */
  inherit: function(proto){
    function F() {}
    F.prototype = proto;
    return new F();
  },

  //============================================================================
  //COLOR HELPERS
  //============================================================================
  // https://gmigdos.wordpress.com/2011/01/13/javascript-convert-rgb-values-to-hsl/
  // pulled from common in Techne v2.
  rgb2hsl: function(rgbArr){
    var r1 = rgbArr[0] / 255;
    var g1 = rgbArr[1] / 255;
    var b1 = rgbArr[2] / 255;

    var maxColor = Math.max(r1,g1,b1);
    var minColor = Math.min(r1,g1,b1);
    //Calculate L:
    var L = (maxColor + minColor) / 2 ;
    var S = 0;
    var H = 0;
    if(maxColor != minColor){
        //Calculate S:
        if(L < 0.5){
            S = (maxColor - minColor) / (maxColor + minColor);
        }else{
            S = (maxColor - minColor) / (2.0 - maxColor - minColor);
        }
        //Calculate H:
        if(r1 == maxColor){
            H = (g1-b1) / (maxColor - minColor);
        }else if(g1 == maxColor){
            H = 2.0 + (b1 - r1) / (maxColor - minColor);
        }else{
            H = 4.0 + (r1 - g1) / (maxColor - minColor);
        }
    }

    L = L * 100;
    S = S * 100;
    H = H * 60;
    if(H<0){
        H += 360;
    }
    var result = [H, S, L];
    return result;
  }
};


//mixin the content specific library
//(defining a mixin function here because jquery is not garanteed to be accessable in a particular context)
function extend(destination, source) {
  for (var k in source) {
    if (source.hasOwnProperty(k)) {
      destination[k] = source[k];
    }
  }
  return destination;
}

//and then lets apply that function
module.exports = extend(lib, envSpecific);
