/**
 * @author Kate and Johnathan
 */
// The node process around an artist for our commune.  A lot of this is framework code to be implemeneted differently as we go

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
var request = require("request"); //library to do basic HTTP requests in node

// this is the path of the messaging server that keeps track of who is in this commune
var communeAddress = "http://45.55.28.224:8080"
var communeHost = '45.55.28.244';
var communePort = '8080';

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(bodyParser.json());

app.use(express.static('web'));

var port = process.env.PORT || 8081;
// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();
// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log("Someone sent me a request");
    next();
    // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://[serverloc]:8081/techne/artist)
router.get('/', function(req, res) {
    res.json({
        message : "Hello, I'm a bot that's currently part of Techne."
    });
});

// on routes that end in /techne/artist/critique
// ----------------------------------------------------
router.route('/critique')

// pass the artist a critique to respond to (accessed at POST http://[serverloc]:8081/techne/artist/critique)
.post(function(req, res) {
    res.json({
	message: "I'm not responding to critique right now."
    });
});

// on routes that end in /techne/artist/art
// ----------------------------------------------------
router.route('/art')

// get all the art that this artist feels like sharing  with that id (accessed at GET http://[serverloc]:8081/techne/artist/art)
.get(function(req, res) {
    res.json({
	message: "I'm not showing any art right now."
    });
});

// on routes that end in /techne/artist/art/:art_id
router.route('/art/:art_id')

// get the art at this id if the bot feels like sharing (accessed at GET http://[serverloc]:8081/techne/artist/art/:art_id
.get(function(req, res) {
    res.json({
	message: "I'm not showing that particular art right now."
    });
});

// on routes that end in /techne/artist/respond
// --------------------------------------------------
router.route('/respond')

// pass this artist an art to critique (accessed at POST http://[serverloc]:8081/techne/artist/respond)
.post(function(req, res) {
    res.json({
	message: "I'm not critiquing art right now."
    });
});
	
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /techne/artist
app.use('/techne/artist', router);

// GRACEFUL SHUTDOWN LOGIC --------------------------
// we want to send a final request to the messaging server to remove us from the commune when we shut down
var shutdownGracefully = function(){
   console.log("Ok. I need to finish any work people are waiting for and say goodbye to all my art friends.");
   server.close(function(){
	console.log("... I promise I'm saying goodbye right now.");
	request.del(communeAddress + "/techne/artist/" + bot.locId, function(error, response, body){
	    if(error){
		console.log(bot.locId);
		console.log(error);
	    }
	    process.exit();
       });
    });

    setTimeout(function() {
	console.log("Something happened and I couldn't finish my work or say goodbye.");
	 process.exit()
    }, 10*1000);
};

// START THE SERVER
// =============================================================================
var server = app.listen(port);
console.log("I'm an artist listening on " + port);

//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/test');
// connect to our database

// KILL LOGIC
// =============================================================================
process.on('SIGTERM', shutdownGracefully);
process.on('SIGINT', shutdownGracefully);

// INTRODUCE YOURSELF LOGIC
//==============================================================================
//sub for the actual bot
var bot = {}
request.post(communeAddress + "/techne/artists", {
    'form': {
	'type': 'pictures',
	'location' : '45.55.28.244:8081',
	'name': 'test_name'
    }
}, function(error, response, body){
    if(error){
	console.log(error);
	bot.locId = undefined;
    }
    var info = JSON.parse(body);    
    bot.locId = info.locId;
    console.log("I should say hi to all my new art friends!");
});
