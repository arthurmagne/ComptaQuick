define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!../../templates/signUp.html'
  ],

  function(bootstrap, holder, $, _, Backbone, signUpTemplate){
    var HomePage = Backbone.View.extend({
    events: {
      'click .close-sign-up': 'close',
      'click #subscribeBtn': 'registration'
    },

    el: '#connexion-form',
    
    render: function () {
      var template = _.template(signUpTemplate);
      this.$el.html(template);
      setTimeout(function() {
        $("#sign-up-form").addClass("disp");
      }, 1000);   
    },

    close: function () {
      $(this.el).unbind();
      $(this.el).empty();
    },

    attributes: function() {
      return {
        lastname: $(".sign-up-form input[name='lastname']").val(),
        firstname: $(".sign-up-form input[name='firstname']").val(),
        email: $(".sign-in-form input[name='email']").val(),
        password: $(".sign-in-form input[name='password']").val(),
        passwordv: $(".sign-in-form input[name='passwordv']").val(),
        captcha: $(".sign-up-form input[name='captcha']").val()
       };
     },

    registration: function (event) {
      event.preventDefault(); // Don't let this button submit the form
      var url = 'api/index.php/subscribe';
      console.log('Subscribing ... ');
      var that = this;
      console.log(JSON.stringify(this.attributes()));
      console.log(this.attributes().lastname);
      console.log(this.attributes().firstname);
      console.log(this.attributes().email);
      console.log(this.attributes().password);
      console.log(this.attributes().passwordv);
      console.log(this.attributes().captcha);
      $.ajax({
        url:url,
        type:'POST',
        dataType:"json",
        data: JSON.stringify(this.attributes()),
        statusCode: {
          200: function (response) {
            console.log("Enregistrement réussie. ;)");
            Backbone.View.prototype.goTo('#/perso');
            that.close();
          },
          401: function (response) {
            alert('Get out !! >o< ');
          }
        },
        success:function (data) {
          console.log(["Login request details: ", data]);
         
          if(data.error) {  // If there is an error, show the error messages
            $('.alert-error').text(data.error.text).show();
          }
          else { // If not, send them back to the home page
            Backbone.View.prototype.goTo('#/sign-up');
          }
        }
      });
    }
  });

  // Our module now returns our view
  return HomePage;
});