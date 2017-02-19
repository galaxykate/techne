/**
 * Library of browser-specific code.  Module expects to be in an environment
 * with a DOM, document object, window object, etc.
 */
/*jshint esversion: 6*/

var $ = require('jquery');
var lib = {
  /**
   * Get pixel data from an svg string and a width and height
   * @param  {String} svg    well-formed svg string
   * @param  {number} width  width
   * @param  {number} height height
   * @return {Promise}        a promise for the pixel data as a Uint8ClampedArray
   */
  renderSVG: function(svg, width, height){
    return new Promise(function(resolve, reject){
      //get pixel data through the canvas
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');
      var img = new Image(width, height);
      img.src = "data:image/svg+xml," + svg;
      img.onload = function(){
        ctx.drawImage(img, 0, 0);
        var imageData = ctx.getImageData(0, 0, width, height);
        resolve(imageData.data);
      };
    });
  },

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
    var wrapper = function(initialConfig){
      if(initialConfig === undefined){
        initialConfig = {};
      }
      //FIXME: this is hackier than I thought-- I'm skipping parts of model ceation I didn't need to skip before and I dunno why.
      //FIXME: true is to prevent mongoose from emitting the 'init' event.  This probably means
      //FIXME: that the initialConfig parameter is useless but /shrug/
      mongooseObj.Document.apply(this, [initialConfig, schema]);
    };
    wrapper.prototype = this.inherit(mongooseObj.Document.prototype);
    return wrapper;
  },

  /**
   * Use the DOM to parse a uri string
   * @param  {string} uri uri!
   * @return {Object}     parsed URI string
   */
  parseUri: function(uri){
    var result = {}, index, prop, a = document.createElement('a'),
       props = 'protocol hostname host pathname port search hash href'.split(' ');

    a.href = uri;
    // Copy relevant properties
    for (index in props) {
      prop = props[index];
      result[prop] = a[prop];
    }
    // For window.location compatibility
    result.toString = () => a.href;
    result.requestUri = a.pathname + a.search;

    // For JSON compatability.
    result.toJSON = result.toString;

    return result;
  }
};

module.exports = lib;
