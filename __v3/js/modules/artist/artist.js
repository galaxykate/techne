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
  this.name = "";
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
   * Sign an art with a the ID of this author and a timestamp when the art
   * was created.
   * @return {Array} An Array of Tags, with the id and the timestamp for when
   * this art was created.
   */
  signArt: function(){
    var authorTag = new Tag();
    authorTag.key = "author";
    authorTag.value = this.id; //Artists sign with their GUID, rather than name.

    var timestampTag = new Tag();
    timestampTag.key = "timestamp";
    timestampTag.value = String(Date.now());
    return [authorTag, timestampTag];
  }
};

module.exports = Artist;
