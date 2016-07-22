var sim = {
	artists: [],
	art: [],
	critics: [],
	critiques: [],
	preferenceGenerators: [],

};

function clearSim() {

}

function createRandomBot(callback) {
	return new Bot(callback);
}




// Each bot creates N arts, and calls back when finished
function createArt(count, callback) {
	var finished = 0;

	var artistCount = sim.artists.length;
	var createdArt = [];

	function checkFinish(art) {
		createdArt.push(art);
		finished++;
		//console.log("finished art" + finished + "/" + artistCount * count);
		if (finished === artistCount * count) {
			//	console.log("Finished creating art ", createdArt);
			sim.art = sim.art.concat(createdArt);
			callback(createdArt);
		}
	}

	for (var i = 0; i < artistCount; i++) {
		for (var j = 0; j < count; j++) {
			sim.artists[i].createArt(checkFinish);

		}
	}
}



/**
 * Funtion to wrap the critic process and add the critique to the sim so we can see it
 * This is gross and weird because of how svgToPixels works-- that function is recusrive,
 * and I need to fit it into an interative wrapper.
 * provided critic critiques art and adds the critique to the provided sim's list
 * of critiques
 * @param  {Object} art    art to critique.  Art has a pixels member that has pixel data
 * @param  {Object} critic critic to provide a critique to art.
 * @param  {Object} sim    a sim context to add the critique too, used for seeing various critiques that have happened
 * @return {None}        		function just manipulated provided parameters, does not return anything
 */
function critAndSave(art, critic, sim) {
	var crit = critic.critiqueArt(art);
	sim.critiques.push(crit);
}

function critiqueAll() {
	for (var i = 0; i < sim.critics.length; i++) {
		for (var j = 0; j < sim.art.length; j++) {
			//a bit awkward.  The second parameter is a callback function that does what it needs to with the pixel data
			//the third is a parameter array to the second argument
			//woo smushing in a recusrive function into an interative context!
			svgToPixels(sim.art[j], critAndSave, [sim.critics[i], sim]);
		}
	}

}

function getCritsFor(art) {
	return sim.critiques.filter(function(crit) {
		return crit.art === art;
	});
}