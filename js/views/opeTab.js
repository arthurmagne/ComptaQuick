define([
	'bootstrap',
	'holder',
	'jquery',
	'underscore',
	'backbone',
	'text!../../templates/opeTab.html',
	'collections/operations',
	'models/account',
	'highcharts'
	], 
	function(bootstrap, holder, $, _, Backbone, opeTabTemplate, Operations, Account, Highcharts){
		var OpeTab = Backbone.View.extend({
			events: {
				'click .account-name-ope-tab .name': 'renameAccount',
				'keypress :input': 'logKey'
			},

			el: '#center-page',

			render: function (options) {
				console.log("operation view");
				var that = this;
				this.accountId = options.account_id;
				var operations = new Operations({accountId: this.accountId});
				var account = new Account({account_id: this.accountId});
				

				account.fetch({
					success: function (account) {
						console.log("account recupéré : ",account);
						that.account = account;
						that.accountBalance = account.get("balance");
						operations.fetch({
				        	success: function (operations) {
								console.log("operations recupérées : ",operations);
								that.operations = operations;
								var extendObject = $.extend({},account.attributes,operations);
				        		var template = _.template(opeTabTemplate, {object: extendObject});
				        		that.$el.html(template);
				        		that.initGraphOptions(operations);
				        		
				        	},
							error: function() {
								console.log("Error during fetch account operation");
							}
		       			});
					},
					error: function() {
						console.log("Error during fetch account operation");
					}
				});
				

		        
   			},

   			initGraphOptions: function (object) {
   				// options for graph
				var graphOptions = {
			        chart: {
			            type: 'spline'
			        },
			        title: {
			            text: 'Opération du mois'
			        },
			        xAxis: {
			            type: 'datetime'
			        },
			        yAxis: {
			            title: {
			                text: 'Montant (euros)'
			            }
			        },
			        series: [{
           		 }]
      		  	};

      		  	var balance = this.accountBalance;
      		  	var balanceTab = [];
   				object.each(function(op) {
   					console.log('value :',op.get("value"));
   				});

   				var jsonArray = [];
   				object.each(function(op) {
			        jsonArray.push({
			        	x: Date.parse(op.get("operation_date")),
			        	name: op.get("operation_name"),
			        	color: '#FF00FF',
				        y: parseInt(op.get("value"))
				    });
			    });

   				// don't forget to reverse it
	    		graphOptions.series[0].data = jsonArray.reverse();
	    		console.log(graphOptions);
	    		this.drawGraphs(graphOptions);
   			},

   			renameAccount: function (event) {
   				event.preventDefault();
		    	var accountNameTag = $('.account-name-ope-tab');
		    	var accountName = accountNameTag.find('.name').html();

		    	accountNameTag.html("<input class='form-control' type='text' value='"+accountName+"'/>");
   			},

			logKey: function(event) {
			    if (event.which == 13){
			    	// enter pressed
			    	console.log("validEdit");
	    			var that = this;
			    	var accountNameTag = $('.account-name-ope-tab');
			    	var accountNameInput = accountNameTag.find('input');
			    	// On récupère la valeur de l'input
			    	var accountName = accountNameInput.val();
	      			$(".error-msg").html();

			    	var error_msg = '';
			    	if (accountName == ''){
			    		error_msg += 'Le nom du compte ne peut être vide.<br>';
	     			    accountNameInput.addClass("form-error");
	      				
			    	}

	      			$(".error-msg").html(error_msg);


			    	if (error_msg != ''){
			    		return ;
			    	}
			    	// on update l'account sur le serveur

			    	var account = new Account({id: this.accountId, account_name: accountName});
			    	account.save(null, {
				        success: function (account){

				          console.log("Account push au serveur avec succès");
				          console.log(account);			          
				          

				        },
				        error: function (){
				          console.log("Ann error occured");
				        }
				      });

			    	accountNameTag.html("<span class='name'>"+accountName+"</span><span class='info text-muted'>Clickez pour modifier</span>");

			    }
			},

			drawGraphs: function (graphOptions) {
				this.$el.find('#graphs').highcharts(graphOptions);
				
			}
			
    

		});

  // Our module now returns our view
  return OpeTab;

});