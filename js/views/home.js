define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!../../templates/home.html'
  ], function(bootstrap, holder, $, _, Backbone, homeTemplate){
  var HomePage = Backbone.View.extend({
    events: {
      'click .login-btn, .sign-up-btn': 'showConnexionForm'
    },

    el: '#page',

    render: function () {
      var template = _.template(homeTemplate);
      this.$el.html(template);
    },

    showConnexionForm: function () {
      console.log("add class show");
      $('#home-header, #home-footer').addClass('show');
    }

  });

  // Our module now returns our view
  return HomePage;
});