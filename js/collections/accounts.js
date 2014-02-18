
define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone'    // lib/backbone/backbone
  ], function($, _, Backbone){
   var User = Backbone.Model.extend({

    initialize: function(options) {

      if (options){
        this.dateDebut = options.dateDebut;
        this.dateFin = options.dateFin;
        this.maxOpe = options.maxOp;
        this.typeOpe = options.typeOpe;
      }
    },
    url: function() {
      if (this.maxOpe){
        return '/account/limited/' + this.maxOpe;
      }else if (this.typeOpe){
        return '/artist/byType/' + this.typeOpe;
      }else if (this.dateDebut && this.dateFin){
        return '/artist/byDate/' + this.dateDebut + '/' + this.dateFin;
      }
      return '/artist/all';
    }
    
    url: 'api/index.php/accounts'
    
  });
  // Above we have passed in jQuery, Underscore and Backbone
  // They will not be accessible in the global scope
  return User;
  // What we return here will be used by other modules
});

