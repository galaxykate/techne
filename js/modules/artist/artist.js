/**
 * Generic Artist that all bots inherit from.  Subclasses should override
 * the createArt and evaluateArt methods for their own ways to do that sort
 * of thing.
 * @author Johnathan Pagnutti
 */
var Tag = require('../../models/tag');
var uuid = require('node-uuid');

/**
 * Artist constructor.  Artists have a name and an ID, the ID uses a
 * GUID scheme from the techne-common library.
 *
 * Generators and evaluators are intentionally left undefined, as subclasses
 * should add them.
 */
var Artist = function(){
  this.name = ""; //reserved some space here for fun bots names, but they aren't critical to Techne
  this.id = uuid.v4();

  this.generators = undefined;
  this.evaluators = undefined;
};

Artist.prototype = {
  /**
   * Create a new art!  This function should be overriden in objects that
   * inherit from this class.
   * @return {Art} The New Art
   */
  createArt: function(){
    throw "This function should be overriden by a subclass!";
  },

  /**
   * Evaluate an art!  This function should be overriden in objects that
   * inherit from this class.
   * @return {Art} The New Crit
   */
  evaluateArt: function(){
    throw "This function should be overriden by a subclass!";
  },

  /**
   * Try to send the provided art to an art store this artist knows about
   * Note: this function does not require the bot to specify which art store
   * to publish to, but that can be overriden by a subclass
   * @param  {ArtStore} artstore  the artstore to publish art too
   * @param  {Art}      art       an art object
   * @return {Promise}            a promise to send the art along to an art store
   */
  publishArt: function(artstore, art){
    throw "This function should be overriden by a subclass!";
  },

  /**
   * Request art from an artstore.  Optionally provide a filtering function to
   * only get certain art from certain locations.
   * Filter functions work on tags.
   * @param  {Object}   artstore  An ArtStore to request art from.
   * @param  {Function} filter    A function to filter art by, based on how an art has been tagged
   * @return {Promise}            A promise for art that fits the filter, if any exsists
   */
  requestArt: function(artstore, filter){
    throw "This function should be overriden by a subclass!";
  },

  /**
   * Create an author tag.  An author tag is a Tag with a key of 'author'
   * and a value of this artist's id.
   * @return {Tag} a tag with rhe relevant values
   */
  createAuthorTag: function(){
    return "author:" + this.id;
  },

  /**
   * Sign an art with a the ID of this author and a timestamp when the art
   * was created.
   * @return {Array} An Array of Tags, with the id and the timestamp for when
   * this art was created.
   */
  signArt: function(){
    return [this.createAuthorTag()];
  }
};

module.exports = Artist;
