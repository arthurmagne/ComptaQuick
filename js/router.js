// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/home',
  'views/signIn',
  'views/signUp',
  'views/homePerso',
  'views/opeTab',
  'views/addAccount'
  ], function($, _, Backbone, HomeView, SignInView, SignUpView, HomePersoView, OpeTabView, AddAccountView){

  var AppRouter = Backbone.Router.extend({
    routes: {
        '': 'home',
        'sign-in': 'signIn',
        'sign-up': 'signUp',
        'perso': 'homePerso',
        'opeTab/:id': 'opeTab',
        'addAccount': 'addAccount'
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

    app_router.on('route:homePerso', function() {
      console.log("route: home perso");
      homePersoView = new HomePersoView();
      homePersoView.render();
    });

    app_router.on('route:opeTab', function(id) {
      console.log("route: opeTab");
      opeTabView = new OpeTabView();
      opeTabView.render({account_id: id});
    });

    app_router.on('route:addAccount', function() {
      console.log("route: addAccount");
      addAccountView = new AddAccountView();
      addAccountView.render();
    });

    Backbone.View.prototype.goTo = function (loc) {
      app_router.navigate(loc, true);
    };
    console.log("initialize");

    app_router.bind('all', function(route, router) {
      if (route != 'route'){
        var routeName = route.split(':')[1];
        $('.nav-sidebar li').removeClass('active');
        if (routeName == "addAccount"){
          $('.nav-sidebar li.' + routeName).addClass('active');
        }else{
          $('.nav-sidebar li.perso').addClass('active');
        }
      }
    });

    /* AJAX CONFIGS */

    // Tell jQuery to watch for any 401 or 403 errors and handle them appropriately
    $.ajaxSetup({
      statusCode: {
          401: function(){
              // Redirec the to the login page.
              window.location.replace('/#login');
           
          },
          403: function() {
              // 403 -- Access denied
              window.location.replace('/#denied');
          }
      }
    });



    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});