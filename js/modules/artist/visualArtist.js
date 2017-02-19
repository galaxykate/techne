/**
 * @author Johnathan Pagnutti and Kate Compton
 * Artist in an art colony.  Does two primary things: make art and make crit (which is also art)
 * Artists might also define a policy, which is how often they want to 'talk' in a commune
 */
/*jshint esversion: 6 */
var Art = require('../../models/art');
var Tag = require('../../models/tag');
var btoa = require('btoa');
var Artist = require('./artist');
var ArtGrammar = require('./visualArtGrammar');
var ColorPreference = require('./colorPreference');
var commonlib = require('../commonlib');
var $ = require('jquery');

var VisualArtist = function(){
  //Visual Artist constructor
  Artist.apply(this, arguments);     //call the parent artist constuctor

  this.generators = [new ArtGrammar()];
  this.evaluators = [new ColorPreference()];

  //TODO easy access to a color preference
  this.colorPreference = this.evaluators[0];
};

VisualArtist.prototype = commonlib.inherit(Artist.prototype); //inherit methods from a single parent

/**
 * Return a promise that eventually returns the pixel information of an art
 * Function flattens the generator to create an SVG string to render,
 * creates a canvas object to render the SVG onto, then start the async
 * render-to-canvas.
 * When the render is done, create a new Art object from the art model,
 * and tag it.
 * @return {Promise} returns a promise creating a new art object
 */
VisualArtist.prototype.createArt = function(){
  var svg = this.selectGenerator().generate();
  //TODO: in the future when we add in tracery grammars, we'll be able to do this
  //var tree = this.selectGenerator().generate();
  //var svg = tree.finishedText;
  //in addition, we need the width and height to get the correct pixel data
  //FIXME hardcoded for now, but maybe should be supplied by the generator?
  var newArtPromise = this.renderToImg(svg, 90, 120)
    .then(renderedArt => {
      console.log("Created A New Art: ", renderedArt);
      var newArt = new Art();
      newArt.art = {};
      newArt.art.pixels = renderedArt;
      newArt.art = this.addArtMetadata(newArt.art, svg, 90, 120);
      newArt.tags = Artist.prototype.signArt.apply(this);
      newArt.tags.push("medium:picture");
      return newArt;
    })
    .catch(error => {
      throw error;
    });
  return newArtPromise;
};

/**
 * Render an SVG string to pixel data (RGBA).
 * @param  {string} svg    SVG description of an image
 * @param  {width} width  width of the image
 * @param  {height} height height of the image
 * @return {Promise}        a promise for the pixel data
 */
VisualArtist.prototype.renderToImg = function(svg, width, height){
  return new Promise((resolve, reject) => {
    commonlib.renderSVG(svg, width, height)
    .then(artData => {
      resolve(Array.from(artData));
    });
  });
};

/**
 * Create a critique of a given art
 * @param  {Art} art  An art to critique
 * @return {Promise}     A promise for a critique
 */
VisualArtist.prototype.evaluateArt = function(art){
  return new Promise ((resolve, reject) => {
    if(!this.testToUnderstand(art)){
      reject("Unable to understand art of this form");
    }else{
      //TODO example of how to apply a preference.  Artists can have more than one!
      this.colorPreference.apply(art)
        .then(colorScore => {
          var newCrit = new Art();
          newCrit.art = {
            score: colorScore,
          };
          newCrit.tags = this.signCrit(art);
          console.log("New Crit: ", newCrit);
          resolve(newCrit);
        });
    }
  });
};

/**
 * Test to see if we can understand this art.  We can understand pixel data:
 * we expect arts to by iterable, and every element we return to be a number between 0 and 255
 * @param  {Object} art the art to check if we understand
 * @return {Boolean}     true if it looks like we can understand an art, false if otherwise
 */
VisualArtist.prototype.testToUnderstand = function(art){
  var artContent = art.art.pixels;
  //test that the art is an array of values from
  if(typeof artContent[Symbol.iterator] !== 'function'){
    return false; //provided art isn't iterable
  }

  return artContent.every(element => 0 <= element && element <= 255);
};

/**
 * Get an array of tags to sign an art with.  There are some tags we'd like to enforce,
 * but mostly this is whatever the artist feels like it should be.
 * Art tags are key->value string pairs, and either of these can be
 * the empty string
 * @param  {String}   svg    The SVG string of this art.  Signed as a tag.
 * @return {Array}           an Array of Tag objects
 */
VisualArtist.prototype.addArtMetadata = function(art, svg, width, height){
  //var generalArtistTags = Artist.prototype.signArt.apply(this);

  art.svg = svg;
  art.width = width + "";
  art.height = height + "";

  return art;
};

VisualArtist.prototype.signCrit = function(art){
    var tags = Artist.prototype.signArt.apply(this);
    tags.push("medium:critique");
    tags.push("sourceArt:" + art._id);
    return tags;
};

/**
 * Pick one of the many ways we can generate art
 * @return {Object} a generator for art!
 */
VisualArtist.prototype.selectGenerator = function(){
  return this.generators[Math.floor(Math.random() * this.generators.length)];
};

module.exports = VisualArtist;
