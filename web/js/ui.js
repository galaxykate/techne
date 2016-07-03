var ui = {
	cards: [],
	mode: null

}
var modes = {
	"module1": {
		title: "Module1: Artists",
		onStart: function() {
			// Create n bots
			createGrammarGenerators(1);
			createArtists(3);
			createArt(8);

			$.each(sim.artists, function(index, artist) {
				createArtistCard(ui.sideHolder, artist);
			});
			$.each(sim.art, function(index, art) {
				createArtCard(ui.mainHolder, art);
			});
		},
	},

	"module2": {
		title: "Module2: Critics",
		onStart: function() {
			// Create n bots
			createPreferenceGenerators(1);
			createGrammarGenerators(1);

			createCritics(8);

			createArtists(3);
			createArt(8);

			critiqueAll();

			$.each(sim.critics, function(index, critic) {
				createCriticCard(ui.sideHolder, critic);
			});
			$.each(sim.art, function(index, art) {
				createArtCard(ui.mainHolder, art);
			});
		},
	}
}

/*
 * User selections and highlights
 */

function selectCritic(critic) {
	console.log("select critic")
	$(".card-critic").removeClass("selected");
	$(".card-critic" + critic.id).addClass("selected");
	ui.selectedCritic = critic;
}

function selectArt(art) {
	$(".card-art").removeClass("selected");
	$(".card-art" + art.id).addClass("selected");
	ui.selectedArt = art;
}

/* 
 * Create cards for individual art
 */
function createArtCard(holder, art) {
	var card = new Card(holder, art, {
		title: art.toString(),
		classes: "card-art card-art" + art.id,
				hideDetails: true,
	});

	card.art = $("<div/>", {
		class: "art-thumbnail",
		html: art.svg
	}).appendTo(card.contents);


	card.critique = $("<div/>", {
		class: "art-critiquecolumn",
	}).appendTo(card.contents);

	// Make dots for each critique
	var critiques = getCritsFor(art);
	console.log(critiques);

	$.each(critiques, function(index, crit) {
		var dot = $("<div/>", {
			html: evalToEmoji(crit.evaluation),
			class: "art-critdot",
		}).appendTo(card.critique).css({
			backgroundColor: "hsl(" + (crit.evaluation * 300) + ",100%,30%)"
		}).click(function() {
			selectCritic(crit.critic);
			selectArt(crit.art);
		});
	});

	/*
	 * Add details about the art
	 */
	card.artistInfo = $("<div/>", {
		class: "card-info",
		html: art.artist.toString()
	}).appendTo(card.details);

	card.codeHolder = $("<div/>", {
		class: "art-code",
	}).appendTo(card.details);

	card.code = $("<code/>", {
		text: art.svg
	}).appendTo(card.codeHolder);

	//card.contents.html("foo");
	ui.cards.push(card);

}

function createCriticCard(holder, critic) {
	var card = new Card(holder, critic, {
		title: critic.toString(),
			classes: "card-critic card-critic" + critic.id,
	hideDetails: true,
	});

	var hue = critic.preference.favoriteHue;
	card.favoriteColor = $("<div/>", {
		class: "card-info",
		html: "favorite hue: <span STYLE='font-weight:bold;color:hsl(" + (hue * 360) + ",90%,70%);background:hsl(" + (hue * 360) + ",90%,30%)'>" + hue.toFixed(2) + "</span>"
	}).appendTo(card.contents);


	ui.cards.push(card);

}



function createArtistCard(holder, artist) {
	var card = new Card(holder, artist, {
		title: artist.toString(),
				classes: "card-artist card-artist" + artist.id,
	hideDetails: true,
	});

	card.contents.html("");
	card.art = artist.art.map(function(art) {
		$("<div/>", {
			class: "art-minithumbnail",
			html: art.svg
		}).appendTo(card.contents)
	});



	// controls ↻
	card.addArt = $("<button/>", {
		html: "+"
	}).appendTo(card.customControls);
	card.refreshArt = $("<button/>", {
		html: "↻"
	}).appendTo(card.customControls);


	card.artistInfo = $("<div/>", {
		class: "card-info",
		html: "stuff about the artist"
	}).appendTo(card.details);

	//card.contents.html("foo");
	ui.cards.push(card);
}

function initUI() {
	ui.mainHolder = $("#main-entities");
	ui.sideHolder = $("#side-entities");
	var select = $("#select-mode");

	$.each(modes, function(key, val) {
		select.append("<option>" + key + "</option>");
	});

	select.change(function() {
		switchMode($(this).val());
	})
}

function switchMode(mode) {
	var modeData = modes[mode];
	if (!modeData) {
		console.log("No mode found for " + mode);
	} else {
		ui.mode = modeData;
		console.log("Start: " + modeData.title);
		$("#left-col > .section-header > .section-title").html(modeData.title);

		$("#main-entities").html("");
		modeData.onStart();


	}
}



// From https://jsfiddle.net/buksy/rxucg1gd/
// Parameters:
// code 								- (string) code you wish to format
// stripWhiteSpaces			- (boolean) do you wish to remove multiple whitespaces coming after each other?
// stripEmptyLines 			- (boolean) do you wish to remove empty lines?
var formatCode = function(code, stripWhiteSpaces, stripEmptyLines) {
	"use strict";
	var whitespace = ' '.repeat(4); // Default indenting 4 whitespaces
	var currentIndent = 0;
	var char = null;
	var nextChar = null;


	var result = '';
	for (var pos = 0; pos <= code.length; pos++) {
		char = code.substr(pos, 1);
		nextChar = code.substr(pos + 1, 1);

		// If opening tag, add newline character and indention
		if (char === '<' && nextChar !== '/') {
			result += '\n' + whitespace.repeat(currentIndent);
			currentIndent++;
		}
		// if Closing tag, add newline and indention
		else if (char === '<' && nextChar === '/') {
			// If there're more closing tags than opening
			if (--currentIndent < 0) currentIndent = 0;
			result += '\n' + whitespace.repeat(currentIndent);
		}

		// remove multiple whitespaces
		else if (stripWhiteSpaces === true && char === ' ' && nextChar === ' ') char = '';
		// remove empty lines
		else if (stripEmptyLines === true && char === '\n') {
			//debugger;
			if (code.substr(pos, code.substr(pos).indexOf("<")).trim() === '') char = '';
		}

		result += char;
	}

	return result;
}


function evalToEmoji(ev) {

	if (ev < .1)
		return "💀";
	if (ev < .2)
		return "💩";
	if (ev < .4)
		return "😐";
	if (ev < .6)
		return "👍";
	if (ev < .8)
		return "🙌";
	return "💯";

}