//Client side javascript... script to display the arts that have been loaded by the server into a hidden div

//function to create an artist card
function createCard(data) {
      var card = {};
      card.div = $("<div/>", {
          class : "card"
      });
  
      card.header = $("<div/>", {
          class : "header"
      }).appendTo(card.div);
  
      card.title = $("<div/>", {
          class : "title",
          html : data.title
      }).appendTo(card.header);
  
      card.details = $("<div/>", {
          class : "details",
          html : data.details
      }).appendTo(card.header);
  
      card.contents = $("<div/>", {
          html : data.contents,
          class : "contents"
      }).appendTo(card.div);
      return card;
 }


//function to pull data from the data div and insert it into the content cards
$(document).ready(function(){
    var artList = JSON.parse("[" + $("#art-data").html() + "]");
    console.log("Number of artists whose art we are displaying...");
    console.log(artList.length);
    var holder = $("#artists");
    holder.html("");
    for(var i = 0; i < artList.length; i++){
        // for each list of arts in the art list...
        displayArts(artList[i], holder);
    }
});


//Display a list of arts from an artist!
function displayArts(artList, holder){
    var div = $("<div/>", {
        class: "artist card"
    }).appendTo(holder);
     
    var card = createCard({
        title: artList[0].artist //something like this eventually
    });
    card.div.appendTo(div);
        
    card.artHolder = $("<div/>", {
        class : "art-holder"
    }).appendTo(card.contents);
    card.artHolder.html("");

    for(var i = 0; i < artList.length; i++){ 
        var artCard = createCard({
            title: artList[i].title
        });
        artCard.div.addClass("minicard");
        artCard.div.appendTo(card.artHolder);
        artCard.contents.append(artList[i].content);
    }    
}
