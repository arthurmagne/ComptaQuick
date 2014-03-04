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

   			initGraphOptions: function (operations) {
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
			       plotOptions: {
		                line: {
		                    dataLabels: {
		                        enabled: true
		                    }
		                }
		            },
			        series: [{
			        	name: 'solde'
           		 }]
      		  	};


   				var balance 	= this.accountBalance;
   				var listOpe 	= operations.toJSON();
   				var evolutionX 	= []; 
   				var evolutionY 	= []; 
   				var evolutionOp = [];

   				listOpe = listOpe.reverse();
   				

   				operations.each(function(currentOp) {
   					if(currentOp.get("is_credit") == 1){
   						balance = parseInt(balance) + parseInt(currentOp.get("value"));
   					}else{
   						balance = parseInt(balance) - parseInt(currentOp.get("value"));
   					}
   					evolutionY.push(parseInt(balance));
   					evolutionX.push(Date.parse(currentOp.get("operation_date")));
   					evolutionOp.push(currentOp.get("operation_name"));
   				});

   				evolutionY.push(this.accountBalance);
   				evolutionX.push(Date.parse(new Date()));
   				evolutionOp.push("Solde actuel");

   				var jsonArray = [];
   				for(var i = 0; i < evolutionX.length; i++){
			        jsonArray.push({
			        	x: evolutionX[i],
			        	name: evolutionOp[i],
			        	color: '#483D8B',
				        y: parseInt(evolutionY[i])
				    });
			    };

	    		graphOptions.series[0].data = jsonArray;
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