/**
 * @author Kate
 * Model of an art object (may be an image)
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ArtSchema   = new Schema({
    name: String,
    artist_id: String,
    works: Array,
    grammars: Array
    
});

module.exports = mongoose.model('Artist', ArtistSchema);