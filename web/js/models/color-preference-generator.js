//extension of the generic preference generator
//@author Johnathan Pagnutti

var ColorPreferenceGenerator = PreferenceGenerator.extend({
  init : function(color){
    //optional parameter color.  We can either generate one here, or get a
    //color from elserwhere
    this._super();
    this.name = "ColorPreferenceGenerator" + this.id; //overwrite the names

    if(color){
      this.prefColor = color;
    }
  },

  generate: function(color){
    //generate a color preference
    //we may provide a color for the preference to use, but we also might not.
    //    We expect provided colors to be an object with r (0-255) g (0-255) b (0-255)
    var favColor;
    if(color){
      favColor = color;
    }else if(this.prefColor){
      favColor = this.prefColor;
    }else{
      //no color provided :(
      console.log("Color preference generator was not supplied any constraints on color preferences");
    }

    return new ColorPreference(favColor);
  }
});
