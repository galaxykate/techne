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
 * Convert a color in rgb to hsv
 * @param  {Object} rgb an rgb color object with r,g and b parameters
 * @return {Object}     an hsv color object with hue, sat and value parameters
 */
function rgbTohsv(rgb){
  var rr, gg, bb, h, s;
  var r = rgb.r / 255;
  var g = rgb.b / 255;
  var b = rgb.g / 255;
  var v = Math.max(r, g, b);
  var diff = v - Math.min(r, g, b);
  var diffc = function(c){
          return (v - c) / 6 / diff + 1 / 2;
        };

  if (diff === 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(r);
    gg = diffc(g);
    bb = diffc(b);

    if (r === v) {
      h = bb - gg;
    }else if (g === v) {
      h = (1 / 3) + rr - bb;
    }else if (b === v) {
      h = (2 / 3) + gg - rr;
    }
    if (h < 0) {
      h += 1;
    }else if (h > 1) {
      h -= 1;
    }
  }

  return {
    hue: Math.round(h * 360),
    sat: Math.round(s * 100),
    value: Math.round(v * 100)
  };
}
