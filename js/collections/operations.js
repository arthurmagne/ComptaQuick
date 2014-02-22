
define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone'    // lib/backbone/backbone
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
      }
    },
    url: function() {
      if (this.maxOpe){
        return '/account/limited/' + this.maxOpe;
      }else if (this.typeOpe){
        return '/account/byType/' + this.typeOpe;
      }else if (this.dateDebut && this.dateFin){
        return '/account/byDate/' + this.dateDebut + '/' + this.dateFin;
      }
      return '/account/all';
    }

  });
  // Above we have passed in jQuery, Underscore and Backbone
  // They will not be accessible in the global scope
  return Operations;
  // What we return here will be used by other modules
});

