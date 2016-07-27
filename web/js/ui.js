var ui = {
	cards: [],
	mode: null

};
var modes = {
	"module1": {
		title: "Module1: Artists",
		onStart: function() {
			// Create n bots
			clearSim();
			createPreferenceGenerators(1);
			createArtists(1);
			createArt(20, function(createdArt) {

				$.each(sim.artists, function(index, artist) {
					createArtistCard(ui.sideHolder, artist);
				});
				$.each(sim.art, function(index, art) {
					createArtCard(ui.mainHolder, art);
				});

				var artist = sim.artists[0];
				sortAndDisplayOwnFavorites(artist);
			});



		},
	},

	"module2": {
		title: "Module2: Critics",
		onStart: function() {
			// Create n bots
			clearSim();
			createPreferenceGenerators(1);

			createCritics(2);

			createArtists(1);
			createArt(8, function() {
				critiqueAll();

				$.each(sim.critics, function(index, critic) {
					createCriticCard(ui.sideHolder, critic);
				});
				$.each(sim.art, function(index, art) {
					art.renderToPixels(function() {
						createArtCard(ui.mainHolder, art);
					});
				});

				$.each(sim.critics, function(index, critic){
					sortAndDisplayCriticFavorites(critic, critic.critiques, critic.card.contents);
				});
			});
		},
	}
};

/*
 * User selections and highlights
 */
function sortAndDisplayOwnFavorites(artist) {
	return sortAndDisplayArtistFavorites(artist, artist.art, artist.card.contents, true);
}

function sortAndDisplayCriticFavorites(critic, allCrits, holder, graph){
	holder.html("");

	var ratedArt = allCrits.map(function(crit){

		return {
			art: crit.art,
			rating: crit.evaluation
		};
	});
	ratedArt.sort(function(a, b) {
		return b.rating - a.rating;
	});

	displaySortedArt(ratedArt, holder, graph);
}
function sortAndDisplayArtistFavorites(artist, allArt, holder, graph) {
	holder.html("");


	// Clone the art
	var ratedArt = allArt.map(function(art) {
		return {
			art: art,
			rating: artist.evaluateArt(art)
		};
	});



	ratedArt.sort(function(a, b) {
		return b.rating - a.rating;
	});
	displaySortedArt(ratedArt, holder, graph);
}

function displaySortedArt(ratedArt, holder, graph){
	var total = 0;
	var stats = $("<div/>", {
		class: "stats",
	}).appendTo(holder);

	ratedArt.map(function(rated) {
		var rating = rated.rating;
		total += rating;

		var art = rated.art;

		var mini = $("<div/>", {
			class: "art-minithumbnail",
		}).appendTo(holder);

		var thumb = art.image.clone().css({
			width: art.size.x * 0.7,
			height: art.size.y * 0.7
		}).appendTo(mini);

		var miniRating = $("<div/>", {
			class: "art-minirating rating-chip",
			html: "&#9829;" + rating.toFixed(2)
		}).appendTo(mini);

		if (graph){
			createGraph(mini, art.contrastDist);
		}

	});

	var avg = total / ratedArt.length;
	stats.html(avg.toFixed(2) + " avg score");
	return {
		avg: avg
	};
}

function selectCritic(critic) {
	console.log("select critic");
	$(".card-critic").removeClass("selected");
	$(".card-critic" + critic.id).addClass("selected");
	ui.selectedCritic = critic;
}

/*
function selectArt(art) {
	$(".card-art").removeClass("selected");
	$(".card-art" + art.id).addClass("selected");
	ui.selectedArt = art;
}
*/

/*
 * Create cards for individual art
 */
function createArtCard(holder, art) {
	var card = new Card(holder, art, {
		title: art.toString(),
		classes: "card-art card-art" + art.id,
		hideDetails: true,
	});

	// Create the holder for the svg
	card.art = $("<div/>", {
		class: "art-thumbnail",
		html: art.svg
	}).appendTo(card.contents);

	card.title.click(function() {
		openDetails();
	});

	// Critique
	card.critique = $("<div/>", {
		class: "art-critiquecolumn rating-chip",
	}).appendTo(card.contents).hide();


	function closeDetails() {
		card.artDebugInfo.remove();
		card.pixelBar.remove();
		card.artCalculations.remove();
		card.treeView.remove();

	}

	function openDetails() {
		// View test information on this art
		card.artDebugInfo = $("<div/>", {
			class: "art-thumbnail art-thumbnail-large",
		}).appendTo(card.contents);

		card.pixelBar = $("<div/>", {
			class: "pixelbar",
		}).appendTo(card.artDebugInfo);

		card.artCalculations = $("<div/>", {
			class: "art-calculations",
		}).appendTo(card.artDebugInfo);

		// Critique
		card.treeView = $("<div/>", {
			class: "art-treeholder",
		}).appendTo(card.contents);

		var node = new UINode(art.tree, card.treeView);

		function drawPixelData() {
			card.artDebugInfo.append(art.image);
			art.image.css({
				width: art.size.x * 2,
				height: art.size.y * 2
			});

			// Draw pixels
			var spacing = 55;
			var w = art.size.x;
			var h = art.size.y;
			var xTiles = Math.floor(w / spacing);
			var yTiles = Math.floor(h / spacing);

			var pixelCount = art.pixelData.length / 4;


			for (var i = 0; i < pixelCount / spacing; i++) {
				var start = i * 4 * spacing;
				start *= 1;
				var r = art.pixelData[start];
				var g = art.pixelData[start + 1];
				var b = art.pixelData[start + 2];

				$("<div/>", {
					class: "pixelbar-swatch"
				}).appendTo(card.pixelBar).css({
					backgroundColor: "rgb(" + r + "," + g + "," + b + ")"
				});
			}


			for (var i = 0; i < art.calculations.length; i++) {
				var val = art.calculations[i];
				if(i == 0){
					//scale the contrast score back to [0,1]
					val = linearScale([0, 21], [0, 1], val);
				}
				//probably something smart to do with edginess, but meh.
				var c = new KColor(val * 0.7 + 0.8, 1.2 - 0.6 * val, 0.5 + 0.5 * val);

				$("<div/>", {
					class: "art-calculationswatch",
					html: art.calculations[i].toFixed(2)
				}).appendTo(card.artCalculations).css({

					color: c.toCSS(-0.5, 0),
					backgroundColor: c.toCSS(0.2, 0)
				});

			}
		}

		function updateCritiqueUI() {
			// Make dots for each critique
			var critiques = getCritsFor(art);
			$.each(critiques, function(index, crit) {
				var dot = $("<div/>", {
					html: evalToEmoji(crit.evaluation),
					class: "art-critdot",
				}).appendTo(card.critique).css({
					backgroundColor: "hsl(" + (380 + crit.evaluation * 170) % 360 + ",100%," + (crit.evaluation * 50 + 20) + "%)"
				}).click(function() {
					selectCritic(crit.critic);
					selectArt(crit.art);
				});
			});
		}
		// Is the pixel data set yet?
		if (!art.pixelData) {
			console.log("load pixel data");
			art.renderToPixels(function() {
				updateCritiqueUI();
				drawPixelData();
			});
		} else {
			console.log("pixel data already loaded");
			drawPixelData();
			updateCritiqueUI();
		}


	}

	//card.contents.html("foo");
	ui.cards.push(card);

}

function createCriticCard(holder, critic) {
	var card = new Card(holder, critic, {
		title: critic.toString(),
		classes: "card-critic card-critic" + critic.id,
		hideDetails: true,
	});

	//we have a few different types of critics, which changes how we showcase critics and art and stuff
	if(critic.preference.name.includes("ColorPreference")){
		var hue = critic.preference.preferredValue * 360;
		console.log("Trying to display preferred hue ", hue);
		card.favoriteColor = $("<div/>", {
			class: "card-info",
			html: "favorite hue: <span STYLE='font-weight:bold;color:hsl(" + hue + ",90%,70%);background:hsl(" + hue + ",90%,30%)'>" + hue.toFixed(2) + "</span>"
		}).appendTo(card.title);
	}
	if(critic.preference.name.includes("ContrastPreference")){
		var contrast = critic.preference.preferredValue;
		console.log("Trying to display preferred contrast: ", contrast);
		card.favoriteContrast = $("<div/>", {
			class: "card-info",
			html: "favorite contrast ratio: <span STYLE='font-weight:bold'>" + contrast.toFixed(2) + "</span>"
		}).appendTo(card.title);
	}
	if(critic.preference.name.includes("EdgePreference")){
		var edginess = critic.preference.preferredValue;
		console.log("Trying to display preferred edginess: ", edginess);
		card.favoriteContrast = $("<div/>", {
			class: "card-info",
			html: "favorite edginess: <span STYLE='font-weight:bold'>" + edginess.toFixed(2) + "</span>"
		}).appendTo(card.title);
	}
	critic.card = card;

	ui.cards.push(card);

}



function createArtistCard(holder, artist) {
	var card = new Card(holder, artist, {
		title: artist.toString(),
		classes: "card-artist card-artist" + artist.id,
		hideDetails: true,
		useControls: true
	});
	artist.card = card;

	card.contents.html("");



	// Favorite color swatch
	card.favColor = $("<div/>", {
		html: "",
		class: "colorswatch"
	}).appendTo(card.title).click(function() {
		artist.favoriteHue = Math.random();
		setSwatchColor();
		sortAndDisplayOwnFavorites(artist);

	});

	function setSwatchColor() {
		card.favColor.css({
			backgroundColor: toCSSHSLA(artist.favoriteHue, 1, 0.5, 1)
		});
	}
	setSwatchColor();

	console.log(toCSSHSLA(artist.favoriteHue, 1, 1, 1));
	// controls ↻
	card.addArt = $("<button/>", {
		html: "+"
	}).appendTo(card.customControls);
	card.refreshArt = $("<button/>", {
		html: "↻"
	}).appendTo(card.customControls).click(function() {
		// reroll grammar

		var artCount = 20;
		var count = 0;
		var bestGrammar = artist.grammar;
		var bestScore = 0;

		var interval = setInterval(function() {
			artist.rerollGrammar();
			createArt(artCount, function() {

				var stats = sortAndDisplayOwnFavorites(artist);
				console.log(count + ": " + stats.avg)

				if (stats.avg > bestScore) {
					bestGrammar = artist.artGrammars[0];
					bestScore = stats.avg;
					console.log("NEW BEST " + count + ": " + stats.avg);
				}
				count++;
			});

			if (count > 40) {
				clearInterval(interval);
				artist.artGrammars[0] = bestGrammar;
				createArt(artCount, function() {
					var stats = sortAndDisplayOwnFavorites(artist);
				});

				console.log("BEST: " + artist.artGrammars[0].id + " " + bestScore);
			}
		}, 600);


	});


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
	});

	// Set the current mode to whatever the last mode was
	var lastMode = localStorage.getItem("lastMode");
	if (!lastMode)
		lastMode = "module1";
	switchMode(lastMode);


}

// Switch the mode (and save state to localstorage)
function switchMode(mode) {
	var modeData = modes[mode];
	if (!modeData) {
		console.log("No mode found for " + mode);
	} else {
		ui.mode = modeData;
		console.log("Start: " + modeData.title);

		// Set the title and clear the UI
		$("#left-col > .section-header > .section-title").html(modeData.title);
		$("#main-entities").html("");
		$("#side-entities").html("");

		// Custom behavior
		modeData.onStart();

		// Record as the last mode
		localStorage.setItem("lastMode", mode);

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
};


function createGraph(holder, buckets) {
	var graph = $("<div/>", {
		class: "graph"
	}).appendTo(holder);

	var max = -99999;
	for (var i = 0; i < buckets.length; i++) {
		max = Math.max(buckets[i], max);
	}



	$.each(buckets, function(index, bucket) {
		var pct = index / buckets.length;
		var barHolder = $("<div/>", {
			class: "graph-barholder"
		}).appendTo(graph).css({
			backgroundColor: toCSSHSLA(pct, 0.3, 0.2, 1)
		});

		var barFill = $("<div/>", {
			class: "graph-barfill"
		}).appendTo(barHolder).css({
			height: (bucket * 100 / max) + "%",
			backgroundColor: toCSSHSLA(pct, 1, 0.6, 1)
		});

	});
}

function evalToEmoji(ev) {

	if (ev < 0.1)
		return "💀";
	if (ev < 0.2)
		return "💩";
	if (ev < 0.4)
		return "😐";
	if (ev < 0.6)
		return "👍";
	if (ev < 0.8)
		return "🙌";
	return "💯";

}
