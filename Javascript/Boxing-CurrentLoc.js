
//Current Location
//This is the object responsible for managing the current location fields, these are the current box, run report button, and the edit location field.
var CurrentLocation = function(id) {
	InputForm.call(this,id);
//Perhaps have a mixin for Location?
	this.location = $('#' + this.id + 'Location');
	this.locationForm = $('#' + this.id + 'LocationForm');
	this.locationResponse = $("#" + this.id + "Response");
	this.transferResponse = $("#" + this.id + "TransferResponse");
	this.runReportButton = $('#' + this.id + 'RunReport');
	
//Event Handlers.	
	$(window).keydown($.proxy(function(event) {
		if(event.shiftKey && event.ctrlKey && event.keyCode == 82) {
			this.runReport();
			event.preventDefault(); 
			return;
		}
	},this));

	this.location.on('change', $.proxy(function(){this.selectLocation();},this));
	this.runReportButton.on('click', $.proxy(function(){this.runReport();},this));
	this.locationForm.on('click', '[value="save"]', $.proxy(function(){this.saveOrDeleteLocation("Save");},this));
	this.locationForm.on('click', '[value="delete"]', $.proxy(function(){this.saveOrDeleteLocation("Delete");},this));
}
CurrentLocation.prototype = Object.create(InputForm.prototype);

//This is called when the current box location changes. It sets the edit location area to be the correct location. 
CurrentLocation.prototype.selectLocation = function () {
	if(this.location.val() == "") {
		this.locationForm.html("");
		return;
	}
	var changedElements = this.changeDivs(this.locationForm, "editLocationForm");
	ajaxCallback.call(this,function(){this.selectLocationCallback(changedElements)});
	selectLocation(this.location.val());
}

//This adds functionality to the save button and adds the new location transfer field. 
CurrentLocation.prototype.selectLocationCallback = function (changedElements) {
	this.restoreDivs(changedElements);
	$("#editLocationResponse").remove(); //Needed because the response div is part what is loaded.
	//Add transfer box.
	$('<br><input type="text" id="' + this.id + 'Transfer' + '" value="" placeholder="New Location">').insertAfter("#maxAssetQty");
	this.transferToLocation = $("#" + this.id + 'Transfer');

}


//Saves the location.
CurrentLocation.prototype.saveOrDeleteLocation = function(action) {
	var changedElements = this.changeDivs(this.locationResponse, "editLocationResponse"); //this.location,"editLocationID", 
	var shouldTransfer = false;
	if(action == "Save" && this.transferToLocation.val() != "") shouldTransfer = true;
	
	ajaxCallback.call(this,function(){this.saveOrDeleteLocationCallback(changedElements,shouldTransfer)});
	window.skipHide = true;
//	Either save or delete gets called after this.
}

//Once the location is saved, load it again.
CurrentLocation.prototype.saveOrDeleteLocationCallback = function (changedElements,shouldTransfer) {
	this.restoreDivs(changedElements);
	
	if(shouldTransfer) {
		this.transferLocation();
	} else {
		this.location.trigger('change');
	}
}

//This transfers the location.
CurrentLocation.prototype.transferLocation = function () {
	this.tempLocation = this.location.val();
	var changedElements = this.changeDivs(this.location, "editLocationTransferLocation", this.transferToLocation, "editLocationTransferParent", this.transferResponse, "editLocationTransferResults");
	ajaxCallback.call(this,
	function(){this.transferLocationCallback(changedElements)});
	window.skipHide = true;	
	transferLocation();
}

//Once the location is transferred, it is saved (generally, this just means that the lock status is saved). 
CurrentLocation.prototype.transferLocationCallback = function (changedElements) {
	this.restoreDivs(changedElements);
	this.location.val(this.tempLocation);
	this.location.trigger('change');
}


//Just runs the short report.
CurrentLocation.prototype.runReport = function () {
	newWindow('locations=' + this.location.val() + '&shipped=true&so=true' , 'assetcountbylocationshortprocess.php', 'reports');
}
