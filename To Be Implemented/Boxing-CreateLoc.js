
//Create Location
//This creates an object that manages the creation of new IMS boxes. 
var CreateLocation = function (id) {
	InputForm.call(this,id);

	this.searchResults = $('#' + this.id + 'SearchResults');
	this.searchField = $('#' + this.id + 'Field');
	this.searchFilter = $('#' + this.id + 'Filter');
	this.description = $('#' + this.id + 'Description');
	this.boxType = $('#' + this.id + 'location_type');
	this.maxQty = $('#' + this.id + 'MaxAssetQty');
	this.restrictedProduct = $('#' + this.id + 'ProductTypeid');
	this.restrictedCondition = $('#' + this.id + 'ProductTypeid');
	this.createResponse = $('#' + this.id + 'Response');
	this.createButton = $('#' + this.id + 'Button');
	this.productType = $('#' + this.id + 'ProductType');
	this.productCondition = $('#' + this.id + 'ProductCondition');
	this.location = $('#' + this.id + 'Location');

	
//The event handlers.	
	this.searchResults.on('click', "a", $.proxy(this.setLocation,this));
	this.description.on('keyup', $.proxy(function (event) {
		if (event.keyCode == 13 || event.keyCode == 10) {
			this.createLocation();
	} else {this.searchLocation();}},this));
	this.createButton.on('click', $.proxy(function(){this.createLocation();},this));
}
CreateLocation.prototype = Object.create(InputForm.prototype);

//This sets up a callback and calls createLocaiton.
CreateLocation.prototype.createLocation = function () {
	var changedElements = this.changeDivs(this.description,"location",this.boxType, "location_type", this.maxQty, "maxAssetQty", this.createResponse, "createLocationResponse", this.restrictedProduct, "editLocationProductType", this.restrictedCondition, "editLocationProductCondition");
	ajaxCallback.call(this,function(){this.createLocationCallback(changedElements)});
	createLocation();
}
//After createLocation is finished, sets the current box to the new box.
CreateLocation.prototype.createLocationCallback = function (changedElements) {
	this.restoreDivs(changedElements);
	this.maxQty.val("40");
	this.setBoxLocation();
//Might not work if no currentBox?
}

//Gets the location ID for the new box, and sets it as the current box.
CreateLocation.prototype.setBoxLocation = function () {
	var cleared = this.createResponse.html().split(/\n/);	
	this.createResponse.html(cleared[cleared.length - 2]);

	var asset = $('#' + this.createResponse.attr('id') + ' input[type=button]');
	asset.click();
	asset = asset.attr('onclick').substring(asset.attr('onclick').indexOf("id=")+3,asset.attr('onclick').indexOf("','"));
	this.location.val(asset);
	this.location.trigger('change');
	currentBox.assets.focus();
}

CreateLocation.prototype.setLocation = function (event) {
	var location = $(event.target).attr('href').replace("javascript: selectLocation('", "").replace("');", "");
	this.location.val(location);
	this.location.trigger('change')
	return false;
}

//Calls the searchLocation function so that the person can see what boxes have already been created.
CreateLocation.prototype.searchLocation = function () {
	var changedElements = this.changeDivs(this.searchResults, "editLocationSearchResults", this.description, "searchLocationText", this.searchField, "field", this.searchFilter, "filter");
	ajaxCallback.call(this,function(){this.searchLocationCallback(changedElements)});
	this.searchResults.hide();
	searchLocation();	
}

//Trims the searchLocation results to show the last 13 items. 
CreateLocation.prototype.searchLocationCallback = function (changedElements) {
	this.restoreDivs(changedElements);
	var responseArray = this.searchResults.html().split(/\n/);
	while(responseArray.length > 13) {
		responseArray.remove(0);
	}
	var response = "";
	responseArray.forEach(function(arrayKey){
		response += arrayKey + "\n";
	});
	
	this.searchResults.html(response);
	this.searchResults.show();
}