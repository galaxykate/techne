/**
 * A sample evaluator, this one does colors
 */
/*jshint esversion: 6*/

var commonlib = require("../commonlib");
var ColorPreference = function(hue){
  if(!hue){
    this.preferredValue = Math.floor(Math.random() * 360);
  }else{
    this.preferredValue = hue;
  }
};

ColorPreference.prototype = {
  setHuePreference: function(hue){
    this.preferredValue = hue;
  },

  apply: function(art){

    return new Promise((resolve, reject) => {
      var artHueDistribution = this.calculateHueDistribution(art);
      //first, get the quality for the preferred value
      //copied from Techne v2 getQualityFor()
      var qual = 0;
      var total = 0;
      var p = ((this.preferredValue / 360) * artHueDistribution.length);
      for (var i = 0; i < artHueDistribution.length; i++) {
        var d = Math.abs(p - i);


        var v = 20 * (artHueDistribution[i]) / (d * d + 1);
        total += v;
      }

      resolve(total);
    });
  },

  calculateHueDistribution: function(art){
    var pixelData = art.art.pixels; //get pixels!

    //code pulled from techne v2, calculateHueDist()
    var hueDist = [];
    var bucketCount = 24;
    var total = 0;
    for (let i = 0; i < bucketCount; i++) {
      hueDist[i] = 0;
    }

    var spacing = 1000;
    var w = Number(art.art.width);
    var h = Number(art.art.height);
    var xTiles = Math.floor(w / spacing);
    var yTiles = Math.floor(h / spacing);

    var pixelCount = pixelData.length / 4;

    for (let i = 0; i < pixelCount / spacing; i++) {
      var start = i * 4 * spacing;
      start *= 1;
      var r = pixelData[start];
      var g = pixelData[start + 1];
      var b = pixelData[start + 2];

      var c = commonlib.rgb2hsl([r, g, b]);
      //console.log(c);
      //console.log(c + " " + r + ", " + g + ", " + b);
      var bucket = Math.floor((c[0] / 360) * bucketCount);
      var strength = (c[1] / 100) * (1 - 0.02 * Math.abs(50 - c[2]) * 0.01);

      //console.log(c.sat + " " + c.value + " " + bucket + " " + strength);

      hueDist[bucket] += 1 * strength;
      hueDist[bucket] *= 0.9;
      total += 1;
    }

    for (let i = 0; i < bucketCount; i++) {
      hueDist[i] /= total;
    }

    return hueDist;
  }
};
module.exports = ColorPreference;
