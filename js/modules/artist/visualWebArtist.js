/**
 * @author Johnathan Pagnutti and Kate Compton
 * Artist in an art colony.  Does two primary things: make art and make crit (which is also art)
 * Artists might also define a policy, which is how often they want to 'talk' in a commune
 */
/*jshint esversion: 6 */
var WebArtist = require('./webArtist');
var VisualArtist = require('./visualArtist');
var commonlib = require('../commonlib');
var $ = require('jquery');

var WebVisualArtist = function(){
  console.log("In WebVisualArtist constructor:");
  //Multiple inheritance with JavaScript!
  VisualArtist.apply(this, arguments);

  //FIXME: need to do this by hand because extend changes the prototype?
  var webArtist;
  if(arguments){
    webArtist = new WebArtist(arguments[0]);
  }else{
    webArtist = new WebArtist();
  }

  this.artStore = webArtist.artStore;
};

WebVisualArtist.prototype = commonlib.inherit(VisualArtist.prototype);
/**
 * Use the createNewArt function from VisualArtist and publish it via the
 * function in WebArtist
 * @return {Promise} returns a promise for submitting a new art to the commune
 */
WebVisualArtist.prototype.createArt = function(){
  var newArtPromise = VisualArtist.prototype.createArt.apply(this);
  return newArtPromise.then(newArt => {
    return this.publishArt(newArt);
  });
};

//TODO find a way to programatically do this, or restructure.
WebVisualArtist.prototype.publishArt = WebArtist.prototype.publishArt;
WebVisualArtist.prototype.setPublishLocation = WebArtist.prototype.setPublishLocation;

module.exports = WebVisualArtist;