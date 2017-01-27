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

//TODO currently shifted some useful util functions for valid arts as
//TODO private methods.
//TODO finish moving this all the way to commonlib
function extractTimestamp(art){
  var timestamp;
  for(let i = 0; i < art.tags.length; i++){
    if(timestamp){
      break;
    }
    if(art.tags[i].key == "timestamp"){
      timestamp = art.tags[i];
    }
  }

  return timestamp;
}


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

  this.maxNumArts = maxArts;
  this.arts = [];
};

WebArtStore.prototype = commonlib.inherit(ArtStore.prototype);

/**
 * Add a new art to the WebArtStore
 * @param   {Art}     art   the art to add to the WebStore
 * @return  {Undefined}     does not return, just modifies the store
 */
WebArtStore.prototype.addArt = function(art){
  //first things first, do validation using isomorphic mongoose
  //var validationDoc = new mongoose.Document(art, Art);
  //console.log(art instanceof mongoose.Document);
  var error = art.validateSync(); //FIXME using sychronous validation rather than async, because async isn't working for some reason.
  if(error){
    commonlib.reportMongooseError(error);
    return;
  }else{
    this.openSpace();
    this.arts.push(art);

    //If we decide to NOT use DOM event wrapping, we also need to change these lines
    var evt = document.createEvent("Event");
    evt.initEvent("New Art", true, true);
    this.dispatchEvent(evt);
  }
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
  var oldestTime = new Date(extractTimestamp(this.arts[0]).value);
  //FIXME this needs to be broken into more unit testable functions
  for(let i = 0; i < this.arts.length; i++){
    if(i == oldestIdx){
      continue;
    }
    var curTimestamp = new Date(extractTimestamp(this.arts[i]).value);

    if(curTimestamp < oldestTime){
      oldestIdx = i;
      oldestTime = curTimestamp;
    }
  }

  return oldestIdx;
};

WebArtStore.prototype.getArt = function*(){
  for(let art of this.arts){
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
