/**
 * Node Visual Artist that works in the browser (rather than an independent process)
 */
/*jshint esversion: 6*/

var NodeArtist = require('./nodeArtist');
var VisualArtist = require('./visualArtist');

var commonlib = require('../commonlib');
var $ = require('jquery');

var NodeVisualArtist = function(){
  //Multiple inheritance with JavaScript!
  VisualArtist.apply(this, arguments);

  var nodeArtist;
  if(arguments){
    nodeArtist = new NodeArtist(arguments[0]);
  }else{
    nodeArtist = new NodeArtist();
  }

  //custom state: we want to pay attention to which arts are ours in 'public knowledge'
  this.artIds = [];
  //we also want to remember the last crit we got
  this.lastCrit = Infinity;
  //we also want to keep track of who is inspiring us to change (giving us worse crits than our last crit)
  this.inspiration = [];

  //and also add all the properties that were present from a NodeArtist
  this.artStoreLoc = nodeArtist.artStoreLoc;
};

NodeVisualArtist.prototype = commonlib.inherit(VisualArtist.prototype);
/**
 * Use the createNewArt function from VisualArtist and publish it via the
 * function in NodeArtist.  We get back the published art from the NodeArtist
 * publish function, which we use to save the art's ID.
 * @return {Promise} returns a promise for submitting a new art to the commune
 */
NodeVisualArtist.prototype.createArt = function(){
  var newArtPromise = VisualArtist.prototype.createArt.apply(this);
  return newArtPromise.then(newArt => {
      //if we have an inspiring artists,tag them in
      for(let inspiringBot of this.inspiration){
        newArt.tags.push("inspiredBy:" + inspiringBot);
      }

      console.log("Attempting to publish:\n ", newArt);
      console.log("At", this.artStoreLoc);
      return this.publishArt(this.artStoreLoc, newArt);
    })
    .then(art => {
      //we get the art we just published as a response
      //We don't do our own id'ing, the ArtStore may handle that for us
      this.artIds.push(art._id !== undefined ? art._id : console.error("Unable to save my art ids!"));
      return art;
    });
};

NodeVisualArtist.prototype.createCritique = function(){
  console.log("Attempting to get art to crit from ", this.artStoreLoc);
  return this.requestArt(this.artStoreLoc,
    art => {
      var authorTag = art.tags.find(tag => tag.includes("author") && !tag.includes(this.id));
      var mediumTag = art.tags.find(tag => tag == "medium:picture");
      console.log("Tags:", authorTag, mediumTag);
      return authorTag && mediumTag;
    })
    .then(arts => {
      console.log("Got #", arts.length);
      var selectedArt = arts[Math.floor(Math.random() * arts.length)];
      console.log("Going to crit ", selectedArt);
      if(selectedArt){
        return VisualArtist.prototype.evaluateArt.apply(this, [selectedArt]);
      }
    })
    .then(newCrit => {
      return newCrit !== undefined ? this.publishArt(this.artStore, newCrit) : new Promise();
    });
};

NodeVisualArtist.prototype.getCritiqueAndSelfModify = function(){
  return this.requestCritique()
    .then(art => {
      console.log("Going to self modify after seeing " + art._id);
      this.selfModify(art);
    });
};

NodeVisualArtist.prototype.requestCritique = function(){
  console.log("Requesting a crit");
  console.log("Arts I've made: ", this.artIds);
  return this.requestArt(this.artStoreLoc,
    art => {
      console.log("Considering: ", art.tags);
      var authorTag = art.tags.find(tag => tag.includes("author") && !tag.includes(this.id)); //TODO: maybe explicitly required
      var mediumTag = art.tags.find(tag => tag == "medium:critique");
      var sourceTag = art.tags.find(tag => {
        if(tag.includes("sourceArt")){
          var sourceId = tag.substring(tag.indexOf(":") + 1);
          console.log("SourceId", sourceId);
          return this.artIds.find(artId => {
            console.log("Comparing:", artId, sourceId);
            return artId == sourceId;
          }) ? tag : undefined;
        }
      });
      return authorTag && mediumTag && sourceTag;
    })
    .then(crits => {
      console.log("Got #", crits.length);
      var selectedCrit = crits[Math.floor(Math.random() * crits.length)];
      return selectedCrit;
    });
};

NodeVisualArtist.prototype.selfModify = function(crit){
  if(crit.art.score < this.lastCrit){
    //this bot doesn't like us as much as the last bot did :(
    //change out favorite color
    this.colorPreference.setHuePreference(Math.floor(Math.random() * 360));

    //var critAuthorTag = crit.tags.find(tag => tag.includes("author"));
    this.inspiration.push(crit._id + "");
  }
};

//TODO find a way to programatically do this, or restructure.
NodeVisualArtist.prototype.publishArt = NodeArtist.prototype.publishArt;
NodeVisualArtist.prototype.requestArt = NodeArtist.prototype.requestArt;
NodeVisualArtist.prototype.setPublishLocation = NodeArtist.prototype.setPublishLocation;

module.exports = NodeVisualArtist;
