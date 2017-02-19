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
    var artGenerator = this.artStore.getArt(art => {
      var typeTag = art.tags.filter(tag => tag.key == "type")[0];
      if(typeTag.value == "picture"){
        return true;
      }
      return false;
    });

    for(let art of artGenerator){
      var width = Number(art.tags.filter(tag => tag.key == "width")[0].value, 10);
      var height = Number(art.tags.filter(tag => tag.key == "height")[0].value, 10);

      var card = new Card(this.div, art, {
    		title: "Untitled Art",
    		classes: "card-art card-art",
    		hideDetails: true,
    	});

    	// Create the holder for the svg
    	card.art = $("<div/>", {
    		class: "art-thumbnail",
    	}).appendTo(card.contents);

      card.picture = $("<canvas />", {
      }).appendTo(card.art);
      var ctx = card.picture[0].getContext('2d');
      var imgData = new ImageData(width, height);
      imgData.data.set(Uint8ClampedArray.from(art.art));

      ctx.putImageData(imgData, 0, 0);
    }
  }
};

module.exports = WebArtStoreView;
