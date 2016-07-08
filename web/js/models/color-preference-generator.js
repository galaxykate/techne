//extension of the generic preference generator
//@author Johnathan Pagnutti

//private methods, kinda!
function randColor(){
  //randomly come up with a color to have a preference about
  //encoded as a hex string
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);

  //bit math!  Concatinate the bits from r, then the bits from g, then the bits from b into one number,
  //then convert that number to a string
  return {r: r, g: g, b: b};
}

var ColorPreferenceGenerator = PreferenceGenerator.extend({
  init : function(){
    //optional parameter color.  We can either generate one here, or get a
    //color from elserwhere
    this._super();
    this.name = "ColorPreference" + this.id; //overwrite the names
  },

  generate: function(color){
    //generate a color preference
    //we may provide a color for the preference to use, but we also might not.
    //    We expect provided colors to be an object with r (0-255) g (0-255) b (0-255)
    var favColor;
    if(color){
      favColor = color;
    }else{
      favColor = randColor();
    }

    var preference = {
      favoriteHue: rgbTohsv(favColor).hue,  //these two bits are conflated somewhat.  favoriteHue is the hue reading from the  favoriteColor rgb
      favoriteColor: favColor,
      evaluate: function(art){
        //expecting that art has a property called pixels that has
        //pixel data for the art
        if(art.pixels){
          //TODO: assume rgba pixel structure, and right now we don't really care
          //about the alpha part
          var score = 0;
          console.log(this.favoriteColor);
          for(let i = 0; i < art.pixels.length; i += 4){
            if(this.favoriteColor.r == art.pixels[i] || this.favoriteColor.g == art.pixels[i+1] || this.favoriteColor.b == art.pixels[i+2]){
              score += 1;
            }
          }
          return score;
        }else{
          //TODO: talk about structure here.  Each preference, in it's closure, also
          //has a generic 'handle failure' function.
          handleUnableToEvaluate();
          return -1;
        }
      },

      handleUnableToEvaluate: function(){
        //what we do when we can't apply this preference to the art
        console.log("Unable to evaluate provided art object!");
      }
    };

    return preference;
  }
});
