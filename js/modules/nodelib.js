/**
 * Library of NODE SPECIFIC functions.  Webpack will shit a brick if
 * any of these get bundled for browser use.
 * Things that rely on node specific libraries (right now, this is gm) go here.
 *
 * Stuff here _probably_ needs an equivelent in the browser side of things.
 */
/*jshint esversion:6*/

var nodelib = {
  /**
   * Export a model-like object based on which version of Mongoose we're using.
   * The wrapper for the Isomorphic case is an anonimous costructor that wraps
   * creating documents from schemas (which is the reason why we'd use models
   * in the first place.)
   * @param  {object} mongooseObj      the mongoose object we have access to
   * @param  {String} dbCollectionName in the non-isomorphic case, we need to list which Mongo collection this is affiliated with
   * @param  {object} schema           the schema to create a document from
   * @return {object}                  either a model, or a wrapper around isomorphic document creation
   */
  exportModel: function(mongooseObj, dbCollectionName, schema){
    return mongooseObj.model(dbCollectionName, schema);
  },

  /**
   * Returns a promise for a Uint8ClampedArray of pixel data, given an SVG string,
   * a width and a height.  Pixel data is interpreted as a PNG file.
   * Uint8ClampedArrays are the underlying type behind the ImageData object, and
   * about as close as nodejs can get before we need to use beefier tools.
   *
   * This function requires the gm module.
   * @param  {String} svg    A well-formed SVG string.  Should not have the XML header, as this function will add it
   * @param  {number} width  width of our visual art
   * @param  {number} height height of our visual art
   * @return {Promise}        a Promise for a Uint8ClampedArray of pixel data.
   */
  renderSVG: function(svg, inWidth, inHeight){
    return new Promise(function(resolve, reject){
      //Using a pair of libraries built over jsdom and GraphicsMagick/ImageMagick
      //to get raw pixel data from an SVG string
      //FIXME: not very crossplatform.  Requires, at least, ImageMagick/GraphicsMagick to be installed.
      //svg2img converts an SVG string to an encoded png, sharp extracts pixel
      //data from a png buffer to a 4 channel raw array
      //We send off a Uint8ClampedArray, because it's the base type for the
      //ImageData object, which backs the HTML 5 Image element.
      //        (read as: should make rendering easier)
      var svg2img = require('svg2img');
      var sharp = require('sharp');

      svg2img(svg, {format:'png'}, function(err, pngBuffer){
        if(err){
          reject(err);
        }
        sharp(pngBuffer)
          .raw({
            width: inWidth,
            height: inHeight,
            channels: 4
          })
          .toBuffer(function(err, pixels, info){
            if(err){
              reject(err);
            }
            resolve(Uint8ClampedArray.from(pixels));
        });
      });
    });
  },

  // parseUri 1.2.2
  // (c) Steven Levithan <stevenlevithan.com>
  // MIT License
  parseUri: function(str) {
    var	o   = this.parseUriOptions,
    m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
    uri = {},
    i   = 14;
    while (i--) uri[o.key[i]] = m[i] || "";
    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) uri[o.q.name][$1] = $2;
    });
    return uri;
  },

  parseUriOptions: {
  	strictMode: true,
  	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
  	q:   {
  		name:   "queryKey",
  		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  	},
  	parser: {
  		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
  		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  	}
  }
};

module.exports = nodelib;
