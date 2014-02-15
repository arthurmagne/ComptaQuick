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
      'click .sign-up-btn': 'showConnexionForm',
      'click .login-btn': 'connectionAuto'
    },

    el: '#page',

    render: function () {
      var template = _.template(homeTemplate);
      this.$el.html(template);
    },

    showConnexionForm: function () {
      console.log("add class show");
      $('#home-header, #home-footer').addClass('show');
    },

    connectionAuto: function () {
      event.preventDefault(); // Don't let this button go to the login page
      console.log("Try to connect auto");
      var url = 'api/index.php/loginAuto';
      var that = this;
      $.ajax({
            url:url,
            type:'GET',
            statusCode: {
              200: function (response) {
                console.log("connection automatique réussie");
                that.close();
                Backbone.View.prototype.goTo('#/perso');
              },
              401: function (response) {
                console.log("connection automatique échouée");
                that.showConnexionForm();
                Backbone.View.prototype.goTo('#/sign-in');
                
              }
            },
            success:function (data) {
                console.log(["Login request details: ", data]);

            }
        });
    },

    close: function () {
      $(this.el).unbind();
      $(this.el).empty();
    }
    

  });

  // Our module now returns our view
  return HomePage;
});