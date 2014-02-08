// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/home',
  'views/signIn',
  'views/signUp'
  ], function($, _, Backbone, HomeView, SignInView, SignUpView){

  var AppRouter = Backbone.Router.extend({
    routes: {
        '': 'home',
        'sign-in': 'signIn',
        'sign-up': 'signUp'
    }
  });

  var initialize = function(){


    var app_router = new AppRouter;

    app_router.on('route:home', function() {
      console.log("route: home");
      homeView = new HomeView();
      homeView.render();
    });

    app_router.on('route:signIn', function() {
      console.log("route: sign-in");
      signInView = new SignInView();
      signInView.render();
    });

    app_router.on('route:signUp', function() {
      console.log("route: sign-up");
      signUpView = new SignUpView();
      signUpView.render();
    });

    Backbone.View.prototype.goTo = function (loc) {
      app_router.navigate(loc, true);
    };
    console.log("initialize");

    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});