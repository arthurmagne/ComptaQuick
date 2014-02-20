define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone'    // lib/backbone/backbone
], function($, _, Backbone){
	var Operation = Backbone.Model.extend({
 
    initialize: function(options) {

        if (options){
            this.operationId = options.id;
        }
        // set the id of this model !! (no need for operation)
        //this.set('id', this.get("account_id"));


        
    },
    url: function() {
        if (this.operationId){
            return 'api/index.php/account/operation' + this.accountId;
        }
        if (this.get("id")){
            return 'api/index.php/account/operation' + this.get("id");
        }

        console.log("Aucun operation");
    } 	
    });
  // Above we have passed in jQuery, Underscore and Backbone
  // They will not be accessible in the global scope
    return Account;
  // What we return here will be used by other modules
});

