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
