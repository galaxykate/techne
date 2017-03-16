/**
 * Super, super lightweight model for an artist.  It's just an ID, but
 * it lets us ensure unique IDs, and could be useful in future developments
 */

 var mongoose  = require('mongoose');
 var Schema    = mongoose.Schema;
 var lib        = require('../modules/commonlib');

 var ArtistSchema = new Schema({
   //schema is empty, mongoose will automagically populate an ID for us.
 });

 module.exports = lib.exportModel(mongoose, 'Artist', ArtistSchema);
