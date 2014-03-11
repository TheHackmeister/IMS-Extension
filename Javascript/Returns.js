/*
loadForm('editreturn.php','','returns');
transferReport();
*/

// Reorganizes the returns once the load return button is pressed. 
var loadReturnDetailOld = loadReturnDetail;
var loadReturnDetail = function () {
	ajaxCallback(reorganizeReturns);
	loadReturnDetailOld.apply(this,arguments);
}

var reorganizeReturns = function () {
	//This moves around the elements.
	$('h6:contains(Location Key)').insertBefore('h6:contains(Asset ID)');
	$('#addReturnlineLocation').insertBefore('h6:contains(Asset ID)');
	$('<input type="text" id="addReturnLocation" rows="15">').insertBefore('h6:contains(Asset ID)');
	$('<textarea id="addReturnTextarea" rows="15">').insertAfter('#addReturnlineAssetTag');
	$('#addOrderLineResult').id("addReturnResult");
	$('#addReturnlineAssetTag').hide();
	$('#addReturnlineLocation').hide();

	//Removes onclick. 	
	$('[value="add asset"]').attr("onclick", ""); 
	
	var returnForm = new ReturnForm("addReturn");
	
	//Event Listener
	$('[value="add asset"]').on('click', $.proxy(function (event){
		this.setReturnResults("");
		this.prepare();
	},returnForm));
}

var ReturnForm = function (id) {
	this.listLocation = generateElement("addReturnLocation");
	this.listOfReturns = generateElement("addReturnTextarea");
	this.currentAsset = generateElement("addReturnlineAssetTag");
	this.currentLocation = generateElement("addReturnlineLocation");
	this.results = generateElement("addReturnResult");
	
	this.asset = new AssetController();
	
	//Events
	this.event = this.asset.event;
	this.event.on('loaded', $.proxy(function(){
		this.asset.setTest("resetAll");
		this.asset.save();
	}, this));
	
	this.event.on('saved', $.proxy(function(){
		this.returnAsset();
	}, this));
	
	this.event.on('returned', $.proxy(function(){
// I have reservations about the way getAssetId works which I need to address.
// I think it should be ok.
		var id = this.prepare(this.asset.getAssetId());
		this.asset.load(id);
	}, this));
}
ReturnForm.prototype = Object.create(InputForm.prototype);

ReturnForm.prototype.returnAsset = function (id) {
	var changedElements = this.changeDivs(this.results, "addOrderLineResult"); 
	ajaxCallback.call(this,function(){this.returnAssetCallback(changedElements)});
	addReturnlineAsset(this.getReturnId());
}

ReturnForm.prototype.returnAssetCallback = function (changedElements, id) {
	this.restoreDivs(changedElements);
	this.event.trigger("returned");
}

ReturnForm.prototype.getReturnId = function () {
	return $('#returnID').val();
}

ReturnForm.prototype.setReturnResults = function (text) {
	this.results.html(text);
}


ReturnForm.prototype.prepare = function (oldAsset) {// oldAsset
	if(this.results.html().length > 1) {//If there is an error. 
//Should have error text here.
		return false;
	} else {
		var oldA = oldAsset || false;
		if (oldA) {
			//Removes the old asset number.
			var re = RegExp(oldA + "(?:\n|)");
			this.listOfReturns.val(this.listOfReturns.val().replace(re, "")); 
		}
	}
	
	if(this.listOfReturns.val().length == 0) {
		//This reloads the page so you can view the items just inputted. It may make more sense to not refresh the page. 
		loadReturnDetail(this.getReturnId());
		return false;
	}

	//Gets the first line of the text area.
	var array = this.listOfReturns.val().split("\n");
	this.currentAsset.val(array[0]);
	this.currentLocation.val(listLocation.val());
	return array[0];
}


//loadDetail is broken as of 3/10 on ims-responsive. It is the same call as the normal IMS page, but is missing html. 
var loadDetailOld = loadDetail;
var loadDetail = function() {
	var returnID = $('#returnID').val() || false;
	if(returnID) {
		ajaxCallback(function(){loadReturnDetail(returnID);});
	} else {
		loadDetailOld.apply(this, arguments);
	}	
}