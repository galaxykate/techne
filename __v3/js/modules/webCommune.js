/**
 * A Web Commune is an environment for Techne.  It uses WebArtBots,
 * and a WebArtStores to simulate a running commune.
 * @author Johnathan
 *
 * @TODO this will probably need to be fleshed out somewhat.
 */

var WebArtStore = require('./artstore/webArtStore');
var WebVisualArtist = require('./artist/visualWebArtist');
var WebArtstoreView = require('./views/webArtstoreView');
/**
 * Constructor for a web commune.
 * @param {Number} botNum the number of bots in the commune.  This is an in-browser commune
 */
var WebCommune = function(botNum){
  this.arts = new WebArtStore(24);
  this.view = new WebArtstoreView(this.arts);
  this.members = [];
};

WebCommune.prototype = {

  /**
   * Add a new member to this commune
   * creates a new web art bot
   */
  addMember: function(){
    var newArtFriend = new WebVisualArtist(this.arts);   //WebArtists have a direct reference to the ArtStore
    this.members.push(newArtFriend);
  },

  /**
   * Set up a new Commune
   * @return {Undefined} Add some web artists, get them to create some art to kick off the Commune
   */
  initalize: function(){
    //FIXME hardcoded intalization constants.
    //Hopefully will be good enough to show at some point (probs not ADL)
    for(let i = 0; i < 3; i++){
      this.addMember();
      var newArtist = this.members[i];
      for(let j = 0; j < 3; j++){
        newArtist.createNewArt(); //Returns a promise, but we don't need to do anything with that here.
      }
    }

    //FIXME fast logging so I can get a build of this off the ground
    console.log(this.members);
    console.log(this.arts);
  }
};

module.exports = WebCommune;
