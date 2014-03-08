	
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
        'submit .graph-form': 'generate',
        'click .display-cal': 'displayCal',
        'click .hide-cal': 'hideCal'
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
          that.account = that.$el.find('select[name=list_account]');
          that.calendars = that.$el.find('.calendars');
        }
      });
    },

    displayCal: function (event) {
      this.calendars.addClass("show");
    },

    hideCal: function (event) {
      this.calendars.removeClass("show");
    },

   generate: function (event) {
      event.preventDefault(); 
      console.log("generate graphs ...");

      var that = this;
      var begin, end, type;
     
      // get the duration
      var duration = this.$el.find('input[name=duration]:checked').val();
      if (duration == 'current')
        duration = undefined;
      if (duration == 'future'){
        begin = new Date().toJSON();
      }
      if (duration == 'all'){
        begin = 'all';
      }
      if (duration == 'manuel'){
        
        begin =  this.$el.find('input[name=begin]').val();
        end   =  this.$el.find('input[name=end]').val();

        if (begin == '')
          begin = undefined;
        if (end == '')
         end = undefined;
      }


      console.log("durée",duration);
      var limit = this.$el.find('input[name=limit]').val();
      if (limit == '')
        limit = undefined;

      var operations = new Operations({accountId: this.account.val(), maxOpe: limit, dateDebut: begin, typeOp: type});
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
            y: ((op.get("is_credit") == 1) ? parseInt(op.get("value")) : (- parseInt(op.get("value"))))
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
