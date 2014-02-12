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
        password: $(".sign-in-form input[name='password']").val(),
       };
    },

    login:function (event) {
        event.preventDefault(); // Don't let this button submit the form
        var url = 'api/index.php/login';
        console.log('Loggin in... ');


        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: this.attributes(),
            success:function (data) {
                console.log(["Login request details: ", data]);
               
                if(data.error) {  // If there is an error, show the error messages
                    $('.alert-error').text(data.error.text).show();
                }
                else { // If not, send them back to the home page
                    window.location.replace('#');
                }
            }
        });
    }
  });

  // Our module now returns our view
  return HomePage;
});


    