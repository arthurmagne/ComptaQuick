
define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone',    // lib/backbone/backbone
  'backbone_dualstorage',
  'models/operation'
  ], function($, _, Backbone, DualStorage, Operation){
    var Operations = Backbone.Collection.extend({
      
      model : Operation,

    /****** DUALSTORAGE *******/
    //remote: true // never cached, dualStorage is bypassed entirely
    //local: true  // always fetched and saved only locally, never saves on remote
    //local: function() { return trueOrFalse; } // local and remote can also be dynamic

      initialize: function(options) {

        if (options){
          this.dateDebut = options.dateDebut;
          this.dateFin = options.dateFin;
          this.maxOpe = options.maxOpe;
          this.typeOpe = options.typeOpe;
          this.accountId = options.accountId;
        }
      },
      
      url: function() {
      // TODO : tester si on a un id de compte ou d'user
        console.log("Id pour collection operations : ",this.accountId);
        return 'api/index.php/operations/byAccount/' + this.accountId + '/' + this.maxOpe + '/' + this.typeOpe + '/' + this.dateDebut + '/' + this.dateFin;
      }
    });

  // Above we have passed in jQuery, Underscore and Backbone
  // They will not be accessible in the global scope
  return Operations;
  // What we return here will be used by other modules
});

