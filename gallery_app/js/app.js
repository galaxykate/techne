/**
 * @author Kate
 */

var communeAddress = "http://45.55.28.224:8080"
function getRandom(a) {
    return a[Math.floor(Math.random() * a.length)];
}

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


$(document).ready(function() {
    //start by getting all the artists currently in the commune.
    $.get(communeAddress + "/techne/artists", function(data, status, xhr){
        if(status == "success"){
            //we can now chain into the next request, which is to ask each artist for their art
            var holder = $("#artists");
            var artistList = data;
            for(var i = 0; i < artistList.length; i++){
                var artistLoc = artistList[i].location;
                //ask for all the artist's art
                $.get(artistLoc + "techne/artist/art", function(data, status, xhr){
                    if(status == "success"){
                        var div = $("<div/>", {
                            class : "artist card",

                        }).appendTo(holder);

                        var card = createCard({
                            title : data[0].artist.name; //We should get back an art array, although a smart person would check this first.  Also, this should be undefined.
                        });
                        card.div.appendTo(holder);
                        card.artHolder = $("<div/>", {
                            class : "art-holder"
                        }).appendTo(card.contents);

                        card.artHolder.html("");
                        //add the returned art to the newly created holder
                        $.each(data, function(index, art){
                            var artCard = createCard({
                                title : art.title
                            });
                            artCard.div.addClass("minicard");
                            artCard.div.appendTo(artHolder);
                            artCard.contents.append(art.content);
                        }
                    }else{
                        console.log("Failure to get an artist's art");
                        console.log(status);
                        console.log(data);
                    }
                }
            }
        }else{
            console.log("Failure to get list of artists in the commune.");
            console.log(status);
            console.log(data);
        }
    });
});
