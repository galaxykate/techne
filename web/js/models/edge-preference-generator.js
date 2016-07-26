// a generator to make more edge preferences!

var EdgePreferenceGenerator = PreferenceGenerator.extend({
  init: function(edginess){
    this._super();
    this.name = "EdgePreferenceGenerator" + this.id;

    if(edginess){
      this.prefEdge = edginess;
    }
  },

  generate: function(edginess){
    var favEdge;
    if(edginess){
      favEdge = edginess;
    }else if(this.prefEdge){
      favEdge = this.prefEdge;
    }else{
      //no edginess provided :(
      console.log("Edge preference generator was not supplied any constraints on edge preferences");
    }

    return new EdgePreference(favEdge);
  }
});
