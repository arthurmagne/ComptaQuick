define([
	'bootstrap',
	'holder',
	'jquery',
	'underscore',
	'backbone',
	'text!../../templates/opeTab.html',
	'collections/operations'
	], 
	function(bootstrap, holder, $, _, Backbone, opeTabTemplate, Operations){
		var OpeTab = Backbone.View.extend({
			events: {

			},

			el: '#pageOpeTab',

			render: function () {

				var operations = new Operations();
				var that = this;
		        operations.fetch({
		        	success: function (operations) {
		        		var template = _.template(opeTabTemplate, {operations: operations.models});
		        		that.$el.html(template);
		        	}
		        });
    }
});

  // Our module now returns our view
  return OpeTab;

});