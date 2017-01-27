/**
 * @author Johnathan Pagnutti and Kate Compton
 * Artist in an art colony.  Does two primary things: make art and make crit (which is also art)
 * Artists might also define a policy, which is how often they want to 'talk' in a commune
 */

var $ = require('jquery');
var Art = require('../../models/art');
var Tag = require('../../models/tag');
var btoa = require('btoa');
var WebArtist = require('./webArtist');
var ArtGrammar = require('./visualArtGrammar');
var commonlib = require('../commonlib');

var serializer = new XMLSerializer();
var WebVisualArtist = function(){
  //Visual Artist constructor
  WebArtist.apply(this, arguments);     //call the parent artist constuctor

  this.generators = [new ArtGrammar()];  //TODO one or more art creation grammars
};

WebVisualArtist.prototype = commonlib.inherit(WebArtist.prototype); //inherit methods parent

/**
 * Return a promise that eventually returns the pixel information of an art
 * Function flattens the generator to create an SVG string to render,
 * creates a canvas object to render the SVG onto, then start the async
 * render-to-canvas.
 * When the render is done, create a new Art object from the art model,
 * and tag it.  After that, submit it to be published!
 * @return {Promise} returns a promise for submitting the art to the commune.
 *                           This is not required, an just an example of how to
 *                           do art.
 */
WebVisualArtist.prototype.createNewArt = function(){
  var svg = this.selectGenerator().generate();
  //TODO: in the future when we add in tracery grammars, we'll be able to do this
  //var tree = this.selectGenerator().generate();
  //var svg = tree.finishedText;
  var publishArtPromise = this.createCanvas()
    .then(canvas => this.renderToCanvas(svg, canvas)
    .then(paintedCanvas => {
      var newArt = new Art();
      newArt.art = paintedCanvas;
      newArt.tags = this.signArt(svg);
      this.publishArt(newArt);
      //maybe also return the art out of the promise?
    }));
  return publishArtPromise;
};

/**
 * Create a canvas element.
 * TODO make this more agnostic to environment.
 * @return {Promise} A promise for a canvas element.
 */
WebVisualArtist.prototype.createCanvas = function(){
    return new Promise(function(resolve, reject){
      var canvas = $("<canvas />")[0];
      if(canvas){
        resolve(canvas);
      }else{
        reject();
      }
    });
};

/**
 * Render the provided SVG string to a canvas
 * @param  {String} svgString SVG string of the image we want to draw
 * @param  {Object} canvas    Canvas object to draw the SVG to
 * @return {Promise}          A Promise to finish the async work
 */
WebVisualArtist.prototype.renderToCanvas = function(svgString, canvas){
  //use jQuery to get an SVG object from an svg string
  var svg = $(svgString)[0];

  //serialize the SVG object, we'll be using it in a data url in a bit
  var svgData = serializer.serializeToString(svg);

  //get the canvas's context
  var ctx = canvas.getContext('2d');

  //create an image object, using the serialized SVG object
  //TODO move this to a seperate function
  var img = $("<img/>", {
    width: canvas.width + "px",
    height: canvas.height + "px",

    src: "data:image/svg+xml;base64," + btoa(svgData) //using the node.js btoa: https://www.npmjs.com/package/btoa
  })[0];
  console.log("Created img element", img);
  //create a new promise to wrap all the async functionality,
  //so we can use cool promise things like .then() and not have
  //to keep track of a callback
  var renderedPromise = new Promise(function(resolve, reject){
    //console.log("Are we in the rendering promise?");
    img.onload = function(){
      //after loading...
      //draw the image to the canvas
      ctx.drawImage(img, 0, 0);
      //resolve the promise by delivering the image object
      resolve(img);
    };
  });
  return renderedPromise;
};

/**
 * Get an array of tags to sign an art with.  There are some tags we'd like to enforce,
 * but mostly this is whatever the artist feels like it should be.
 * Art tags are key->value string pairs, and either of these can be
 * the empty string
 * @param  {String}   svg    The SVG string of this art.  Signed as a tag.
 * @return {Array}           an Array of Tag objects
 */
WebVisualArtist.prototype.signArt = function(svg){
  var generalArtistTags = WebArtist.prototype.signArt.apply(this);

  var typeTag = new Tag();
  typeTag.key = "type";
  typeTag.value = "picture";

  var svgTag = new Tag();
  svgTag.key = "svg";
  svgTag.value = svg;

  return [...generalArtistTags, typeTag, svgTag];
};

/**
 * Pick one of the many ways we can generate art
 * @return {Object} a generator for art!
 */
WebVisualArtist.prototype.selectGenerator = function(){
  //console.log(this.generators);
  return this.generators[Math.floor(Math.random() * this.generators.length)];
};

module.exports = WebVisualArtist;
