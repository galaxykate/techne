//A contrast preference for a bot!
//
//Contrast preferences range from 0-21, based on the w3c's relative contrast
//ratio metric:
//https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef

var ContrastPreference = Preference.extend({
  init : function(contrastScore){
    this._super(contrastScore);

    //overwrite the name property
    this.name = "ContrastPreference" + this.id;
    //overwrite the preferredValue, if we need to randomly set it
    if(!contrastScore){
      this.preferredValue = Math.random() * 21;
    }
  },

  apply : function(art){
    if(art.contrastScore !== undefined && !Number.isNaN(art.contrastScore)){
      //get a distance
      var distance = art.contrastScore - this.preferredValue;
      //flip this, such that higher numbers mean we like the art more
      return 1 / (Math.abs(distance));
    }else{
      //TODO: it's not beyond the pale to want to see if we can calculate an art's contrast score right now.
      this.handleUnableToEvaluate();
      console.log("Provided art was " + art.id);
      return -1;
    }
  }
});
