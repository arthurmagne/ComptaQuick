
define([
  // These are path alias that we configured in our bootstrap
  'jquery',                 // lib/jquery/jquery
  'underscore',             // lib/underscore/underscore
  'backbone',               // lib/backbone/backbone
  'backbone_offline',       // lib/backbone_offline/backbone.offline.js
  'models/operation'
  ], 

  function($, _, Backbone, Offline, Operation){
    var Operations = Backbone.Collection.extend({

    model : Operation,

    initialize: function(options) {
      // first param is a name of storage, second is a link to collection
      //this.storage = new Offline.Storage('localOperations', this/*, autoPush: true*/);

      if (options){
        this.dateDebut = options.dateDebut;
        this.dateFin = options.dateFin;
        this.maxOpe = options.maxOpe;
        this.typeOpe = options.typeOpe;
        this.accountId = options.accountId;
        this.payementType = options.payementType;
      }
    },
    saveAll: function( ) {
        // Loop over my collection...
        _(this.models).each( function(post) {
            // And POST for each object in the collection
            console.log("Iterate : ",post);
            //post.save();
        } );
    },

    url: function() {
      console.log("Id pour collection operations : ",this.accountId);
      if (this.accountId == undefined){
        return 'operations/byUser/' + this.accountId + '/' + this.maxOpe + '/' + this.typeOpe + '/' + this.dateDebut + '/' + this.dateFin + '/' + this.payementType;
      }
      // default case
      return 'operations/byAccount/' + this.accountId + '/' + this.maxOpe + '/' + this.typeOpe + '/' + this.dateDebut + '/' + this.dateFin + '/' + this.payementType;
    }
	

  });
  // Above we have passed in jQuery, Underscore and Backbone
  // They will not be accessible in the global scope
  return Operations;
  // What we return here will be used by other modules
});

