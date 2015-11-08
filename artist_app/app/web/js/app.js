/**
 * @author Kate
 */


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

    var bots = [];
    var bot = new Bot();
    bots.push(bot);

    $("#addArtist").click(function() {
        var bot = new Bot();
        bots.push(bot);
        $.ajax({
            type : "POST",
            data : bot.toData(),
            url : "http://127.0.0.1:8080/api/bears",

        }).then(function(data) {

            refreshArtists();
        });
    });

    $("#clearAll").click(function() {
        $.ajax({
            url : "http://127.0.0.1:8080/api/bears",

        }).then(function(data) {
            console.log("Got all bears for deletion");
            for (var i = 0; i < data.length; i++) {

                console.log("Delete " + data[i]._id);
                $.ajax({
                    type : "DELETE",

                    url : "http://127.0.0.1:8080/api/bears/" + data[i]._id,

                }).then(function() {

                    refreshArtists(data);
                });
            }
        });
    });
    function refreshArtists(data) {

        console.log("refresh artists");

        $.ajax({
            url : "http://127.0.0.1:8080/api/bears",

        }).then(function(data) {
            var holder = $("#artists");
            holder.html("");
            for (var i = 0; i < bots.length; i++) {
                bots[i].display(holder);
            }

        });

    }

    refreshArtists();
});
