
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


function findAndRemove(array,string)  {
	for(var i = 0; i < array.length; i++) {
		if(array[i][0] == string ) {
			array.remove(i);
			break;

		}
	}
	return array;
}
	var product;
	var productArray = new Array();//[index][text|number]

	$('.line').each(function(i, obj) {
	product = $(this).find(".item:eq(1)").html();
	
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
	
productArray = findAndRemove(productArray,"DESC");
productArray = findAndRemove(productArray,null);
productArray.sort();

var arrayS = "";

productArray.forEach(function(i2) {
	arrayS += i2[0] + ":" + i2[1] + "<br>\n";
});
$("<div>" + arrayS + "</div>").insertAfter('#assetCountWrapper')
