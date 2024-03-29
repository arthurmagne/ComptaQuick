// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  paths: {
    jquery: 'libs/jquery/jquery',
    bootstrap: '../dist/js/bootstrap.min',
    doc: '../dist/js/docs.min',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
    holder: 'holder',
    backbone_rails: 'libs/backbone_rails/backbone_rails_sync',
    backbone_auth: 'libs/backbone_auth/backbone.basicauth',
    backbone_offline: 'libs/backbone_offline/backbone.offline',
    highcharts: 'libs/highcharts/highcharts',
    highcharts: 'libs/highstock/highstock'
    
  },

    shim: {
        bootstrap: {
          deps: ['jquery']
        },

        holder: {
          deps: ['jquery']
        },
      
    	  underscore: {
	        exports: '_'
	      },
        
        backbone: {
            deps: ['jquery','underscore'],
            exports: 'Backbone'
        },
        
        backbone_auth: {
            deps: ['underscore']
        },

        backbone_offline: {
          deps: ['underscore', 'backbone'],
          exports: 'Offline'
        },

        highcharts: {
            deps: ['jquery']
        },
        
        highstock: {
            deps: ['jquery']
        }
    }

});

require([

  // Load our app module and pass it to our definition function
  'app',
], function(App){

  // The "app" dependency is passed in as "App"
  App.initialize();
});