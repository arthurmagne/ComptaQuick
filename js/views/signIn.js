define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  'backbone_auth',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!../../templates/signIn.html'
  ], function(bootstrap, holder, $, _, Backbone, BackboneAuth, signInTemplate){
  var HomePage = Backbone.View.extend({
    events: {
      'click .close-sign-in': 'close',
      'click #loginBtn': 'login'
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
    },

    attributes: function () {
      return {
        email: $(".sign-in-form input[name='email']").val(),
        password: $(".sign-in-form input[name='password']").val()
       };
    },

    login:function (event) {
        event.preventDefault(); // Don't let this button submit the form
        var url = 'api/index.php/login';
        console.log('Loggin in... ');
        var that = this;
        console.log(JSON.stringify(this.attributes()));
        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: JSON.stringify(this.attributes()),
            statusCode: {
              200: function (response) {
                console.log("connection réussie");
                Backbone.View.prototype.goTo('#/perso');
                that.close();
              },
              401: function (response) {
                 alert('Get out !!');
              }
            },
            success:function (data) {
                console.log(["Login request details: ", data]);
               
                if(data.error) {  // If there is an error, show the error messages
                    $('.alert-error').text(data.error.text).show();
                }
                else { // If not, send them back to the home page
                  Backbone.View.prototype.goTo('#/sign-in');
                }
            }
        });
    }
  });

  // Our module now returns our view
  return HomePage;
});


    