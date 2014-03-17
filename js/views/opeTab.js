define([
	'bootstrap',
	'holder',
	'jquery',
	'underscore',
	'backbone',
	'text!../../templates/opeTab.html',
	'views/graphs',
	'collections/operations',
	'models/operation',
	'models/account',
	'views/addDebit',
	'views/addCredit',
	'highcharts'
	], 
	function(bootstrap, holder, $, _, Backbone, opeTabTemplate, GraphView, Operations, Operation, Account, AddDebitView, AddCreditView, Highcharts){
		var OpeTab = Backbone.View.extend({
			events: {
				'click .hashtag-opetab': 'graphHashtag',
				'click .account-name-ope-tab .name': 'renameAccount',
				'keypress :input': 'logKey',
				'click .delete-op': 'deleteOp',
				'click .edit-op': 'editOp',
				'click .valid-op-edit': 'validEdit',
				'click .add-debit': 'addOpDebit',
				'click .add-credit': 'addOpCredit'
			},

			el: '#center-page',

			render: function (options) {
				console.log("operation view");
				var that = this;
				this.accountId = options.account_id;
				this.operations = new Operations({accountId: this.accountId});
				var account = new Account({account_id: this.accountId});

				account.fetch({
					success: function (account) {
						console.log("account recupéré : ",account);
						that.account = account;
						that.accountBalance = account.get("balance");
						that.operations.fetch({
				        	success: function (operations) {
								console.log("operations recupérées : ",operations);
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
			            text: 'Opérations du mois'
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


			    console.log("OKEYYYYY");
			    
   				var balance 	= this.accountBalance;
   				var listOpe 	= operations.toArray();
   				var evolutionX 	= []; 
   				var evolutionY 	= []; 
   				var evolutionOp = [];

   				listOpe = listOpe.reverse();

   				// evolutionY.push(this.accountBalance);
   				// evolutionX.push(Date.parse(new Date()));
   				// evolutionOp.push("Solde actuel");
   				
   				for(var i = 0; i < listOpe.length; i++){
   					// we put the previous balance in the tab
   					evolutionY.push(parseInt(balance));
   					if(listOpe[i].get("is_credit") == 1){
   						balance = parseInt(balance) - parseInt(listOpe[i].get("value"));
   					}else{
   						balance = parseInt(balance) + parseInt(listOpe[i].get("value"));
   					}
   					evolutionX.push(Date.parse(listOpe[i].get("operation_date")));
   					evolutionOp.push(listOpe[i].get("operation_name"));
   				}

   				evolutionX.reverse();
   				evolutionY.reverse();
   				evolutionOp.reverse();

   				var jsonArray = [];
   				for(var i = 0; i < evolutionX.length; i++){
			        jsonArray.push({
			        	x: evolutionX[i],
			        	name: evolutionOp[i],
			        	color: '#483D8B',
				        y: parseInt(evolutionY[i])
				    });
			    };

			    console.log("OKEYYYYY");

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

   			graphHashtag: function(event){
   				event.preventDefault();
   				var hashtagName = $(event.currentTarget).attr("href");
   				//console.log(hashtagName);


				var graphview = new GraphView();
				graphview.render({hashtagName : hashtagName, accountId : this.accountId});

   			},

    		deleteOp: function (event) {
    			//event.stopImmediatePropagation();

    			var that = this;
    			BootstrapDialog.confirm('Voulez vous vraiment supprimer cette opération?', function(result){
		            if(result) {
		                var opId = $(event.currentTarget).data('value');
		    			console.log("Delete op with id : ", opId);
		    			// remove model (from server and collection by bubbling)
		    			that.operations.get(opId).destroy();

		    			// remove row from tab
		    			//that.$el.find('.op-row[data-value='+opId+']').remove();
		    			that.render({account_id: that.accountId});
		            
		            }else {
		                console.log("Suppression annulée");
		            }
		        });  

    		},

    		editOp: function (event) {
    			//event.stopImmediatePropagation();
    			// Ajouter un input à la place du nom avec un bouton valider
    			console.log("editOp");
		        var opId = $(event.currentTarget).data('value');
		    	var opNameTag = this.$el.find('.op-row[data-value='+opId+'] .op-name');
		    	//var opDescTag = this.$el.find('.op-row[data-value='+opId+'] .op-desc');
		    	var editOpBtn = this.$el.find('.edit-op[data-value='+opId+']');
		    	var opName = opNameTag.html();
		    	//var opDesc = opDescTag.html();

		    	opNameTag.html("<input class='form-control' type='text' value='"+opName+"'/>");
		    	//opDescTag.html("<input class='form-control' type='text' value='"+opDesc+"'/>");
		    	editOpBtn.html("Valider");
		    	editOpBtn.removeClass("edit-op");
		    	editOpBtn.addClass("valid-op-edit");

    		},

    		validEdit: function (event) {
    			//event.stopImmediatePropagation();
    			console.log("validEdit");
    			var that = this;
    			var opId = $(event.currentTarget).data('value');
		    	var opNameTag = this.$el.find('.op-row[data-value='+opId+'] .op-name');
		    	var opNameInput = this.$el.find('.op-row[data-value='+opId+'] .op-name input');
		    	var editOpBtn = this.$el.find('.valid-op-edit[data-value='+opId+']');
		    	// On récupère la valeur de l'input
		    	var opName = opNameInput.val();


      			$(".error-msg").html();

		    	var error_msg = '';
		    	if (opName == ''){
		    		error_msg += "Le nom de l'opération ne peut être vide.<br>";
     			    opNameInput.addClass("form-error");
      				
		    	}

      			$(".error-msg").html(error_msg);


		    	if (error_msg != ''){
		    		return ;
		    	}
		    	// on update l'account sur le serveur

		    	var operation = this.operations.get(opId);
		    	operation.set('operation_name', opName);
		    	operation.save(null, {
			        success: function (operation){

			          console.log("Operation push au serveur avec succès");
			          console.log(operation);			          
			          

			        },
			        error: function (){
			          console.log("An error occured");
			        }
			      });

		    	opNameTag.html(opName);
		    	console.log(opName);
		    	editOpBtn.html("Éditer");
		    	editOpBtn.removeClass("valid-edit");
		    	editOpBtn.addClass("edit-op");
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
	      			$(".error-msgO").html();

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

			addOpDebit: function (event){
				  addDebitView = new AddDebitView();
				  //addDebitView.render(this.accountId);
				  addDebitView.render({account_id: this.accountId});				
			},		
			
			addOpCredit: function (event){
				  addCreditView = new AddCreditView();
				  //addCreditView.render(this.accountId);	
				  addCreditView.render({account_id: this.accountId});		
			},

			drawGraphs: function (graphOptions) {
				if (this.operations.length != 0){
					this.$el.find('#graphs').highcharts(graphOptions);
				}else{
					this.$el.find('#graphs').remove();
				}
				
			}
			
    

		});

  // Our module now returns our view
  return OpeTab;

});