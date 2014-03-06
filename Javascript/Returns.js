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
	
	//Event Listener
	$('[value="add asset"]').on('click', function (event){
		$('#addOrderLineResult').val("");
		addBatchReturnAssets();
//Something is wrong here. I think onclick is being called.
		event.stopPropagation();
	//	return false; //This keeps the onclick from being run.
	});
}



var addBatchReturnAssets = function () {
	if($('#addReturnTextarea').val().length == 0) return false;
	if($('#addOrderLineResult').val().length != 0) return false;
	//Check what the result is.
	
	var array = $('#addReturnTextarea').val().split("\n");
	$('#addReturnlineAssetTag').val(array[0]);
	$('#addReturnlineLocation').val($("#addReturnLocation").val());
	
	ajaxCallback(addBatchReturnAssets);
	//Strips all text from onclick so I am left with the return number.
	var returnNumber = $("[value='add asset']").attr('onclick').replace(/\D/g,"");
	addReturnlineAsset(returnNumber + "hi");
}

/*
loadForm('editreturn.php','','returns');
*/
/*
addBatchReturnAssets() {
	while(addReturnTextarea.length > 0)
	{
		Move line 1 to hidden boxes.
		Setup ajax callback
		Run addReturnlineAsset('90') (click?)//Should happen automatically if I don't stop event bubbling.
		if
	}

}
*/


