define([
	'bootstrap',
	'holder',
	'jquery',
	'underscore',
	'backbone',
	'bootstrap-dialog.min',
	'text!../../templates/accountsTab.html',
	'collections/accounts',
	'models/account'
	], 
	function(bootstrap, holder, $, _, Backbone, dialog, accountsTabTemplate, Accounts, Account){
		var AccountsTab = Backbone.View.extend({
			events: {
				'click .clickableRow': 'detailAccount',
				'click .delete-account': 'deleteAccount',
				'click .edit-account': 'editAccount'
			},

			el: '#center-page',

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

    			var that = this;
    			BootstrapDialog.confirm('Voulez vous vraiment supprimer ce compte?', function(result){
		            if(result) {
		                var accountId = $(event.currentTarget).data('value');
		    			console.log("Delete account with id : ", accountId);
		    			// remove model (from server and collection by bubbling)
		    			that.accounts.get(accountId).destroy();

		    			// remove row from tab
		    			that.$el.find('.clickableRow[data-value='+accountId+']').remove();
		            
		            }else {
		                console.log("Suppression annulée");
		            }
		        });  

    		},

    		editAccount: function (event) {
    			event.stopImmediatePropagation();
    			// Ajouter un input à la place du nom avec un bouton valider
		        var accountId = $(event.currentTarget).data('value');
		    	var accountName = this.$el.find('.clickableRow[data-value='+accountId+'] .account-name-col');
		    	accountName.html("<input class='form-control' type='text' placeholder='toto'/>");


    		}
});

  // Our module now returns our view
  return AccountsTab;

});