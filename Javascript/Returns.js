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
	$('<input type="text" id="addReturnLocation">').insertBefore('h6:contains(Asset ID)');
	$('<textarea id="addReturnTextarea" rows="15">').insertAfter('#addReturnlineAssetTag');
	$('#addOrderLineResult').attr("id", "addReturnResult");
	$('#addReturnlineAssetTag').hide();
	$('#addReturnlineLocation').hide();

	//Removes onclick. 	
	$('[value="add asset"]').attr("onclick", ""); 
	var returnForm = new ReturnForm("addReturn");
}

var ReturnForm = function (id) {
	this.id = id || this.generateID();
	this.listLocation = this.generateElement("Location");
	this.listOfReturns = this.generateElement("Textarea");
	this.currentAsset = this.generateElement("lineAssetTag");
	this.currentLocation = this.generateElement("lineLocation");
	this.results = this.generateElement("Result");
	
	this.asset = new AssetController(id);
	
	//Events
	this.event = this.asset.event;

	//I unbind and bind to avoid duplicate bindings. A different approach would be to bind to the body and use a more specific targetter. 
	$('[value="add asset"]').off('click').on('click', $.proxy(function (event){
		this.setReturnResults("");
		var id = this.prepare();
		this.asset.load(id);
	},this));
	
	this.event.on('loaded', $.proxy(function(){
		console.log("Loaded");
		this.asset.setTest("resetAll");
		this.asset.save();
	}, this));
	
	this.event.on('saved', $.proxy(function(){
		console.log("Saved");
		this.returnAsset();
	}, this));
	
	this.event.on('returned', $.proxy(function(){
		console.log("Returned");
// I have reservations about the way getAssetId works which I need to address.
// I think it should be ok.
		var id = this.prepare(this.asset.getAssetID());
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
		this.error = ["Please re-enter the location."]
		this.event.trigger('error');
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
		this.asset.clearDiv();
//This has to be here... But I don't understand why. I wonder if it has to do with an event? 
		this.asset.asset.remove(); 
		loadReturnDetail(this.getReturnId());
		return false;
	}

	//Gets the first line of the text area.
	var array = this.listOfReturns.val().split("\n");
	this.currentAsset.val(array[0]);
	this.currentLocation.val(this.listLocation.val());
	return array[0];
}

