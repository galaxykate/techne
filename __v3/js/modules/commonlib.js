/**
 * A set of functions that is shared amongst a lot of code.
 * Most of this is non-neat code to do things like environment checking.
 * @author Johnathan Pagnutti
 */
/*jshint esversion: 6 */
/*jslint node: true */

"use strict";
var mongooseEnvEnum = {
  ISOMORPHIC: "This is an isomorphic environment",
  NODE:       "This is a node environment"
};

var lib = {


  //===========================================================================
  //MONGOOSE MULTIPLE ENVIRONMENT HELPER FUNCTIONS
  //===========================================================================
  /**
   * Given a mongoose object, figure out if it's the isomorphic version
   * or the node version
   * @param  {Object} mongooseObj the mongoose object we can get from the browser
   * @return {String}             message string that is labeled for which variant we have
   */
  testMongooseEnvironment: function(mongooseObj){
    if(mongooseObj.model){
      return mongooseEnvEnum.NODE;
    }else{
      return mongooseEnvEnum.ISOMORPHIC;
    }
  },

  /**
   * Export a model-like object based on which version of Mongoose we're using.
   * The wrapper for the Isomorphic case is an anonimous costructor that wraps
   * creating documents from schemas (which is the reason why we'd use models
   * in the first place.)
   * @param  {object} mongooseObj      the mongoose object we have access to
   * @param  {String} dbCollectionName in the non-isomorphic case, we need to list which Mongo collection this is affiliated with
   * @param  {object} schema           the schema to create a document from
   * @return {object}                  either a model, or a wrapper around isomorphic document creation
   */
  exportModel: function(mongooseObj, dbCollectionName, schema){
    var env = lib.testMongooseEnvironment(mongooseObj);
    if(env == mongooseEnvEnum.ISOMORPHIC){
      var wrapper = function(initialConfig){
        mongooseObj.Document.apply(this, [initialConfig, schema]);
      };
      wrapper.prototype = this.inherit(mongooseObj.Document.prototype);
      return wrapper;
    }else if (env == mongooseEnvEnum.NODE){
        return mongooseObj.model(dbCollectionName, schema);
    }else{
      console.log("Unable to calculate environment!");
      mongooseObj.exports = undefined;
    }
  },

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

module.exports = lib;
