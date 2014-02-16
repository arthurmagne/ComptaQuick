define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!../../templates/homePerso.html'
  ], function(bootstrap, holder, $, _, Backbone, homePersoTemplate){
  var HomePage = Backbone.View.extend({
    events: {
    },

    el: '#page',

    render: function (options) {
      var template = _.template(homePersoTemplate);
      this.$el.html(template);
      console.log("home perso avec comme model : ");
      console.log(options.user);

    }

  });

  // Our module now returns our view
  return HomePage;
});