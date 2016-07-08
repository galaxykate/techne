var sim = {
	artists: [],
	art: [],
	critics: [],
	critiques: [],
	preferenceGenerators: [],
	grammarGenerators: [],
};


function clearSim() {
	sim.artists = [];
	sim.art = [];
	sim.critics = [];
	sim.critiques = [];
	sim.preferenceGenerators = [];
	sim.grammarGenerators = [];
}

// Create artist generators (schools)
function createGrammarGenerators(count) {
	for (var i = 0; i < count; i++) {

		sim.grammarGenerators.push(new GrammarGenerator());
	}
}

function createPreferenceGenerators(count) {
	for (var i = 0; i < count; i++) {
		//pulled out the random preference generator, put in the color preference generator
		sim.preferenceGenerators.push(new ColorPreferenceGenerator());
	}
}


function createCritics(count) {
	for (var i = 0; i < count; i++) {
		console.log(sim.preferenceGenerators);
		var generator = getRandom(sim.preferenceGenerators);
		//set a color parameter here to make a critic that looks for a particular color
		sim.critics.push(new Critic({
			generator: generator
		}));
	}
}


function createArtists(count) {
	for (var i = 0; i < count; i++) {

		var generator = getRandom(sim.grammarGenerators);
		sim.artists.push(new Artist({
			grammarGenerator: generator
		}));
	}
}
// Each bot creates N arts
function createArt(count) {
	for (var i = 0; i < sim.artists.length; i++) {
		var art = sim.artists[i].createArt(count, function() {
			sim.art = sim.art.concat(art);
		});
		
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
function critAndSave(art, critic, sim){
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
	return 	sim.critiques.filter(function(crit) {
		return crit.art === art;
	});
}

/**
 * Get the pixel values for a particular art.
 * TODO: this might not be where this function wants to live forever, but it's
 * where it lives right now
 * @param  {object} 	art An SVG Art
 * @param	 {Function} callback	a function to do something with the art after we shoved pixel data in it
 * @param  {Array}		params		optional arguments to the callback, in addition to the art
 * @return {Array}     the pixel data for this art
 */
function svgToPixels(art, callback, params){
	if(!art.svg){
		console.log("Art doesn't have an SVG representation!");
		return;
	}
	var svg = $(art.svg)[0];
	//console.log(typeof art.svg);
	var serializer = new XMLSerializer(); //TODO: probably don't need to do this every time
                                        //find a good place to store scoped objects
  var svgData = serializer.serializeToString(svg);

  //create a canvas and get a context
  var canvas = createCanvas(); //comes from techne-common.js, it's a domain independent way to get a canvas-like obj

	// set canvas size to svg size
  // var svgSize = svg.getBoundingClientRect();
	//console.log(svg.viewBox.baseVal);
	//console.log(svgSize);
  canvas.width = svg.viewBox.baseVal.width;
  canvas.height = svg.viewBox.baseVal.height;

  //...now get the context
  var ctx = canvas.getContext('2d');

  //convert svg data to an img element.
  var img = createImg(); //comes from techne-common.js, it's a domain independent way to get a img-like obj
  img.setAttribute( "src", "data:image/svg+xml;base64," + window.btoa(svgData)); //TODO: find a domain independent way to do this as well

	//console.log(img);
  //load the svg data as an image
  img.onload = function(){
    //after loading...
    //draw the image to the canvas
    ctx.drawImage(img, 0, 0);
    //get the pixel data as r,g,b,a
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    //pack all important info into an object to send off to a callback.
    //Width and Height can let us do reconstructions of the original image if we want
    var imageInfo = {
      data: pixels,
      width: canvas.width,
      height: canvas.height
    };

		//shove the pixel data into the art
		art.pixels = imageInfo.data;

    //apply the callback
    //TODO: right now, we just care about the raw pixels
    callback(art, ...params);
  };
}
