/**
 * An Art Store implemented in the browser.  Backes a commune with a Simple
 * array.
 * We use monggose to validate, even if we aren't actually connecting to a db.
 * @author Johnathan Pagnutti
 */
/*jshint esversion: 6 */
var ArtStore = require('./artStore');
//FIXME this def needs a better pattern
var ArtConstructor = require('../../models/art');
var Art = new ArtConstructor().schema;

var mongoose = require('mongoose');
var commonlib = require('../commonlib');

/**
 * An artstore on the web!  Backs with a simple array.
 * @param {Number} maxArts the maximum number of arts this store can hold onto
 */
var WebArtStore = function(maxArts){
  //call the parent constructor
  ArtStore.apply(this);

  //@TODO think about this a little more
  //creating a DOM EventTarget object (lightest weight one I can find)
  var target = document.createTextNode(null);

  //bind standard listener functions to the target
  this.addEventListener = target.addEventListener.bind(target);
  this.removeEventListener = target.removeEventListener.bind(target);
  this.dispatchEvent = target.dispatchEvent.bind(target);
  //END thinking @TODO

  this.maxNumArts = maxArts >= 0 ? maxArts : 0;
  this.arts = [];
};

WebArtStore.prototype = commonlib.inherit(ArtStore.prototype);

/**
 * Add a new art to the WebArtStore
 * @param   {Art}     art   the art to add to the WebStore
 * @return  {Promise}     a promise that the art will be added to the art store
 */
WebArtStore.prototype.addArt = function(art){
  //first things first, do validation using isomorphic mongoose
  //var validationDoc = new mongoose.Document(art, Art);
  //console.log(art instanceof mongoose.Document);
  return new Promise((resolve, reject) => {
    var error = art.validateSync(); //FIXME move to async validation
    if(error){
      commonlib.reportMongooseError(error);
      reject(error);
    }else{
      this.openSpace();
      this.arts.push(art);

      //If we decide to NOT use DOM event wrapping, we also need to change these lines
      var evt = document.createEvent("Event");
      evt.initEvent("New Art", true, true);
      this.dispatchEvent(evt);
      resolve(art);
    }
  });
};

/**
 * Remove the oldest art from the WebStore
 * @return {Undefined} This function does not return, just modifies stuff
 */
WebArtStore.prototype.forget = function(){
  //search the art store for the oldest art and splice it
  var oldestIndex = this.findOldest();
  this.arts.splice(oldestIndex, 1);
};

/**
 * Open a space in the ArtStore.  If space exists, don't worry about it.
 * If the store is full, forget an art.
 * @return {Undefined} Function just modifies state
 */
WebArtStore.prototype.openSpace = function(){
  if(this.arts.length >= this.maxNumArts){
    this.forget();
  }
};

/**
 * Get the oldest art.  Return it's index.
 * @return {Number} the index in the backing array where this art is stored
 */
WebArtStore.prototype.findOldest = function(){
  var oldestIdx = 0;
  var oldestTime = new Date(this.arts[0].tags.filter(tag => tag.key == 'timestamp')[0].value);
  //FIXME this needs to be broken into more unit testable functions
  for(let i = 0; i < this.arts.length; i++){
    if(i == oldestIdx){
      continue;
    }
    var curTimestamp = new Date(this.arts[i].tags.filter(tag => tag.key == 'timestamp')[0].value);

    if(curTimestamp < oldestTime){
      oldestIdx = i;
      oldestTime = curTimestamp;
    }
  }

  return oldestIdx;
};

/**
 * Return a generator that yeilds EVERY art in this Art Store
 * @param {Function}  filter  function to pass to Array.filter() to return a generator
 *                            only over the arts that we want to look at
 * @return {Generator} generator that gets every art in this artstore
 */
WebArtStore.prototype.getArt = function*(filter){
  var consideredArts = this.arts;
  if(filter){
    consideredArts = this.arts.filter(filter);
  }

  for(let art of consideredArts){
    yield art;
  }
};
/**
 * Get a string of a WebArtStore!  Returns the string rep of the array of arts
 * (May backfire when I want to look at WebArtStore properties, but neat for now)
 * @return {String} String representation of all the arts in the web art store
 */
WebArtStore.prototype.toString = function(){
  return this.arts.toString();
};

module.exports = WebArtStore;
