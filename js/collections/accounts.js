
define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone',
  'models/account'    // lib/backbone/backbone
  ], function($, _, Backbone, Account){
   var Accounts = Backbone.Collection.extend({

    model: Account,

    initialize: function(options) {

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

