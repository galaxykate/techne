//library of common functionality for Techne.
//may be some duplication between this and common.js, I just got very afraid of
//common.js.

//Sorry, Kate.

//library of useful functions to share across various modules

/**
 * Convert RGB to a hex string
 * @param  {Number} r red code
 * @param  {Number} g green code
 * @param  {Number} b blue code
 * @return {String}   hexidecimal string of the provided rgb
 */
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * convert a hex string (#rrggbb) to a color
 * @param  {string} hex hexidecimal string to convert to a color
 * @return {Object}     a color object that has color values mapped to r,g,b
 */
function hexToRgb(hex){
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(result){
    return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) };
  }
  return null;
}

/**
 * Create an HTML5 canvas like object
 * @return {Object} an object that functions very similarly to the HTML 5 canvas
 */
function createCanvas(){
  if(document && document.createElement){
    //we're in a context that supports creating the canvas with a browser
    //do that
    return document.createElement('canvas');
  }else{
    throw "Unable to create a HTML 5 canvas in this context!";
  }
}

/**
 * Function to create an HTML 5 img like object
 * @return {Object} an object that functions very similarly to the HTML 5 img tag
 */
function createImg(){
  if(document && document.createElement){
    //we're in a context that supports creating things like we would on a
    //browser
    return document.createElement("img");
  }else{
    throw "Unable to create a HTML5 img element in this context!";
  }
}

/**
 * Scale a value from a domain to a range
 * @param  {Array} domain [min, max] of domain
 * @param  {Array} range  [min, max] if range
 * @param  {Number} value  value to scale
 * @return {Number}        scaled value
 */
function linearScale(domain, range, value){
  return (((range[1] - range[0]) * (value - domain[0])) / (domain[1] - domain[0])) + range[0];
}

/*=======================================================================
PIXEL PROCESSING FUNCTIONS
=========================================================================*/
/**
 * Get a contrast ratio for a chunk of pixels
 * @param  {array} pixels pixel data
 * @return {Number}       a contrast ratio for these pixels!
 */
function getContrastRatio(pixels){
  //convert a pixel array to a set of relative lumanescence scores to use for contrast comparisons
  //https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
  var rgbWeights = [0.2126, 0.7152, 0.0722];
  var lumas = [];

  //right now, we're windowing over the whole art.
  for(let i = 0; i < pixels.length; i+=4){
    var rgbIntensities = [pixels[i] / 255, pixels[i+1] / 255, pixels[i+2] / 255];
    var luminescences = [];

    for(var j = 0; j < rgbIntensities.length; j++){
      var colorIntensity = rgbIntensities[j];
      if(colorIntensity <= 0.03928){
        luminescences.push(colorIntensity / 12.92);
      }else{
        luminescences.push(Math.pow((colorIntensity+0.055) / 1.055, 2.4));
      }
    }
    lumas.push((rgbWeights[0] * luminescences[0]) +
              (rgbWeights[1] * luminescences[1]) +
              (rgbWeights[2] * luminescences[2]));
  }

  //find the max and min relative lumanescence
  var maxIntensity = 0;
  var minIntensity = Number.MAX_VALUE;

  for(let i = 0; i < lumas.length; i++){
    if(lumas[i] > maxIntensity){
      maxIntensity = lumas[i];
    }

    if(lumas[i] < minIntensity){
      minIntensity = lumas[i];
    }
  }

  //finally, calculate the contrast ratio of the art
  //Again, from https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
  var contrastRatio = ((maxIntensity + 0.05) / (minIntensity + 0.05));

  //console.log("Calculated contrast ratio: ", contrastRatio);
  return contrastRatio;
}

/**
 * Get a pixel at a particular x/y location in an image of a particular
 * width/height.  Assumes rgba pixels
 * @param  {Array} pixels image pixels
 * @param  {Number} w      width
 * @param  {Number} h      image height
 * @param  {Number} x      x-location
 * @param  {Number} y      y-location
 * @return {Array}        pixel data for that location
 */
function getPixel(pixels, w, h, x, y){
   var idx = (x + y * w) * 4;
   return [pixels[idx], pixels[idx+1], pixels[idx+2], pixels[idx+3]];
}
