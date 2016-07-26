//Generic preference class for extending new bot preferences.
//
//Preferences expect that the object they're being told to evaluate contains the
//a parameter that maps with what they're looking for.
//Prefrences work in the [0, 1] range, with 0 being abject hatred and 1 being love
//@Author: Johnathan Pagnutti
var preferenceCount = 0;

var Preference = Class.extend({
  /**
   * Create a new preference
   * @param  {Number} score Optional.  Create this preference to be looking for a particular value
   *                        If not provided, preference will generate this score somehow
   * @return {Object}       A new preference Object
   */
  init : function(score){
    if(score){
      this.preferredValue = score;
    }else{
      this.preferredValue = Math.random();
    }

    this.id = preferenceCount++;
    this.name = "Preference" + this.id;
  },

  /**
   * Apply this preference to the provided art object.
   * This function is meant to be overloaded in extending classes!
   * @param  {Object} art an art object
   * @return {Number}     some sort of score that represents how far away the art is from the preferredValue
   */
   apply : function(art){
     throw "Preference.apply() should be overloaded in subclasses!";
   },

   /**
    * Function to call when a preference is unable to be applied to an art
    * This function is also meant to be overloaded in extending classes.
    * @return {None} probably doesn't return anything.
    */
   handleUnableToEvaluate : function(){
     console.log("Unable to apply " + this.name + " to the current art!");
   }
});
