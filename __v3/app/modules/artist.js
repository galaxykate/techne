/**
 * @author Johnathan Pagnutti and Kate Compton
 * Artist in an art colony.  Does two primary things: make art and make crit (which is also art)
 * Artists might also define a policy, which is how often they want to 'talk' in a commune
 */

//TODO: this is where required functions go for an artist

var Artist = function(){
  //Artist constructor
  this.name = ""; //TODO write a MLP name generator
  this.id = "";   //TODO gonna pull in a GHID creator

  this.generator = {}; //TODO some SVG tracery creation grammar

};

Artist.prototype = {
  /**
   * Return a promise that eventually returns the pixel information of an art
   * Function flattens the generator to create an SVG string to render,
   * creates a canvas object to render the SVG onto, then pull the pixel
   * data from canvas and return )_that_
   * @return {promise} [description]
   */
  createNewArt: function(){
    var svgString = this.generator.flatten();
    
  }
};
