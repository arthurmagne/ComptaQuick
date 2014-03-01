define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  'text!../../templates/accountList.html',
  'collections/accounts',
  'models/account'
  ], function(bootstrap, holder, $, _, Backbone, accountListTemplate, Accounts, Account){
    var addDebitPage = Backbone.View.extend({
	
	el: '#list_account',

	render: function () {
		console.log("Account tab view");
		this.accounts = new Accounts();
		console.log("account list :");
		console.log(this.accounts);
		var that = this;
		this.accounts.fetch({
			success: function (accounts) {
				console.log("accounts fetch success");
				var template = _.template(accountListTemplate, {accounts: accounts.models});
				that.$el.html(template);
				that.account = $('select[name=list_account]').val();	
				console.log(that.account);				
			}
		});

    },
	
	getAccount: function () {
	  this.account = $('select[name=list_account]').val();					
      return this.account;
    },
	
    close: function () {
      $(this.el).unbind();
      $(this.el).empty();
    }

	});

  return addDebitPage;
});
