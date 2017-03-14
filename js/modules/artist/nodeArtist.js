/**
 * Specification for an Artist that uses Node and Express to make art.
 *
 * Node Artists work with Node ArtStores
 */
/*jshint esversion: 6*/

var commonlib = require("../commonlib");
var VisualArtist = require("./visualArtist");
var Artist = require("./artist");
var http = require("http");

var Art = require("../../models/art");
var Tag = require("../../models/tag");

var TextEncoder = require('text-encoding');
var NodeArtist = function(artStoreLoc){
  Artist.apply(this);

  if(artStoreLoc){
    this.artStoreLoc = artStoreLoc;
  }
};

NodeArtist.prototype = commonlib.inherit(Artist.prototype);

NodeArtist.prototype.publishArt = function(artStoreLoc, art){
  return new Promise((resolve, reject) => {
    var uri = commonlib.parseUri(artStoreLoc ? artStoreLoc : this.artStoreLoc);
    var payload = JSON.stringify(art);
    //console.log("Sending: ", payload);
    var options = {
      method: 'POST',
      host: uri.hostname,
      port: uri.port,
      path: uri.pathname,
      headers: {
        'Content-length': (new TextEncoder('utf-8').encode(payload)).length,
        'Content-type': 'application/json'
      }
    };

    console.log("Size: ", options.headers['Content-length']);
    var request = http.request(options, (res) => {
      var data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        var art = JSON.parse(data).art;
        if(art === undefined){
          reject(art);
        }
        resolve(art);
      });
      res.on('error', (err) => {
        console.error(err);
        reject(err);
      });
    });

    request.write(payload);
    request.end();
  });
};

NodeArtist.prototype.requestArt = function(artStoreLoc, filter){
  console.log("Attempting to retrieve some arts!");
  return new Promise((resolve, reject) => {
    var url = artStoreLoc ? artStoreLoc : this.artStoreLoc;
    http.get(url, res => {

      var data = '';
      res.on('data', chunk => {
        //console.log("Data chunk from the request: ", chunk);
        data += chunk;
      });

      res.on('end', () => {
        var recieved = JSON.parse(data);
        console.log("Full number of arts recieved", recieved.length);
        resolve(filter ? recieved.filter(filter) : recieved);
      });

      res.on('error', (err) => {
        console.error(err);
        reject(err);
      });
    });
  });
};

NodeArtist.prototype.setPublishLocation = function(artStoreLoc){
  this.artStoreLoc = artStoreLoc;
};

/**
NodeArtist.prototype.slimArt = function(art){
  var slimTagArray = [];
  for(let tag of art.tags){
    var slimTag = {
      key: tag.key,
      value: tag.value
    };

    slimTagArray.push(slimTag);
  }


  var slimArt = {
    art: art.art,
    tags: slimTagArray
  };

  return slimArt;
};
*/

module.exports = NodeArtist;
