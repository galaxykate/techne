/**
 * A Tracery art grammar.  Makes small SVG strings.
 * @TODO a placeholder right now, need to see if Tracery is CommonJS compliant,
 * and if not, write a wrapper around it that is (which probably means editing
 * the source).
 * @author Johnathan Pagnutti, Kate Compton
 */
/* jshint esversion: 6*/
//put Tracery requirement here

// PRIVATE METHODS HERE
// NOTE: HTML string manipulation methods.  We might want to farm these out to
// a seperate library, but I think they'll only ever be called here, as part
// the Tracery grammar, so they should live with other grammar tools.
var commonlib = require("../commonlib");
/**
 * Create a closed HTML tag (a tag with no content in it "<tag></tag>")
 * Copied directly from the old common.js file
 * @param  {string} tagName    the name of the closed tag to creates
 * @param  {object} attributes a set of key-value string pairs that work as this tag's attributes
 * @param  {string} attrString other attributes to add into the tag
 * @return {string}            a wellformed, closed html tag
 */
function toClosedTag(tagName, attributes, attrString) {
  var s = "<" + tagName;
  if (attributes) {
		for(let key in attributes){
			if(attributes.hasOwnProperty(key)){
				s += " " + key + "=" + inQuotes(attributes[key]);
			}
		}
	}

	if (attrString) {
		s += " " + attrString;
	}
	s += "/>";
	return s;
}

/**
 * Create an html tag with content in it ("<tag>content</tag>")
 * Copied directly from the old common.js file
 * @param  {String} tagName    the name of the tag
 * @param  {Object} attributes a set of key-value pairs that work as this tag's attributes
 * @param  {String} contents   the stuff on the inside of the tags
 * @return {String}            a well-formed set of tagged html
 */
function toTag(tagName, attributes, contents) {
	var s = "<" + tagName;
	if (attributes) {
		for(let key in attributes){
			if(attributes.hasOwnProperty(key)){
				s += " " + key + "=" + inQuotes(attributes[key]);
			}
		}
	}
	s += ">" + (contents ? contents : "") + "</" + tagName + ">";
	return s;
}

/**
 * Enclose a string in quotes
 * Copied directly from the old common.js file
 * @param  {String} s a string to enclose in quotes
 * @return {String}   "s"
 */
function inQuotes(s) {
	return '"' + s + '"';
}

/**
 * Art Grammar Constructor.
 */
var ArtGrammar = function(){
  this.artSize = {};
  this.artSize.w = 90;
  this.artSize.h = 120;
};

ArtGrammar.prototype = {
  /**
   * Generate a new art!  For this generator, an art is a fully, well formed
   * SVG string.
   * @return {string} an SVG string that makes an art
   */
  generate: function(){
    //TODO: right now, just generating art of a single solid color.
    //TODO: It'll help get the bits working
    var solidSvgRect = toClosedTag("rect", {
      x: 0,
      y: 0,
      width:  this.artSize.w,
      height: this.artSize.h,
      fill:   "hsl(271,100%,50%)"
    });

    var svg = toTag("svg", {
      viewBox: "0 0 " + this.artSize.w + " " + this.artSize.h,
      width: this.artSize.w,
      height: this.artSize.h,
      xmlns: "http://www.w3.org/2000/svg",
      version: "1.1"
    }, solidSvgRect);

		return svg;
  },
};

module.exports = ArtGrammar;
