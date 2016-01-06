/**
*
* @author Johnathan Pagnutti
*
* The gallery location for the art bot collective
*/

var mongoose 	= require('mongoose');
var Schema	= mongoose.Schema

var GalleryLocSchema 	= new Schema({
	name: String,
	type: String,
	location: String
});

module.exports = mongoose.model('GalleryLoc', GalleryLocSchema);
