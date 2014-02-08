define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!../../templates/signIn.html'
  ], function(bootstrap, holder, $, _, Backbone, signInTemplate){
  var HomePage = Backbone.View.extend({
    events: {
      'click .close-sign-in': 'close'
    },
    el: '#connexion-form',
    render: function () {
      var template = _.template(signInTemplate);
      this.$el.html(template);
      setTimeout(function() {
        $("#sign-in-form").addClass("disp");
      }, 1000);   
    },
    close: function () {
      $(this.el).unbind();
      $(this.el).empty();
    }
  });

  // Our module now returns our view
  return HomePage;
});