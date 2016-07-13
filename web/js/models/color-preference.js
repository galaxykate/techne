//Wrapping a bot's color prefrence!
//Bots prefer a particular hue, currently, and score based on how much or how little
//of that hue is in the relavant art

var ColorPreference = Preference.extend({
  init: function(hue){
    this._super(hue);

    //overwrite the name
    this.name = "ColorPreference" + this.id;

    //if we weren't provided a hue, we just randomly plugged in a value for it that's not even
    //in the right range.  Let's fix that
    if(!hue){
      this.preferredValue = Math.random(); //yes, this has already been calculated, but this makes a good example for
                                            //other preferences where the preferred value isn't in the exact same [0, 1)
                                            //range as Math.random()
    }
  },

  apply: function(art){
    //art _should_ have already calculated any metrics that require it's pixel data
    if(art.hueDist){
      var bucketCount = art.hueDist.length;
      var favBucket = Math.floor((this.preferredValue) * bucketCount);
      var rating = art.hueDist[favBucket] * bucketCount;
      return rating;
    }else{
      //TODO: I feel like, as part of Techne, we can't assume that any art
      //another bot has actually has the pre-calculated information we'd like it
      //to have.  A fallback here seems useful.
      this.handleUnableToEvaluate();
      console.log("Provided art was " + art.id);
      return -1;
    }
  }
});
