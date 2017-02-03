/**
 * Basepoint for the app.  Creates a commune and initalizes it.
 * NOTE: due to the use of CommonJS modules, gotta use webpack to compile
 * because I wanted to try and keep code as reusable as possible across
 * all Techne domains (browser, headless browser, pure node.js).
 */
var $ = require('jquery');

$(document).ready(function(){
  var WebCommune = require("./js/modules/webCommune");
  var commune = new WebCommune();
  commune.initalize();
});
