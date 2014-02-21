define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone'    // lib/backbone/backbone
], function($, _, Backbone){
	var Account = Backbone.Model.extend({
 
    initialize: function(options) {

        if (options){
            this.accountId = options.id;
        }
        // set the id of this model !!
        this.set('id', this.get("account_id"));


        
    },
    url: function() {
        if (this.accountId){
            return 'api/index.php/account/' + this.accountId;
        }
        if (this.get("id")){
            return 'api/index.php/account/' + this.get("id");
        }

        console.log("Aucun accountId");
        return 'api/index.php/addAccount';
    } 	
    });
  // Above we have passed in jQuery, Underscore and Backbone
  // They will not be accessible in the global scope
    return Account;
  // What we return here will be used by other modules
});

