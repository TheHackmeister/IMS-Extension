/*
loadForm('editreturn.php','','returns');
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
	$('#addReturnlineAssetTag').hide();
	$('#addReturnlineLocation').hide();

	//Removes onclick. 	
	$('[value="add asset"]').attr("onclick", ""); 
	//Event Listener
	$('[value="add asset"]').on('click', function (event){
		$('#addOrderLineResult').html("");
		addBatchReturnAssets();
	});
}

var addBatchReturnAssets = function (oldAsset) {
	var listLocation = $("#addReturnLocation");
	var listOfReturns = $('#addReturnTextarea');
	var currentAsset = $('#addReturnlineAssetTag');
	var currentLocation = $('#addReturnlineLocation');
	var results = $('#addOrderLineResult');
	
	var returnID = $('#returnID').val();
	if(results.html().length > 1) {//If there is an error. 
		return false;
	} else {
		var oldA = oldAsset || false;
		if (oldA) {
			//Removes the old asset number.
			var re = RegExp(oldA + "(?:\n|)");
			listOfReturns.val(listOfReturns.val().replace(re, "")); 
		}
	}
	if(listOfReturns.val().length == 0) {
		//This reloads the page so you can view the items just inputted. It may make more sense to not refresh the page. 
		loadReturnDetail(returnID);
		return false;
	}

	
	//Gets the first line of the text area.
	var array = listOfReturns.val().split("\n");
	currentAsset.val(array[0]);
	currentLocation.val(listLocation.val());
	
	ajaxCallback(function(){addBatchReturnAssets(array[0]);});
	addReturnlineAsset(returnID);
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