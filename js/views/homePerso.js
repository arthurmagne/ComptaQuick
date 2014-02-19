define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!../../templates/homePerso.html',
  'views/accountsTab'
  ], function(bootstrap, holder, $, _, Backbone, homePersoTemplate, AccountsTabView){
  var HomePage = Backbone.View.extend({
    events: {
      'click #logout': 'logout',
      'click .drop-down-toggle': 'dropDownMenu'
    },

    el: '#page',

    render: function (options) {
      var template = _.template(homePersoTemplate, {user: options.user});
      this.$el.html(template);
      console.log("home perso avec comme model : ");
      console.log(options.user);
      var accountsTabView = new AccountsTabView();
      accountsTabView.render();

    },

    logout: function (event) {
      event.preventDefault(); 

      var that = this;
      $.ajax({
        url: "api/index.php/logout",
        type:'GET',
        statusCode: {
          200: function (response) {
            console.log("Déconnexion réussie.");
            that.close();
            Backbone.View.prototype.goTo('/#');

          },
          401: function (response) {
            that.error_msg.html("Erreur lors de la déconnexion.");
         }
        },
        success:function (data) {
          console.log(["Sign-up request details: ", data]);
        }
      });
    },

    dropDownMenu: function (event) {
      event.preventDefault();
      $('.drop-down-menu').toggleClass('show');

    },


    close: function () {
      $(this.el).unbind();
      $(this.el).empty();
    }

  });

  // Our module now returns our view
  return HomePage;
});