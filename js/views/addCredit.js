	
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
		console.log("addCredit view");
		$(this.el).empty();
		$(this.el).append("<h1 class='page-header'>Effectuer une Opération de Crédit</h1>");
		this.accountListView = new AccountListView();
		this.paymentTypeListView = new PaymentTypeListView();
		this.addOperationFormView = new AddOperationFormView();
		
		this.accountListView.render();
		this.paymentTypeListView.render();
		this.addOperationFormView.render();
		var that = this;
    },
	
	attributes: function () {
      return {
	    account_id: this.accountListView.getAccount(),
		type_id: this.paymentTypeListView.getType(),
		operation_date: this.addOperationFormView.getOpDate(),
		operation_name: this.addOperationFormView.getOpName(),
		operation_desc: this.addOperationFormView.getOpDesc(),
		is_credit: 1,
		value: this.addOperationFormView.getOpMontant()
      };
    },

   validerOp: function (event) {
      event.preventDefault(); 
      console.log("creating op ...");
      var that = this;
	  var _data = this.attributes();
      console.log(_data);	  
      var operation = new Operation(_data);
      operation.save();
      
    },
	
    close: function () {
      $(this.el).unbind();
      $(this.el).empty();
    }

	});

  return addDebitPage;
});
