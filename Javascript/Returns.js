/*
loadForm('editreturn.php','','returns');
transferReport();
*/
/*
// Reorganizes the returns once the load return button is pressed. 
var loadReturnDetailOld = loadReturnDetail;
var loadReturnDetail = function () {
//Need two because when deleting an asset, hideLoading has to get called twice.
	ajaxCallback(reorganizeReturns);
	loadReturnDetailOld.apply(this,arguments);
}
*/

md5Function(loadReturnDetail, "loadReturnDetail", "16391ccbebdac92decb482657abd84b1");
var loadReturnDetail = function (id){
	var string = "ID="+id;
    var file = 'editreturndetail.php';

    ajax(string, file, function(response){
    	document.getElementById("editReturnDetail").innerHTML = response;
    	showBreadcrumbNavIcon('edit', 'fourth');
		reorganizeReturns();
    }, 'returns');
} 
/*
var deleteReturnlineOld = deleteReturnline;
var deleteReturnline = function () {
	ajaxCallback(reorganizeReturns, 2);
	deleteReturnlineOld.apply(this,arguments);
}
*/

var reorganizeReturns = function () {
	if(typeof($('#addReturnTextarea').val()) != 'undefined') return;
	
	//This moves around the elements.
	$('h6:contains(Location Key)').eq(0).insertBefore('h6:contains(Asset ID)');
	$('#addReturnlineLocation').insertBefore('h6:contains(Asset ID)');
	$('<textarea id="addReturnTextarea" rows="15">').insertAfter('#addReturnlineAssetTag');
	$('<input type="text" id="addReturnLocation">').insertBefore('h6:contains(Asset ID)')
		.on('change', function() {$('#addReturnTextarea').focus()});
	$('#addOrderLineResult').attr("id", "addReturnResult");
	$('#addReturnlineAssetTag').hide();
	$('#addReturnlineLocation').hide();
	$('#exchangeWrapper ul li').eq(1).remove();//The add product div. Can't use so I removed.
	$('#exchangeWrapper ul li a').eq(0).click();//Might as well expand the add asset div. Or I might not. Easy to change.
	
	//Removes onclick. 	
	$('[value="add asset"]').attr("onclick", ""); 
//Should not be global
	returnForm = new ReturnForm("addReturn");
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
console.log("clicked");
		this.setupReturnArrayAndStart();
	},this));
	
	this.event.off('loaded').on('loaded', $.proxy(function(){
console.log("loaded");
		this.asset.setTest("resetAll");
		this.asset.save();
	}, this));
	
	//I have two events, one to handle when an asset is being modified, and one when it is not.
	this.event.off('saved').on('saved', $.proxy(function(){
console.log("saved");
		this.returnAsset();
	}, this));
	
	this.event.off('returned').on('returned', $.proxy(function(){
console.log("returned");	
		this.processNextReturn();
	}, this));
}
try {
ReturnForm.prototype = Object.create(InputForm.prototype);
} catch (err) { location.reload(); }

ReturnForm.prototype.returnAsset = function () {
console.log("Return Start");		
console.log(this);		
	hideLoading();
	var changedElements = this.changeDivs(this.results, "addOrderLineResult"); 
	ajaxCallback.call(this,function(){this.returnAssetCallback(changedElements)});
	addReturnlineAsset(this.getReturnId());
console.log("Return Start/End");			
}

ReturnForm.prototype.returnAssetCallback = function (changedElements) {
console.log("Return callback");		
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
console.log("Setup Array");		
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
console.log("Not first run");		
		var re = RegExp(this.returnArray[0] + "(?:\n|)");
		this.listOfReturns.val(this.listOfReturns.val().replace(re, "")); 	
		this.returnArray.remove(0);
		while (this.returnArray[0] == "") {
			this.returnArray.remove(0);
		}
	}
	if(this.returnArray.length == 0) {
console.log("Unsetting Div");		
		//This reloads the page so you can view the items just inputted. It may make more sense to not refresh the page. 
		loadReturnDetail(this.getReturnId());
		return false;
	} 
console.log("Setup");		
//	console.log(this.returnArray.length);
	this.currentAsset.val(this.returnArray[0]);
	this.currentLocation.val(this.listLocation.val());
	this.nextAction(this.returnArray[0]);
}

//This gets overriden if the option to not unset asset conditions is set. 
ReturnForm.prototype.nextAction = function (id) {
console.log("Next Action (Load) " + id);		
		this.asset.load(id);
}



