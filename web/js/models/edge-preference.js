//Preference about the number of edges in an image
//Normallized back down from 0-1

var EdgePreference = Preference.extend({
  init: function(edginess){
    this._super(edginess);

    this.name = "EdgePreference" + this.id;
    //normalized, so we can use the default construction for a random preference
  },

  apply:function(art){
    if(art.edgeScore !== undefined && !Number.isNaN(art.edgeScore)){
      //the bot is looking for a certain amount of edginess.
      var edgeDiff = (art.edgeScore - this.preferredValue);

      console.log("Edge Differences: ");
      console.log(art.id + ": " + art.edgeScore, this.name + ": " + this.preferredValue, edgeDiff);

      //the smaller this difference gets, the more positive we want to rate the art
      return this.weight * (1 / Math.abs(edgeDiff));
    }else{
      //TODO: art doesn't have an edge score, so we can't deal with it.  It's
      //not beyond the pale to think that we might want to have a 'fallback'
      //calculation here, but right now, don't worry about it.
      this.handleUnableToEvaluate();
      console.log("Was unable to evaluate art " + art.id);
      return -1;
    }
  }
});
