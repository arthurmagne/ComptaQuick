define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone'    // lib/backbone/backbone
], function($, _, Backbone){
	var Account = Backbone.Model.extend({
 
    initialize: function(options) {

        if (options){
            this.accountId = options.accountId;
        }
    },
    url: function() {
        if (this.userId){
            return '/account/' + this.accountId;
        }
        console.log("Aucun userId");
    } 	
    });
  // Above we have passed in jQuery, Underscore and Backbone
  // They will not be accessible in the global scope
    return Account;
  // What we return here will be used by other modules
});

