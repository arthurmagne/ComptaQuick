define([
	'bootstrap',
	'holder',
	'jquery',
	'underscore',
	'backbone',
	'text!../../templates/accountsTab.html',
	'collections/accounts',
	'models/account'
	], 
	function(bootstrap, holder, $, _, Backbone, accountsTabTemplate, Accounts, Account){
		var AccountsTab = Backbone.View.extend({
			events: {
				'click .clickableRow': 'detailAccount',
				'click .delete-account': 'deleteAccount'
			},

			el: '#accountsTab',

			render: function () {
				console.log("Account tab view");
				this.accounts = new Accounts();
				var that = this;

		        this.accounts.fetch({
		        	success: function (accounts) {
		        		console.log("accounts fetch success");
		        		var template = _.template(accountsTabTemplate, {accounts: accounts.models});
		        		that.$el.html(template);
		        	}
		        });

    		},

    		detailAccount: function (event) {
    			console.log($(event.currentTarget).attr("href"));

    		},

    		deleteAccount: function (event) {
    			event.stopImmediatePropagation();
    			var accountId = $(event.currentTarget).data('value');
    			console.log(accountId);
    			console.log("Delete account with id : ", accountId);
    			console.log(this.accounts.get(accountId));
    			// remove model (from server and collection by bubbling)

    			this.accounts.get(accountId).destroy();

  

    		}
});

  // Our module now returns our view
  return AccountsTab;

});