/**
 * An Artist that works in-browser.  Does not implement methods in artist.js,
 * but adds extra methods that are useful for artists that work in a web
 * environment
 * @author Johnathan
 */
/*jshint esversion: 6 */
var Artist = require("./artist");
var commonlib = require("../commonlib");
var WebArtStore = require("../artstore/webArtStore");

var WebArtist = function(artStore){
  //start by calling the constructor of an Artist
  Artist.apply(this);

  //being a little careful here, as arguments to this constructor can
  //come from anywhere.
  this.artStore = artStore instanceof WebArtStore ? artStore : undefined;
};

WebArtist.prototype = commonlib.inherit(Artist.prototype);

/**
 * Add the provided art to the webartstore that this artist knows about
 * @return {Promise} a promise that an art has been added to a webstore
 */
WebArtist.prototype.publishArt = function(newArt){
  return new Promise((resolve, reject) => {
    if(this.artStore){
      resolve(this.artStore.addArt(newArt));
    }else{
      reject("No Provided ArtStore!");
    }
  });
};

WebArtist.prototype.setPublishLocation = function(artStore){
  this.artStore = artStore;
};

module.exports = WebArtist;
