

var SalesOrderController = function (id, soundObject) {
	this.id = id;
	this.loc = $('#' + id + 'Location');
	this.loc.attr('id', id + 'AssetsLocation');
	this.assets = new TransferWithPreCheck(id + "Assets", soundObject);
	this.loc.attr('id', id + 'LocationsLocation');
	this.locations = new TransferWithCount(id + "Locations", soundObject); 
	this.loc.attr('id', id + 'Location');
	
	this.so = $('#' + id + 'SalesOrder');
	this.soDiv = $('#' + id + 'Div');
	this.soAssetsResults = $('#' + id + 'AssetsResults');
	this.soLocationsResults = $('#' + id + 'LocationsResults');
	this.product = $('#' + id + 'ProductText');
	this.productID = $('#' + id + 'ProductID');
	this.qty =  $('#' + id + 'Qty');
	this.soProductCondition = $('#' + id + 'ProductCondition');
	this.addProduct =  $('#' + id + 'AddProductButton');
	this.views = $('[name="' + this.id + 'Views"]');
//	this.vDetails = $('#' + id + 'VDetails');
	

	this.so.on('change', $.proxy(this.loadSO,this));
	this.assets.submit.on('click', $.proxy(function () {this.addAssets();},this));
	this.locations.submit.on('click', $.proxy(function () {this.addLocations();},this));
	this.addProduct.on('click', $.proxy(function() {this.addProduct();},this));
	this.product.on('keyup', $.proxy(function() {/*searchProductSO*/}, this));
	this.views.on('click', $.proxy(this.loadSO, this));
	
	//Counters	Would like to refacter this. 
	this.assets.assets.on('keyup', $.proxy(function(event){
	   if (event.keyCode == 13 || event.keyCode == 10) {
			this.countAssets();
			//this.preCheck();
		} else {
			this.countAssets();
		}
	},this.assets));
	this.locations.assets.on('keyup', $.proxy(function(event){
	   if (event.keyCode == 13 || event.keyCode == 10) {
			this.countAssets();
			//this.preCheck();
		} else {
			this.countAssets();
		}
	},this.locations));
}
SalesOrderController.prototype = Object.create(TransferWithPreCheck.prototype);

SalesOrderController.prototype.addAssets = function (idSO) {
	var changedElements = this.changeDivs(this.assets.assets, "addSalesOrderlineAssets",this.soAssetsResults, "addSalesOrderlineResults"); 
	ajaxCallback.call(this,function(){this.addAssetsCallback(changedElements);});
//	addSalesOrderLine(this.so.val());
}

SalesOrderController.prototype.addAssetsCallback = function (changedElements) {
	this.restoreDivs(changedElements);
	this.so.trigger('assetsAdded');
}

SalesOrderController.prototype.addLocations = function (id) {
	var changedElements = this.changeDivs(this.locations.assets, "addSalesOrderlineLocations", this.soLocationsResults, "addSalesOrderlineResults"); ; 
	ajaxCallback.call(this,function(){this.addLocationsCallback(changedElements);});
// addSalesOrderLineLocation(this.so.val());
}

SalesOrderController.prototype.addLocationsCallback = function (changedElements) {
	this.restoreDivs(changedElements);
	this.so.trigger('locationsAdded');
}

//Need to figure out condition. 
SalesOrderController.prototype.addProduct = function (id) {
	var changedElements = this.changeDivs(this.productID, "productID", this.qty, "productQTY", this.productCondition ,"conditionDropdown"); 
	ajaxCallback.call(this,function(){this.addProductCallback(changedElements);});
//	addSalesOrderLineProduct(this.so.val());
}

SalesOrderController.prototype.addProductCallback = function (changedElements) {
	this.restoreDivs(changedElements);
	this.so.trigger('productsAdded');
}

SalesOrderController.prototype.loadSO = function (id) {
	if(this.so.val() == "") return;
	var changedElements = this.changeDivs(this.soDiv, "SOContainerList"); 
	ajaxCallback.call(this,function(){this.addProductCallback(changedElements);});
//	addSalesOrderLineProduct(this.so.val());
	if($('[name="' + this.id + 'Views"]:checked').val() == "Details") {
		viewSODetailList(this.so.val(), 'viewsalesorderdetaillist.php');
	} else if ($('[name="' + this.id + 'Views"]:checked').val() == "Container") {
		viewSODetailList(this.so.val(), 'viewsalesorderdetailcontainer.php');
	}
}

SalesOrderController.prototype.loadSOCallback = function (changedElements) {
	this.restoreDivs(changedElements);
	this.so.trigger('SOLoaded');
}

$('#dashboardBody').html('<div> \
	Sales Order: <input type="text" id="soSalesOrder" value="" placeholder="Sales Order"> \
	Transfer Location: <input type="text" id="soLocation" value="" placeholder="Location"> <br> \
	<div id="addAssetDiv">		 \
		<div class="divCell"> \
			Asset Tags<br> \
			<textarea rows="10" cols="30" id="soAssetsAssets"></textarea><br> \
			<input value="transfer" type="button" id="soAssetsButton"><span id="soAssetsCount"></span><br> \
			<div id="soAssetsResults"></div>  \
		</div> \
		<div class="divCell"> \
			Locations/Container<br> \
			<textarea rows="10" cols="30" id="soLocationsAssets"></textarea><br> \
			<input value="transfer location" type="button" id="soLocationButton"><span id="soLocationsCount"></span> <br>  \
			<div id="soLocationsResults"></div>  \
		</div> \
		<div> \
			This does not work.  <br> \
			Product: <input id="soProductText" value="" type="text"> <input id="soProductID" value="" type="hidden"> </br> \
			<div id="searchProductSOResults"></div> \
			Qty: <input id="soQty" value="" type="text"> </br> \
			Condition: <input type="hidden" value="" id="soProductCondition"> <br>\
			<input value="add" type="button" id="soAddProductButton"> \
		</div> \
<div> Views<br> \
	<input checked="" name="soViews" type="radio" value="Container"> Container<br> \
	<input name="soViews" type="radio" value="Details"> List<br> \
	<br><br> \
</div> \
	<div id="soDiv"> \
	</div> \
</div>');
var beepAlert = new SoundAlert();
var so = new SalesOrderController("so", beepAlert);
