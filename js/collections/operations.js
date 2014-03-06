
define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone',    // lib/backbone/backbone
  'models/operation'
  ], function($, _, Backbone, Operation){
   var Operations = Backbone.Collection.extend({

    model : Operation,

    initialize: function(options) {

      if (options){
        this.dateDebut = options.dateDebut;
        this.dateFin = options.dateFin;
        this.maxOpe = options.maxOp;
        this.typeOpe = options.typeOpe;
        this.accountId = options.accountId;
      }
    },
    url: function() {
      /*if (this.maxOpe){
        return 'api/index.php/operation/limited/' + this.maxOpe;
      }else if (this.typeOpe){
        return 'api/index.php/operation/byType/' + this.typeOpe;
      }else if (this.dateDebut && this.dateFin){
        return 'api/index.php/operation/byDate/' + this.dateDebut + '/' + this.dateFin;
      }*/
      console.log("Id pour collection operations : ",this.accountId);
      return 'api/index.php/operation/all/' + this.accountId;
    }
	

  });
  // Above we have passed in jQuery, Underscore and Backbone
  // They will not be accessible in the global scope
  return Operations;
  // What we return here will be used by other modules
});

