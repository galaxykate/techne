/*
 *
 */

function svgToCanvas(svgString, canvas, callback) {
	var svg = $(svgString)[0];
	//console.log(typeof art.svg);
	var serializer = new XMLSerializer(); //TODO: probably don't need to do this every time
	//find a good place to store scoped objects
	var svgData = serializer.serializeToString(svg);
	//console.log(svgData);
	var ctx = canvas[0].getContext('2d');

	var img = $("<img/>", {
		width: canvas.width() + "px",
		height: canvas.height() + "px",

		src: "data:image/svg+xml;base64," + window.btoa(svgData)
	});

	//load the svg data as an image
	img[0].onload = function() {
		//after loading...
		//draw the image to the canvas
		ctx.drawImage(img[0], 0, 0);
		var pixels = ctx.getImageData(0, 0, canvas.width(), canvas.height()).data;
		//pack all important info into an object to send off to a callback.
		//Width and Height can let us do reconstructions of the original image if we want
		//pack all important info into an object to send off to a callback.
		//Width and Height can let us do reconstructions of the original image if we want
		var imageInfo = {
			data: pixels,
			width: canvas.width,
			height: canvas.height
		};

		//shove the pixel data into the art
		var pixels = imageInfo.data;

		callback(pixels, img);
	}
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
function svgToPixels(art, callback, params) {
	if (!art.svg) {
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
	img.setAttribute("src", "data:image/svg+xml;base64," + window.btoa(svgData)); //TODO: find a domain independent way to do this as well

	//console.log(img);
	//load the svg data as an image
	img.onload = function() {
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
		console.log(art.pixels);

		//apply the callback
		//TODO: right now, we just care about the raw pixels
		callback(art, ...params);
	};
}