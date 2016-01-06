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


function getAllArt(artistList){
    //we can now chain into the next request, which is to ask each artist for their art
    var holder = $("#artists");
    for(var i = 0; i < artistList.length; i++){
        var artistLoc = artistList[i].location;
        //ask for all the artist's art
        $.get(artistLoc + "techne/artist/art", function(data, status, xhr){
            if(status == "success"){
                console.log("Got an artist's art!");
                console.log(data);
                var div = $("<div/>", {
                    class : "artist card",
                }).appendTo(holder);

                var card = createCard({
                    title : data[0].artist.name //We should get back an art array, although a smart person would check this first.  Also, this should be undefined.
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
                });
            }else{
                console.log("Failure to get an artist's art");
                console.log(status);
                console.log(data);
            }
        });
    }
}

$(document).ready(function() {
    //start by getting all the artists currently in the commune.
    console.log("Attempting to get a list of artists from");
    console.log(communeAddress + "/techne/artists");
    $.ajax({
        type: 'GET',
        url: communeAddress + "/techne/artists",
        cache: false,
        dataType: 'text',
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Got an error..."); 
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        },
        success: function(data, status, xhr){
            console.log("Got at list of artists!");
            console.log(status);
            console.log(data);
        }
    });
});
