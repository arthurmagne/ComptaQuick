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
      this.email = $(".sign-in-form input[name='email']");
      this.password = $(".sign-in-form input[name='password']");
      this.error_msg = $(".error-msg");
    },

    attributes: function () {
      return {
        email: this.email.val(),
        password: this.password.val()
       };
    },

    login:function (event) {
        event.preventDefault(); // Don't let this button submit the form
        this.email.removeClass("form-error");
        this.password.removeClass("form-error");
        this.error_msg.html();
        var url = 'api/index.php/login';
        console.log('Loggin in... ');
        var that = this;
        var _data = this.attributes();
        var error_msg = '';
        if (!_data.email){
          error_msg += 'Veuillez indiquer un email.<br>';
          this.email.addClass("form-error");
        }
        if (!_data.password){
          error_msg += 'Veuillez indiquer un mot de passe.';
          this.password.addClass("form-error");
        }
        this.error_msg.html(error_msg);

        if (error_msg != ''){
          return ;
        }

        console.log("Données transmises: "+JSON.stringify(this.attributes()));
        

        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: JSON.stringify(_data),
            statusCode: {
              200: function (response) {
                console.log("connection réussie");
                that.close();
                Backbone.View.prototype.goTo('#/perso');
              },
              401: function (response) {
                that.error_msg.html("Email ou mot de passe incorrect");
                that.email.addClass("form-error");
                that.password.addClass("form-error");
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


    