	
////////////////////////////////////////////////
var Loc = function (id) {
	this.id = id;
	this.location = $('#' + id + 'Location');
	this.results = $('#' + id + 'Results');
	this.assets  = $("#" + id + 'Assets');	
}
Loc.prototype = Object.create(InputForm.prototype);


Loc.prototype.transfer = function() {
	var changedElements = this.changeDivs(this.location, "editAssetTransferLocation", this.assets, "editAssetTransferAssets", this.results, "editAssetTransferResults"); 
	ajaxCallback.call(this,function(){this.transferCallback(changedElements)});
	transferAssets();
}

Loc.prototype.transferCallback = function(changedElements) {
	this.restoreDivs(changedElements);
	this.assets.trigger('transfered');
}

Loc.prototype.getFirstAndLastAsset = function () {
	var list = this.assets.val().replace(/^\s*[\r\n]/gm, "").split(/\n/);
	if(list[list.length - 1] == "") {list.pop();}
	
	return [list[0], list[list.length - 1]];
}


//////////////////////////////
var TransferWithCount = function (id) {
	Loc.apply(this,arguments);
	this.count = $("#" + id + 'Count');
	this.submit = $("#" + id + 'Button');
}
TransferWithCount.prototype = Object.create(Loc.prototype);

//Calls the transferAssetCount function.
TransferWithCount.prototype.countAssets = function () {
	var changedElements = this.changeDivs(this.assets, "editAssetTransferAssets", this.count, "count"); 
	transferAssetsCount();
	this.restoreDivs(changedElements);
}


/////////////////////////////////////////////////////
var TransferWithPreCheck = function (id, soundObject) {
	this.id = id;
	//this.condition = $('#' + id + 'Condition');
	this.checkType = $('#' + id + 'CheckType');
	//this.location = new Loc(id);
	TransferWithCount.apply(this,arguments);
		//location
		//assets
		//results
	this.asset = new AssetController(id);
	this.beep = soundObject || beepAlert;
	
//Event Handlers
//	this.submit.on('click',$.proxy(function() {$('#asset1EditDiv').html("");this.startSettingCondition();},this));
//	this.asset.asset.on('loaded', $.proxy(function () {this.asset.setCondition(this.getCondition());},this));
//	this.asset.asset.on('conditionSet', $.proxy(function() {this.save();},this.asset));
//	this.asset.asset.on('saved', $.proxy(function() {this.continueSettingCondition();}, this));
	
	
//Maybe consider putting this one child lower. Other option is to override this.preCheck.
/*	this.assets.on('keyup', $.proxy(function(event){
	   if (event.keyCode == 13 || event.keyCode == 10) {
			this.countAssets();
			this.preCheck();
		} else {
			this.countAssets();
		}
	},this));*/
}
TransferWithPreCheck.prototype = Object.create(TransferWithCount.prototype);


//Consider how to merge with load.
TransferWithPreCheck.prototype.preCheck = function(id) {	
	if(this.checkType.val() == "off") return;
//	$('#asset1EditDiv').html("")
	var ids = this.getFirstAndLastAsset();
	id = id || ids[1];
	this.firstID = ids[0];
	var changedElements = this.changeDivs(this.asset.editAssetDiv, "editAssetForm"); 	
	ajaxCallback.call(this,function(){this.preCheckCallback(changedElements,id)});
	selectAsset(id);
}

TransferWithPreCheck.prototype.preCheckCallback = function(changedElements,id) {
	this.restoreDivs(changedElements);

	var asset = this.asset.getAsset(id);
	
	//If it didn't work.
	if (typeof(asset.assetType) == 'undefined') {
		this.badAssetAlert(asset[0],asset[1]);
		return;
	}
	
	var comparison = this.setupComparison(asset, id);
	
	var result = asset.compare(comparison);
	if(result == true) {
		this.goodAssetAlert();
	} else {
		this.badAssetAlert(result, id);
	}
}

//Override this to change preCheck.
TransferWithPreCheck.prototype.setupComparison = function (asset, id) {
	if (id == this.firstID) {
		this.firstAsset = asset;
//		this.productDiv.html(this.firstAsset.product || "");
	}
	return this.firstAsset;
}

//I'd like to pass in a beepAlert reference rather than call it directly.
TransferWithPreCheck.prototype.goodAssetAlert = function () {
	if(this.count.html() == "(40 assets)") 
		this.beep.play(1000, "Good");
	else
		this.beep.play(150, "Good");
}
TransferWithPreCheck.prototype.badAssetAlert = function (message, id) {
	this.beep.play(500, "Bad", $.proxy(function(){this.badAssetAlertCallback(message,id);},this));
}

TransferWithPreCheck.prototype.badAssetAlertCallback = function (message,id) {
	var response = confirm(message + "\nRemove asset?");
	
	if(response==true) {
		this.assets.val(this.assets.val().replace(id + '\n',''));
		this.countAssets();
	}
}