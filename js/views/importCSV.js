define([
  'bootstrap',
  'holder',
  'jquery',
  'underscore',
  'backbone',
  'text!../../templates/importCSV.html',
  'views/accountList',
  'collections/operations',
  'models/operation',
  'collections/accounts',
  'models/account'
  ], function(bootstrap, holder, $, _, Backbone, importCSVTemplate, AccountListView, Operations, Operation, Accounts, Account){
    var importfile = Backbone.View.extend({
	events: {
        'change #importFile': 'handleFileSelect',
        'click #validImport': 'validImport' 
    },

	el: '#center-page',

	render: function (options) {
	  console.log("importCSV view");
      this.accounts = new Accounts();
      console.log("account list :");
      console.log(this.accounts);
      var that = this;
      this.accounts.fetch({
        success: function (accounts) {
          console.log("accounts fetch success");
          var template = _.template(importCSVTemplate, {accounts: accounts.models});
          that.$el.html(template);   
        }
      });	
    },

   /* saveOperation: function(date, name, desc, op) {
    	if (op < 0){
    		var credit = 0 ;
    	}else{
    		var credit = 1 ;
    	}
    	var data = {
    	    account_id: this.accountListView.getAccount();,
    		type_id: '4',
    		operation_date:  date,
    		operation_name:  name,
    		operation_desc:  desc,
    		is_credit: this.credit,
    		value: op
      	}; 
    	var operation = new Operation(data);
    },*/

    parseCSV: function(text, lineTerminator, cellTerminator) {
    	var table = this.$el.find('#import-table');	 
		console.log(table);		
		var lines = text.split(lineTerminator);
		for(var j = 0; j<lines.length; j++){
			if(lines[j] != ""){
				var information = lines[j].split(cellTerminator);
					if (information.length < 4){
						table.append("<tr><td>"+information[0]+"</td><td>"+information[1]+"</td><td>"+information[2]+"</td></tr>");
					}else{
						table.append("<tr><td>"+information[0]+"</td><td>"+information[1]+"</td><td>"+information[2]+"</td><td>"+information[3]+"</td></tr>");
					}
			}
		}
	},

	handleFileSelect: function(event) {
		event.preventDefault(); 
		that = this;
		var files = event.target.files; // FileList object
		for (var i = 0, f; f = files[i]; i++) { // Loop through the FileList 
			var reader = new FileReader();
			reader.onload = (function(theFile) { // Closure to capture the file information.
				return function(e) {
					var cellterminator = $('select[name=delimiteur]').val();	
					if(cellterminator=="tab"){
						that.parseCSV(e.target.result, '\n', '\t');
					}else if(cellterminator==";"){
						that.parseCSV(e.target.result, '\n', '\;'); 
					}	
					
				};
			})(f);
		reader.readAsText(f); // Read the file as text
		}
	},

    close: function () {
      $(this.el).unbind();
      $(this.el).empty();
    }

	});

  return importfile;
});
