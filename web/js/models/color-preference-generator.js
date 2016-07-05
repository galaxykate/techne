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

class ColorPreference extends PreferenceGenerator {
  constructor(){
    //optional parameter color.  We can either generate one here, or get a
    //color from elserwhere
    super();
    this.name = "ColorPreference" + this.id; //overwrite the names
  }

  generate(color){
    //generate a color preference
    //we may provide a color for the preference to use, but we also might not.
    //    We expect provided colors to be an object with r (0-255) g (0-255) b (0-255)
    var favHue;
    if(color){
      favHue = color;
    }else{
      favHue = randColor();
    }

    var preference = {
      favoriteHue: favHue,
      evaluate: function(art){
        //expecting that art has a property called pixels that has
        //pixel data for the art
        if(art.pixels){
          //TODO: assume rgba pixel structure, and right now we don't really care
          //about the width
          var score = 0;
          for(let i = 0; i < art.pixels.length; i += 4){
            if(r == art.pixels[i] && g == art.pixels[i+1] && b == art.pixels[i+2]){
              score += 1;
            }
          }
        }else{
          //TODO: talk about structure here.  Each preference, in it's closure, also
          //has a generic 'handle failure' function.
          handleUnableToEvaluate();
        }
      },
      handleUnableToEvaluate: function(){
        //what we do when we can't apply this preference to the art
        console.log("Unable to evaluate provided art object!");
      }
    };
  }
}
