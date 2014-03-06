	
	define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  'collections/operations',
  'models/operation',
  'text!../../templates/graphs.html',
  'collections/accounts'
  ], function(bootstrap, holder, $, _, Backbone, Operations, Operation, graphsTemplate, Accounts){
    var addDebitPage = Backbone.View.extend({
  	  events: {
        'submit .graph-form': 'generate'
      },
	
  	el: '#center-page',
  	
  	render: function (options) {
      console.log("graphs view");
      console.log(options);
      this.accounts = new Accounts();
      console.log("account list :");
      console.log(this.accounts);
      var that = this;
      this.accounts.fetch({
        success: function (accounts) {
          console.log("accounts fetch success");
          var template = _.template(graphsTemplate, {accounts: accounts.models});
          that.$el.html(template);   
        }
      });
      this.account = this.$el.find('select[name=list_account]');          

      },
  	
  	attributes: function () {
        return {
          account: this.account
        };
      },

     generate: function (event) {
        event.preventDefault(); 
        console.log("generate graphs ...");
        var that = this;
  	    var _data = this.attributes();
       

        /*var balance = this.accountBalance;
        var balanceTab = [];
        object.each(function(op) {
          console.log('value :',op.get("value"));
        });*/
        var operations = new Operations({accountId: this.$el.find('select[name=list_account]').val()});
        var that = this;
        operations.fetch({
          success: function (operations) {
            console.log("operations recupérées : ",operations);
            that.operations = operations;
            that.initGraphOptions(operations);
            
          },
          error: function() {
            console.log("Error during fetch account operation");
          }
        });

        
        
      },
      initGraphOptions: function (object) {
         var graphOptions = {
          chart: {
              type: 'column'
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
       var jsonArray = [];
        object.each(function(op) {
            jsonArray.push({
              x: Date.parse(op.get("operation_date")),
              name: op.get("operation_name"),
              color: '#483D8B',
              y: parseInt(op.get("value"))
          });
        }); 
        // don't forget to reverse it
        graphOptions.series[0].data = jsonArray;
        this.$el.find('#graphs').highcharts(graphOptions);
    
      },
      

        
      close: function () {
        $(this.el).unbind();
        $(this.el).empty();
      }

  	});

  return addDebitPage;
});
