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
	$('#exchangeWrapper ul li').eq(1).remove();//The add product div. Can't use so I removed.
	$('#exchangeWrapper ul li a').eq(0).click();//Might as well expand the add asset div. Or I might not. Easy to change.

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
	this.returnArray = new Array();
	
	this.asset = new AssetController(id);
	
	//Events
	this.event = this.asset.event;
	//I unbind and bind to avoid duplicate bindings. A different approach would be to bind to the body and use a more specific targetter. 
	$('[value="add asset"]').off('click').on('click', $.proxy(function (event){
		this.setupReturnArrayAndStart();
	},this));
	
	this.event.on('loaded', $.proxy(function(){
		this.asset.setTest("resetAll");
		this.asset.save();
	}, this));
	
	//I have two events, one to handle when an asset is being modified, and one when it is not.
	this.event.on('saved', $.proxy(function(){
		this.returnAsset();
	}, this));
	
	this.event.on('returned', $.proxy(function(){
		this.processNextReturn();
	}, this));
}
ReturnForm.prototype = Object.create(InputForm.prototype);

ReturnForm.prototype.returnAsset = function () {
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

ReturnForm.prototype.setupReturnArrayAndStart = function (oldID) {	
	this.returnArray = this.listOfReturns.val().split("\n");
	this.processNextReturn(true);
}

ReturnForm.prototype.processNextReturn = function (firstRun) {
	if(this.results.html().length > 1) {//If there is an error. 
		this.error = ["Please re-enter the location."]
		this.event.trigger('error');
		return false;
	} else if (!firstRun) {
		//Removes the old asset number.
		var re = RegExp(this.returnArray[0] + "(?:\n|)");
		this.listOfReturns.val(this.listOfReturns.val().replace(re, "")); 	
		this.returnArray.remove(0);
		while (this.returnArray[0] == "") {
			this.returnArray.remove(0);
		}
	}
	if(this.returnArray.length == 0) {
		//This reloads the page so you can view the items just inputted. It may make more sense to not refresh the page. 
		this.asset.clearDiv();
		//I need to unbind the events associated with this because loadReturnDetail rebinds them. Removing the div does that.
		//There are weaknesses with this approach that prevent something like this being applied to SO. This is because SOs allow you to change the view.
		this.asset.asset.remove(); 
		loadReturnDetail(this.getReturnId());
		return false;
	} 

//	console.log(this.returnArray.length);
	this.currentAsset.val(this.returnArray[0]);
	this.currentLocation.val(this.listLocation.val());
	this.nextAction(this.returnArray[0]);
}

//This gets overriden if the option to not unset asset conditions is set. 
ReturnForm.prototype.nextAction = function (id) {
		this.asset.load(id);
}