/**
 * A view for a web visual artist!
 * Maybe spruce this up with fancy CSS magic, @Kate?
 * @author Johnathan
 */
/*jshint esversion: 6*/
var $ = require('jquery');
var Card = require('./card');

var WebArtStoreView = function(webArtStore){
  this.artStore = webArtStore;
  this.div = $(".page-content");
  //add event handling here?
  this.artStore.addEventListener("New Art", () => {
    //@TODO this might explode
    this.clearView();
    this.updateView();
  });

  this.updateView();
};

WebArtStoreView.prototype = {
  /**
   * Clear out the view so we can get new arts!
   * @return {None} just modifies DOM does not return
   */
  clearView: function(){
    this.div.empty();
  },

  /**
   * Iterate through our arts, adding a view for each one of them
   * @return {None} just modifies the DOM, does not return
   */
  updateView: function(){
    for(let art of this.artStore.getArt()){
      var card = new Card(this.div, art, {
    		title: "Untitled Art",
    		classes: "card-art card-art",
    		hideDetails: true,
    	});

    	// Create the holder for the svg
    	card.art = $("<div/>", {
    		class: "art-thumbnail",
    	}).appendTo(card.contents);
      //wrap the core HTML img object, add it to the card.
      $(art.art).appendTo(card.art);

      //var card = new Card(this.div, {});
      //$(art.art).appendTo(card.contents);
      //this.div.append(art.art);
      /**
      var newCanvas = ($('<canvas />'))[0];
      var ctx = newCanvas.getContext('2d');
      var img = art.art[0];
      ctx.drawImage(img);
      this.div.append(newCanvas);
      */
    }
  }
};

module.exports = WebArtStoreView;
