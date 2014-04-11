
//This form manages the asset transfer boxes. 
var TransferAssetsForm = function(id, soundObject) {
	TransferWithPreCheck.apply(this,arguments);

//	this.beep = soundObject;
//	this.location = $("#" + id + 'Location');
	this.checkType = $("#" + id +  'SimpleCheck');
//	this.assets  = $("#" + id + 'Assets');		
//	this.results = $("#" + id + 'Results');
//	this.count = $("#" + id + 'AssetsCount');
//	this.submit = $("#" + id + 'Submit');
	this.productDiv = $("#" + id + 'ProductName');
//	this.assetTempLocation = $("#" + id + 'Temp');
//	Create a div to display first product.
	this.firstAsset;
	this.currentAsset;

//Event Handlers
	this.assets.on('keyup', $.proxy(function(event){
	   if (event.keyCode == 13 || event.keyCode == 10) {
			this.countAssets();
			this.preCheck();
		} else {
			this.countAssets();
		}
	},this));
	this.submit.on('click',$.proxy(function() {this.transfer();},this));
}
TransferAssetsForm.prototype = Object.create(TransferWithPreCheck.prototype);


TransferAssetsForm.prototype.setupComparison = function (asset, id) {
	if (id == this.firstID) {
		this.firstAsset = asset;
		this.productDiv.html(this.firstAsset.product || "");
	}
	return this.firstAsset;
}


/*
//Sets up the needed elements and calls transferAssets.
TransferAssetsForm.prototype.transfer = function() {
	var changedElements = this.changeDivs(this.location, "editAssetTransferLocation", this.assets, "editAssetTransferAssets", this.results, "editAssetTransferResults"); 
	ajaxCallback.call(this,function(){this.transferCallback(changedElements)});
	transferAssets();
}
TransferAssetsForm.prototype.transferCallback = function(changedElements) {
	this.restoreDivs(changedElements);
	this.productDiv.html("");
}

//This will run a pre check on the asset. It calls edit asset to get the asset specs. 
//Figure out what to do if first is different.
TransferAssetsForm.prototype.preCheck = function() {
	if(this.checkType.val() == "off") return;
	var list = this.assets.val().replace(/^\s*[\r\n]/gm, "");
	list = list.split(/\n/);
	if(list[list.length - 1] == "") {list.pop();}


	var firstID = list[0];
	var currentID = list[list.length - 1];

	var string = "ID="+currentID;
	var file = 'selectasset.php';
//Need to fix this. Should go to this.assetTempLocation.
	var code = 'document.getElementById("' + this.assetTempLocation.attr('id') +  '").innerHTML = response;';
	code += 'hideLoading();';
	ajaxCallback.call(this,function(){this.preCheckCallback(firstID,currentID)});
	ajax(string, file, code, 'assets');
}

//This takes information from the edit asset form and puts it into a product object and compares that to the first product object. 
TransferAssetsForm.prototype.preCheckCallback = function(first,currentID) {

	var assetID = $("#editAssetID").val();
	
	if(typeof(assetID) == 'undefined' || assetID != currentID) {
		this.currentAsset = {};
		this.currentAsset.assetID = currentID;
		this.badAssetAlert("The item with the ID of " + currentID + " doesn't exist or has been deleted.");
		this.assetTempLocation.html("");
		return false;
	} 
		
	var type;
	var checkType;
	if (this.checkType.val() == "true")
		checkType = "simple";


	if($("[name='spec10']").length != 0) {
		type = "hard drive";
	} else {
		type = "laptop";
	}
			
	if(checkType == "simple") {
		this.currentAsset = new Asset(assetID,type);
	} else if (type == "hard drive") {
		this.currentAsset = new Product(assetID,type);
	} else if (type == "laptop") {
		this.currentAsset = new Laptop(assetID,type);
	}
	
	if (this.currentAsset.assetID == first) {
		this.firstAsset = this.currentAsset;
		this.productDiv.html(this.firstAsset.product || "");
	}
	
	this.assetTempLocation.html("");
	var result = this.currentAsset.compare(this.firstAsset);

	if(result == true) {
		this.goodAssetAlert();
	} else {
		this.badAssetAlert(result);
	}
}
//Calls the transferAssetCount function.
TransferAssetsForm.prototype.countAssets = function () {
	var changedElements = this.changeDivs(this.assets, "editAssetTransferAssets", this.count, "count"); 
	transferAssetsCount();
	this.restoreDivs(changedElements);
}
//I'd like to pass in a beepAlert reference rather than call it directly.
TransferAssetsForm.prototype.goodAssetAlert = function () {
	if(this.count.html() == "(40 assets)") 
		this.beep.play(1000, "Good");
	else
		this.beep.play(150, "Good");
}
TransferAssetsForm.prototype.badAssetAlert = function (message) {
	var loc = this.assets.attr('id');
	this.beep.play(500, "Bad", $.proxy(function(){this.badAssetAlertCallback(message);},this));
//	beepAlert.playBad($.proxy(function(){this.badAssetAlertCallback(mesage);},this));
}

TransferAssetsForm.prototype.badAssetAlertCallback = function (message) {
//	alert(message);
	var response = confirm(message + "\nRemove asset?");
	
	if(response==true) {
		this.assets.val(this.assets.val().replace(this.currentAsset.assetID + '\n',''));
		this.countAssets();
	}
}*/
