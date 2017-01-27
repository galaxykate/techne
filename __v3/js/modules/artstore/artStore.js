/**
 * Where the art gets stored!  This could be a lot of different things,
 * from a mongoDB connection to a in browser array.
 * All ArtStores should decend from this class, and this outlines the
 * basic features of an art store.
 */

//var ArtConstructor = require('../models/art');
//var Art = new ArtConstructor();
//var mongoose = require('mongoose');

/**
 * The constructor for an ArtStore.
 */
var ArtStore = function(){

};

ArtStore.prototype = {
  /**
   * Add a new art to the store
   * @param {Art} art the new art to add.
   * @return {Undefined}  May not return or return a Promise
   */
  addArt: function(art){
    throw "Called ArtStore's addArt method, should be override in a subclass";
  },

  /**
   * Removes the oldest art in the store.
   * @return {Undefined} may not return or return a Promise
   */
  forget: function(){
    throw "Called ArtStore's forget method, should be overriden in a subclass";
  }
};

module.exports = ArtStore;
