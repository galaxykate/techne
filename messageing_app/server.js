/**
 *
 * @author  Johnathan Pagnutti
 * 
 * A centeral messaging server for Techne.  The server keeps track of all other bots in the community.
 *
 */

// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
// call express
var app = express();
// define our app using express
var bodyParser = require('body-parser');

var path = require("path");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(bodyParser.json());

app.use(express.static('web'));

var port = process.env.PORT || 8080;
// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();
// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Messaging Server recieved a request');
    next();
    // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        message : 'Welcome to Techne, the first artist commune for AIs.  Please see our GitHub page for communication guidlines while you stay in our commune!'
    });
});

// on routes that end in /artists
// ----------------------------------------------------
router.route('/artists')

// get all the artist locations (accessed at GET http://[serverloc]:8080/techne/artists)
.get(function(req, res) {
    ArtistLoc.find(function(err, artistLocs) {
        if (err)
            res.send(err);

        res.json(artistLocs);
    });
})
// create an artist location (accessed at POST http://localhost:8080/techne/artists)
.post(function(req, res) {

    var artistLoc = new ArtistLoc();
    // create a new instance of the artist location model
    artistLoc.name = req.body.name;
    artistLoc.location = req.body.location;
    artistLoc.type = req.body.type;
    // set the gallery locations name (comes from the request)

    // save the bear and check for errors
    artistLoc.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message : 'Thanks for joining us!',
	    locId: artistLoc._id
        });
    });

});

// on routes that end in /techne/artist/:artist_id
// ----------------------------------------------------
router.route('/artist/:artist_id')

// get the artist location  with that id (accessed at GET http://[serverloc]:8080/techne/artist/:artist_id)
.get(function(req, res) {
    ArtistLoc.findById(req.params.artist_id, function(err, artistLoc) {
        if (err)
            res.send(err);
        res.json(artistLoc);
    });
})
// update the artist location  with this id (accessed at PUT http://[serverloc]:8080/techne/artist/:artist_id)
.put(function(req, res) {

    // use our artist loc model to find the artist location  we want
    ArtistLoc.findById(req.params.artist_id, function(err, artistLoc) {

        if (err)
            res.send(err);

	// update the gallery location info
	if(req.body.name){
        	artistLoc.name = req.body.name;
	}
	if(req.body.location){
		artistLoc.location = req.body.location;
	}
	if(req.body.type){
		artistLoc.type = req.body.type
	}       

	// save the gallery location
        artistLoc.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message : 'Thanks for letting us know, we hope the move went ok.'
            });
        });

    });
})
// delete the gallery location with this id (accessed at DELETE http://[serverlocation]:8080/techne/artist/:artist_id)
.delete(function(req, res) {
    ArtistLoc.remove({
        _id : req.params.artist_id
    }, function(err, artistLoc) {
        if (err)
            res.send(err);

        res.json({
            message : "We're sorry to see you go.  Thank you for being a part of our community!"
        });
    });
});

// on routes that end in /gallery
// ----------------------------------------------------
router.route('/galleries')

// get all the gallery locations (accessed at GET http://[serverloc]:8080/techne/galleries)
.get(function(req, res) {
    GalleryLoc.find(function(err, galleryLocs) {
        if (err)
            res.send(err);

        res.json(galleryLocs);
    });
})
// create a gallery location (accessed at POST http://localhost:8080techne/galleries)
.post(function(req, res) {

    var galleryLoc = new GalleryLoc();
    // create a new instance of the Bear model
    galleryLoc.name = req.body.name;
    galleryLoc.location = req.body.location;
    galleryLoc.type = req.body.type;
    // set the gallery locations name (comes from the request)

    // save the bear and check for errors
    galleryLoc.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message : 'Thanks for letting us know about a new gallery opening!',
	    locId: galleryLoc._id
        });
    });

});

// on routes that end in /techne/gallery/:gallery_id
// ----------------------------------------------------
router.route('/gallery/:gallery_id')

// get the gallery location  with that id (accessed at GET http://[serverloc]:8080/techne/gallery/:gallery_id)
.get(function(req, res) {
    GalleryLoc.findById(req.params.gallery_id, function(err, galleryLoc) {
        if (err)
            res.send(err);
        res.json(galleryLoc);
    });
})
// update the galelry location  with this id (accessed at PUT http://[serverloc]:8080/techne/gallery/:gallery_id)
.put(function(req, res) {

    // use our bear model to find the bear we want
    GalleryLoc.findById(req.params.gallery_id, function(err, galleryLoc) {

        if (err)
            res.send(err);

	// update the gallery location info
	if(req.body.name){
        	galleryLoc.name = req.body.name;
	}
	if(req.body.location){
		galleryLoc.location = req.body.location;
	}
	if(req.body.type){
		galleryLoc.type = req.body.type
	}       

	// save the gallery location
        galleryLoc.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message : 'Gallery Location Updated, we hope the move went ok.'
            });
        });

    });
})
// delete the gallery location with this id (accessed at DELETE http://[serverlocation]:8080/techne/gallery/:gallery_id)
.delete(function(req, res) {
    GalleryLoc.remove({
        _id : req.params.gallery_id
    }, function(err, galleryLoc) {
        if (err)
            res.send(err);

        res.json({
            message : 'Gallery has been removed.  Thank you for hosting our art!'
        });
    });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /techne
app.use('/techne', router);

// START THE SERVER
// =============================================================================
var server = app.listen(port);
console.log('Messaging server is listening on port ' + port);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/techneLocations');
// connect to our database

var ArtistLoc = require('./app/models/artistLoc');
var GalleryLoc = require('./app/models/galleryLoc');

