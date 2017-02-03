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
var commonlib = require('../commonlib');
var $ = require('jquery');

var VisualArtist = function(){
  //Visual Artist constructor
  Artist.apply(this, arguments);     //call the parent artist constuctor

  this.generators = [new ArtGrammar()];
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
      var newArt = new Art();
      newArt.art = renderedArt;
      newArt.tags = this.signArt(svg, 90, 120);
      return newArt;
    })
    .catch(error => {
      throw error;
    });
  return newArtPromise;
};


VisualArtist.prototype.renderToImg = function(svg, width, height){
  return new Promise(function(resolve, reject){
    resolve(commonlib.renderSVG(svg, width, height));
  });
};

/**
 * Get an array of tags to sign an art with.  There are some tags we'd like to enforce,
 * but mostly this is whatever the artist feels like it should be.
 * Art tags are key->value string pairs, and either of these can be
 * the empty string
 * @param  {String}   svg    The SVG string of this art.  Signed as a tag.
 * @return {Array}           an Array of Tag objects
 */
VisualArtist.prototype.signArt = function(svg, width, height){
  var generalArtistTags = Artist.prototype.signArt.apply(this);

  var typeTag = new Tag();
  typeTag.key = "type";
  typeTag.value = "picture";

  var svgTag = new Tag();
  svgTag.key = "svg";
  svgTag.value = svg;

  var widthTag = new Tag();
  widthTag.key = "width";
  widthTag.value = width + "";

  var heightTag = new Tag();
  heightTag.key = "height";
  heightTag.value = height + "";

  return [...generalArtistTags, typeTag, svgTag, widthTag, heightTag];
};

/**
 * Pick one of the many ways we can generate art
 * @return {Object} a generator for art!
 */
VisualArtist.prototype.selectGenerator = function(){
  return this.generators[Math.floor(Math.random() * this.generators.length)];
};

module.exports = VisualArtist;
