define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  'text!../../templates/addOperationForm.html'
  ], function(bootstrap, holder, $, _, Backbone, addOperationFormTemplate){
    var addOperationForm = Backbone.View.extend({
	
	el: '#form_operation',
	
	render: function () {
		var template = _.template(addOperationFormTemplate);
		this.$el.html(template);
		this.date = $("input[name='date']");
		this.name = $("input[name='name']");
		this.desc = $("input[name='description']");
		this.montant = $("input[name='montant']");
    },
	
	getOpDate: function() {
		return this.date.val();
	},
	getOpName: function() {
		return this.name.val();
	},
	getOpDesc: function() {
		return this.desc.val();
	},
	getOpMontant: function() {
      return this.montant.val();
    },
	
    close: function () {
      $(this.el).unbind();
      $(this.el).empty();
    }

	});

  return addOperationForm;
});
