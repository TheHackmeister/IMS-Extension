/*
loadForm('editsalesorder.php','','so');
transferReport();
*/

// Reorganizes the returns once the load return button is pressed. 
var loadSalesOrderDetailOld = loadSalesOrderDetail;
var loadSalesOrderDetail = function () {
	ajaxCallback(reorganizeSalesOrder);
	loadSalesOrderDetailOld.apply(this,arguments);
}

var reorganizeSalesOrder = function () {
	//This moves around the elements.
// Rewrite addAssetProductSearchText for the correct IDs
	$('<input type="text" id="addAssetProductSearchText" onkeyup="addAssetSearchProduct()">').insertAfter('#productID');
	$('<select id="conditionDropdown"> <option value="1">Good</option><option value="2">Broken</option></select>').insertAfter('h6:contains(condition)');
	$('#productID').attr("id","addAssetProductID");
	$('#searchProductSOResults').attr("id","addAssetProductSearchResults");
}

var addSalesOrderLineProductOld = addSalesOrderLineProduct;
var addSalesOrderLineProduct = function (id) {
	$('#addAssetProductID').attr("id","productID");
	$('#addAssetProductSearchText').attr("id","productText");
	addSalesOrderLineProductOld.apply(this,arguments);
	ajaxCallback(function() {
		$('#productID').attr("id","addAssetProductID");
		$('#productText').attr("id","addAssetProductSearchText");
	});
}



