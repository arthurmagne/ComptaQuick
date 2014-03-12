
define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone',
  'backbone_dualstorage',
  'models/account'    // lib/backbone/backbone
  ], function($, _, Backbone, DualStorage, Account){
   var Accounts = Backbone.Collection.extend({

    model: Account,

    /****** DUALSTORAGE *******/
    //remote: true // never cached, dualStorage is bypassed entirely
    //local: true  // always fetched and saved only locally, never saves on remote
    //local: function() { return trueOrFalse; } // local and remote can also be dynamic

    initialize: function(options) {

      /*this.model.bind("remove", function() {
          console.log("remove trigger");
          this.model.destroy({
            success: function () {
              console.log("Compte supprimée du serveur avec succès");
            }
          });
        });*/
    },

    url: function() {
      console.log("On va chercher l'url");

      
      return 'api/index.php/accounts';

    }
    
    
  });
  // Above we have passed in jQuery, Underscore and Backbone
  // They will not be accessible in the global scope
  return Accounts;
  // What we return here will be used by other modules
});

