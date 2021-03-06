
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var findAndRemove = function (array,string)  {
	for(var i = 0; i < array.length; i++) {
		if(array[i][0] == string ) {
			array.remove(i);
			break;

		}
	}
	return array;
}

//Have to preface $ calls with this to get the correct window.
var countInLocation = function () {
	var product;
	var productArray = new Array();//[index][text|number]

	this.$('.line').each(function(i, obj) {
		product = $(this).find(".item:eq(1)").html() + " (" + $(this).find(".item:eq(4)").html() + ")";
		
		if(i == 1) {
			var newProduct = new Array();
			newProduct[0] = product;
			newProduct[1] = 1;
			productArray.push(newProduct);
		}
		
		var found = false;
		
		productArray.forEach(function(i2) {
			if(product == i2[0]) {
				i2[1] += 1;
				found = true;
			} 
		});
		if(found != true) {
			var newProduct = new Array();
			newProduct[0] = product;
			newProduct[1] = 1;
			productArray.push(newProduct);
		}
	});
	
	//These remove the extra stuff.
	productArray = findAndRemove(productArray,"DESC (CONDITION)");
	productArray = findAndRemove(productArray,"null (null)");
	productArray.sort();

	var arrayS = "";

	productArray.forEach(function(i2) {
		arrayS += i2[1] + " : " + i2[0] + "<br>\n";
	});
	this.$("<div>" + arrayS + "</div>").insertAfter('#assetCountWrapper')
}


var countInLocationDetailed = function () {
	var product;
	var productArray = new Array();//[index][text|number]

	this.$('#summaryTable tr').each(function(i, obj) {
		var cpu = $(this).find("td:eq(5)").html() || '';
	
		product = $(this).find("td:eq(1)").html() + " " + cpu;
		
		if(i == 1) {
			var newProduct = new Array();
			newProduct[0] = product;
			newProduct[1] = 1;
			productArray.push(newProduct);
		}
		
		var found = false;
		
		productArray.forEach(function(i2) {
			if(product == i2[0]) {
				i2[1] += 1;
				found = true;
			} 
		});
		if(found != true) {
			var newProduct = new Array();
			newProduct[0] = product;
			newProduct[1] = 1;
			productArray.push(newProduct);
		}
	});
	
	//These remove the extra stuff.
	productArray = findAndRemove(productArray,"DESC Processor Type");
	productArray = findAndRemove(productArray,"DESC ");
	productArray.sort();

	var arrayS = "";

	productArray.forEach(function(i2) {
		arrayS += i2[1] + " : " + i2[0] + "<br>\n";
	});
	this.$("<div>" + arrayS + "</div>").insertAfter('#summaryTable')
}
