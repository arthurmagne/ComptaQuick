	
	define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  'views/paymentTypeList',
  'views/accountList',
  'views/addOperationForm',
  'collections/operations',
  'models/operation'
  ], function(bootstrap, holder, $, _, Backbone, PaymentTypeListView, AccountListView, AddOperationFormView, Operations, Operation){
    var addDebitPage = Backbone.View.extend({
  	  events: {
        'click #submit_btn': 'validerOp'
      },
	
	el: '#center-page', 
	
	render: function () {
		console.log("addDebit view");
		$(this.el).empty();
		$(this.el).append("<h1 class='page-header'>Effectuer une Opération de Débit</h1>");
		$(this.el).append("<form class='add-operation-form'>"+
							"<select type='text' placeholder='Type de payment' name='list_type'  id='list_type' class='form-control' required></select>" + 
							"<select type='number' placeholder='Compte à débiter' name='list_account' id='list_account'class='form-control' required></select>"+
							"<p id='form_operation'></p></form>");

		this.accountListView = new AccountListView();
		this.paymentTypeListView = new PaymentTypeListView();
		this.addOperationFormView = new AddOperationFormView();

		this.accountListView.render();
		this.paymentTypeListView.render();
		this.addOperationFormView.render();
    },
	
	attributes: function () {
      return {
    	  account_id: this.accountListView.getAccount(),
    		type_id: this.paymentTypeListView.getType(),
    		operation_date: this.addOperationFormView.getOpDate(),
    		operation_name: this.addOperationFormView.getOpName(),
    		operation_desc: this.addOperationFormView.getOpDesc(),
    		is_credit: 0,
    		value: this.addOperationFormView.getOpMontant()
      };
    },

   validerOp: function (event) {
      event.preventDefault(); 
      console.log("creating op ...");
	  var _data = this.attributes();
      console.log(_data);
      var operation = new Operation(_data);
      operation.save(null, {
		  success: function (operation){

			  console.log("Operation POST avec succès");
			  console.log(operation);
			  $(that.el).empty();
			  
			  $(that.el).html("<h2 class='text-center text-muted add-feedback'>Operation de crédit ajouté avec succès</h2><hr>");
			  
			  setTimeout(function(){
				Backbone.View.prototype.goTo('#/perso');
				that.close();
			  },2000);
			}
	  });
      
    },
	
    close: function () {
      $(this.el).unbind();
      $(this.el).empty();
    }

	});

  return addDebitPage;
});
