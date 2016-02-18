/**
 * Gallery App: serves up a dynamic web page of all the recent art that has been going on in the bot colony
 *  Uses doT for templating out the gallery page
 *  @author: Johnathan Pagnutti
 */

//Useful Techne constants
var communeAddress = "http://45.55.28.224:8080"


//Set up express, use the express-doT layer to comunicate between the templating language and the server
//pub: public static file directory.  This is where we'll serve non-changing stuff, like CSS and client-side javascript
//views: our various templates
var express = require('express');
var doT = require('express-dot');
var pub = __dirname+'/public';
var view = __dirname+'/views';
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var $ = require('jquery');


//Configure express to use the /views directory for dynamic content, and the various subdirectories in public for static content
//configure express to use doT for html
app.set('views', __dirname+'/views');
app.set('view engine', 'dot');
app.engine('html', doT.__express);
app.use('/css',express.static(__dirname+'/public/css'));
app.use('/img',express.static(__dirname+'/public/img'));
app.use('/js',express.static(__dirname+'/public/js'));
app.use('/fonts',express.static(__dirname+'/public/fonts'));
app.use(bodyParser.json());

//access route
app.get('/', function(req, res){
    // this is super basic curator behavour-- gets all the art it can by asking every artist for their art, and displays all the arts
    //we'll start by using to get all recent art, and then set the SVG code in a JSON template for page loading
    findBots(res, displayArt);
});

//Currently, Techne uses 8000, 8001 and 8002 in most demo situations, this prevents the page from blocking any of that communication
app.listen(8100);

//===============================================================================
// GET ART FUNCTIONS
//===============================================================================

/**
 * Function to find bots in a commune.  After we get a list of bots, pass that list to the callback and execute it
 */
function findBots(pageResponse, callback){
    request.get(communeAddress + "/techne/artists", function(error, res, body){
        if(!error && res.statusCode == 200){
            callback(pageResponse, body);
        }else{
            console.log(error);
            var templateData = {galleryArt: error};
            pageResponse.render('index.html', templateData);
        } 
    });
}

/**
 * Function to display the art of all the bots in the commune
 * First, recursively build an art list by asking each bot for art
 * Then, build an HTML object to display on the gallery page
 */
function displayArt(pageResponse, artistList){
    var artList = getArt(JSON.parse(artistList), [], pageResponse);
    if(artList == "error"){
        return;
    }
};

/**
 * Function to recursively get all the arts
 */
function getArt(artistList, currentArts, pageResponse){
    if(artistList.length == 0){
        console.log("Display all the work from " + currentArts.length + " artists...");
        //due to some weirdness in doT, put a terminating element in the list
        var templateData = {artList: currentArts};
        pageResponse.render('index.html', templateData);
        return "Got all arts";
    }

    var artist = artistList.shift();
    request.get(artist.location + "/techne/artist/art", function(error, res, body){
        if(!error && res.statusCode == 200){
            var arts = JSON.parse(body);
            console.log("Got " + body.length + " arts from " + artist.name);
            currentArts.push(body);
            console.log("Number of things in currentArts:");
            console.log(currentArts.length);
            getArt(artistList, currentArts, pageResponse);
        }else{
            console.log("ERROR GETTING THIS ARTISTS ARTS");
            console.log(error);
            console.log(res);
            return "error";
        }
    });
}
