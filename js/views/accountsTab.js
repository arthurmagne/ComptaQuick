define([
	'bootstrap',
	'holder',
	'jquery',
	'underscore',
	'backbone',
	'text!../../templates/accountsTab.html',
	'collections/accounts'
	], 
	function(bootstrap, holder, $, _, Backbone, accountsTabTemplate, Accounts){
		var AccountsTab = Backbone.View.extend({
			events: {

			},

			el: '#accountsTab',

			render: function () {
				console.log("Account tab view");
				var accounts = new Accounts();
				var that = this;

		        accounts.fetch({
		        	success: function (accounts) {
		        		console.log("accounts fetch success");
		        		var template = _.template(accountsTabTemplate, {accounts: accounts.models});
		        		that.$el.html(template);
		        	}
		        });
    }
});

  // Our module now returns our view
  return AccountsTab;

});