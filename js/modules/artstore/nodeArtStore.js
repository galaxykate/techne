/**
 * A node based artstore.
 */
/*jshint esversion: 6*/

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

var Art         = require('../../models/art');
var Tag         = require('../../models/tag');
var Artist      = require('../../models/artist');
mongoose.Promse = global.Promise;           //native promises.

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

var port = process.env.PORT || 8080;        // set our port
mongoose.connect(process.env.DB || 'mongodb://localhost/techne'); //connect to some other mongoose DB or a local one

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//middleware to allow access from anywhere, disable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to a Techne Artstore!' });
});

// route to get art from this art store
// gets ALL the art.
router.get('/art', function(req, res){
  console.log("Fielding a get request for arts:");
  Art.find({})
    .then((arts, err) => {
      if(err){
        console.log("Get Art ERROR:");
        console.log(err);
        res.send(err);
      }
      console.log("returning:", arts.length);
      res.json(arts);
    });
});

router.post('/art', function(req, res){
  console.log("Fielding a request to save an art to the artstore");
  var art = new Art();
  art.art = req.body.art;
  art.tags = req.body.tags;

  //create an author ID if none exists yet for this bot (isn't signing with a valid author tag)
  var artist;
  var authorTag = art.tags.find(tag => tag.includes("author"));
  if(!authorTag){
    artist = new Artist();
    authorTag = "author:" + artist._id;
    art.tags.push(authorTag);
  }

  art.markModified('art');
  art.save()
  .then((savedArt, numAffected, err) => {
    //TODO not really sure how to handle an error in context
    console.log("ResponseID", savedArt._id);
    console.log("ModelID", art._id);
    console.log("ProvidedID", req.body._id);
    var ret = {
      artID: savedArt._id,
      artistID: authorTag.substring(authorTag.indexOf(":"))
    };
    res.json(ret);
    //it doesn't really matter for sending a message back, so if we have a new artist, save it
    if(artist !== undefined){
      artist.save();
    }
  });
});

router.get('/influence', function(req, res){
  console.log("Fielding a request for an influence graph");
  Art.find({})
    .then((arts, err) => {
      if(err){
        console.log("Get Graph ERROR:");
        console.log(err);
        res.send(err);
      }
      var influence = {
        "nodes" : [],
        "links" : []
      };
      for(let art of arts){
        influence.nodes.push({
          "id": art._id,
          "author": art.tags.find(tag => tag.includes("author")),
          "medium" : art.tags.find(tag => tag.includes("medium")),
          "inspiredBy": art.tags.find(tag => tag.includes("inspiredBy")),
          "sourceArt": art.tags.find(tag => tag.includes("sourceArt"))
        });
      }
      console.log("Number of nodes in graph: " + influence.nodes.length);
      for(let node of influence.nodes){
        console.log("Considering ", node);
        if(node.inspiredBy !== undefined){
          console.log("Looking for inspiring node", node.inspiredBy);
          var inspiringNode = influence.nodes.find(srcNode => {
            return srcNode.id == node.inspiredBy.substring(node.inspiredBy.indexOf(":") + 1);
          });

          if(inspiringNode){
            influence.links.push({
              "source": inspiringNode.id,
              "target": node.id,
              "type": "influence"
            });
          }else{
            console.log("Failed to find the art " + node.inspiredBy + "that inspired " + node.id);
          }
        }

        if(node.sourceArt !== undefined){
          console.log("Looking for source node", node.sourceArt);
          var sourceNode = influence.nodes.find(srcNode => {
            return srcNode.id == node.sourceArt.substring(node.sourceArt.indexOf(":") + 1);
          });
          console.log("Found Source Node:", sourceNode);
          if(sourceNode){
            influence.links.push({
              "source": sourceNode.id,
              "target": node.id,
              "type": "critique"
            });
          }else{
            console.log("Unable to find the art " + node.sourceArt + "that inspired " + node.id);
          }
        }
      }

      console.log("Final Return: ", influence);
      res.json(influence);
    });
});

/**
Endpoint takes an empty POST request and clears the db of all arts and artists
*/
router.post('/clear', function(req, res){
  Art.remove({})
  .then((err) => {
    if(err){
      res.send(err);
    }else{
      res.json({'message':'success'});
    }
  });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/techne', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
