var artPerGenerator = 10;
var botsPerSim = 7;

// setup panel UI
$(document).ready(function() {
	$(".panel").draggable({
		start: function(e) {
			$(".panel").removeClass("selected");
			$(this).addClass("selected");
		},
		handle: ".panel-header"
	})

	$(".panel").click(function() {
		$(".panel").removeClass("selected");
		$(this).addClass("selected");
	});

	/*
	 * bot panel
	 */
	$("#bot-panel-addgenerator").click(function() {
		// Add a generator
	});

	$("#bot-panel-reroll").click(function() {
		// Reroll a bot
		createRandomBot(function(bot) {
			selectBot(bot);
		});
	});

	$("#bot-panel-rerollart").click(function() {


	});
	console.log("ready");
	console.log("Create " + botsPerSim + " bots");
	for (var i = 0; i < botsPerSim; i++) {
		createRandomBot(function(bot) {

			bot.toView($("#bot-panel-botviews"));
			selectBot(bot);

		});

	}

});

function selectGrammar(grammar) {
	console.log("select " + grammar);
	sim.selectedGrammar = grammar;
	$(".grammar-view").removeClass("selected");
	$(".grammar-view" + grammar.id).addClass("selected");

	sim.selectedGrammar.toArtView($("#bot-panel-artviews"));
}

function selectBot(bot) {
	console.log("select " + bot);
	sim.selectedGrammar = bot;
	// Fill out the bot inspector info
	$("#bot-panel-thumbnail").html(bot.toSVGPortrait());
	$("#bot-panel-name").html(bot.name);

	$(".bot-view").removeClass("selected");
	$(".bot-view" + bot.id).addClass("selected");

	// View the art generators
	var grammarViews = $("#bot-panel-grammarviews");
	grammarViews.html("");
	$.each(bot.grammars, function(index, grammar) {
		grammar.toView(grammarViews);

	});

	selectGrammar(bot.grammars[0]);


}
