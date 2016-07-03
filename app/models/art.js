/**
 * @author Kate
 * Model of an art object (may be an image)
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ArtSchema   = new Schema({
    name: String,
    artist_id: String,
    src: String,
    tree: String,
    likes: Array,
    url: String
    
});

module.exports = mongoose.model('Art', ArtSchema);