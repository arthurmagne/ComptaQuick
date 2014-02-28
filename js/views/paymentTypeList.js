define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  'text!../../templates/paymentTypeList.html',
  'collections/paymentTypes',
  'models/paymentType'
  ], function(bootstrap, holder, $, _, Backbone, paymentTypeListTemplate, PaymentTypes, PaymentType){
    var addDebitPage = Backbone.View.extend({
			
	el: '#list_type',
	
	render: function () {
		console.log("Payment List View : ");
		this.paymentTypes = new PaymentTypes();
		var that = this;
		console.log("Le type list :");
		console.log(this.paymentTypes);
		console.log(this.paymentTypes.id);		
		this.paymentTypes.fetch({
			success: function (paymentTypes) {
				console.log("Payment Types fetch success");
				var template = _.template(paymentTypeListTemplate, {paymentTypes: paymentTypes.models});
				that.$el.html(template);
				this.type = $('select[name=list_type]').val();
				console.log(this.type);
				
			}
		});

    },

	getType: function () {
		this.type = $('select[name=list_type]').val();
		return this.type;	
    },
	
    close: function () {
      $(this.el).unbind();
      $(this.el).empty();
    }

	});

  return addDebitPage;
});
