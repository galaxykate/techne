var artPerGenerator = 5;
var botsPerSim = 2;

// setup panel UI
$(document).ready(function() {
	$(".panel").draggable({
		start: function(e) {
			$(".panel").removeClass("selected");
			$(this).addClass("selected");
		},
		handle: ".panel-header"
	});

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
		// reroll this bot's art
		//sim.selectedBot

	});

	//=============================TODO REFACTOR.  SERIOUSLY =====================
	//create possible text for the crit panel
	sim.preferences = {};
	sim.preferences.ColorPreference = new ColorPreference();
	sim.preferences.EdgePreference = new EdgePreference();
	sim.preferences.ContrastPreference = new ContrastPreference();
	var colorCritDiv = $("<div/>", {
		class: "crit-colorholder",
		html: "favorite color "
	}).appendTo($("#critique-panel-crits"));
	var colorCritDot = $("<div/>", {
		class: "data bot-colordot"
	}).appendTo(colorCritDiv).click(function(){
		//set a new color preference
		sim.preferences.ColorPreference = new ColorPreference();
		$(".crit-colorholder .bot-colordot").css({
			backgroundColor: "hsla(" + sim.preferences.ColorPreference.preferredValue + ",90%,50%,1)"
		});
		updateCritPanel();
	});
	colorCritDot.css({backgroundColor: "hsla(" + sim.preferences.ColorPreference.preferredValue + ",90%,50%,1)"});
	//---------------------------------------------------------
	var edgeCritDiv = $("<div/>", {
		class: "crit-edgeholder",
		html: "favorite edginess "
	}).appendTo($("#critique-panel-crits"));
	var edgeCritValue = $("<div/>", {
		class: "data",
		html: sim.preferences.EdgePreference.preferredValue.toFixed(2)
	}).appendTo(edgeCritDiv).click(function(){
		//set a new color preference
		sim.preferences.EdgePreference = new EdgePreference();
		edgeCritValue[0].innerHTML = sim.preferences.EdgePreference.preferredValue.toFixed(2);
		updateCritPanel();
	});

	//----------------------------------------------------------
	var contrastCritDiv = $("<div/>", {
		class: "crit-contrastholder",
		html: "favorite contrast "
	}).appendTo($("#critique-panel-crits"));
	var contrastCritValue = $("<div/>", {
		class: "data",
		html: sim.preferences.ContrastPreference.preferredValue.toFixed(2)
	}).appendTo(contrastCritDiv).click(function(){
		//set a new contrast preference
		sim.preferences.ContrastPreference = new ContrastPreference();
		contrastCritValue[0].innerHTML = sim.preferences.ContrastPreference.preferredValue.toFixed(2);
		updateCritPanel();
	});
	$("<br/>").appendTo($("#critique-panel-crits"));
	//add in score divs.  Give them unique IDs.
	var critScoreDiv = $("<div/>", {
		class: "crit-scoreholder"
	}).appendTo($("#critique-panel-crits"));
	var critColorScore = $("<div/>", {
		class: "crit-score",
		id: "crit-colorscore"
	}).appendTo(critScoreDiv);

	var critEdgeScore = $("<div/>", {
		class: "crit-score",
		id: "crit-edgescore"
	}).appendTo(critScoreDiv);

	var critContrastScore = $("<div/>", {
		class: "crit-score",
		id: "crit-contrastscore"
	}).appendTo(critScoreDiv);
	//====================== END DESPERATE NEED TO REFACTOR =====================

	//=====================bound and built======================
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
	sim.selectedBot = bot;
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

	//$("#critique-panel-botdrop").html("");
	//bot.toView($("#critique-panel-botdrop"));

	selectGrammar(bot.grammars[0]);
}

function selectArt(art){
	console.log("Select " + art);
	sim.selectedArt = art;
	$("#critique-panel-artdrop").html("");
	art.toView($("#critique-panel-artdrop"));

	$(".art-view").removeClass("selected");
	$("#bot-panel-artviews > .art-view" + art.id).addClass("selected");
	updateCritPanel(art);
}

/**
 * Run all available critiques on the selected art, and add in controls for all of them
 * @param  {Object} art art to critique!
 * @return {None}     just update the view with some new data
 */
function updateCritPanel(art){
	if(art === undefined){
		art = sim.selectedArt;
	}
	//fast fail case.  We don't have an art selected right now.
	if(art === undefined){
		return;
	}
	var colorScore = sim.preferences.ColorPreference.apply(art);
	$("#crit-colorscore")[0].innerHTML = "Color Score: " + colorScore.toFixed(2);
	var edgeScore = sim.preferences.EdgePreference.apply(art);
	$("#crit-edgescore")[0].innerHTML = "Edge Score: " + edgeScore.toFixed(2);
	var contrastScore = sim.preferences.ContrastPreference.apply(art);
	console.log($("#crit-contrastscore"));
	$("#crit-contrastscore")[0].innerHTML = "Contrast Score: " + contrastScore.toFixed(2);
}
