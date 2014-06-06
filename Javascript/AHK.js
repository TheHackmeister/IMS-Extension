
//This is also based off the goods_receipt_addAssetSelectProduct md5	
var ahkInsertProduct = function (pid, text) {
	var lastFocused = $(window.lastFocused);
	
	var divElement = $('<div id="' + getEditAssetID(lastFocused.parents('#editOrderlineDiv')) + '"/>');	
	var liElement = $('<li/>').html(text);
	divElement.append(liElement);
	
	if(lastFocused.parents('#editAssetChildrenWrapper').length > 0) {
		addChildSelectProduct(pid, liElement[0]);
		
	} else {
		goods_receipt_addAssetSelectProduct(pid, $('<div/>').html(text)[0]);
	}		
}

md5Function(selectOrderlineSpec, "selectOrderlineSpec", "a793cc277d0a62be1e7d587966a45bbf");
var ahkInsertCPUType = function (cpuid, text) {
		selectOrderlineSpec(cpuid, 6, $('<div/>').html(text)[0], getEditAssetID());
}

var ahkSaveAsset = function () {
	var lastFocused = $(window.lastFocused);
	var asset = getEditAssetID(lastFocused.parents('#editOrderlineDiv'));
	if(lastFocused.parents('#editAssetChildrenWrapper').length > 0) {
		saveChildAsset(asset);
	} else {
		saveAsset(asset);
	}		
}

var ahkInsertLocationAndEnterOrderLine = function (loc) {
	var lastFocused = window.lastFocused;
	//If child asset.
	if(lastFocused.parents('#editAssetChildrenWrapper').length > 0) { 
		lastFocused.parents('#editAssetChildrenWrapper').find('[placeholder="location"]').val(loc);
		lastFocused.parents('#editAssetChildrenWrapper').find('input[value="create"]').click();
	//If Product.
	} else if(lastFocused.parents('li').find('h6:contains(Add Product)').length > 0) {
		lastFocused.parents('li').find('#addProductLineQTY').val(loc);
		lastFocused.parents('li').find('input[value="add line"]').click();
	//Standard Asset.
	} else {
		$('#addOrderlineLocation').val(loc); 
		$('input:button[value="add line"]')[0].click();
	}
}

var ahkInsertCondition = function(cond) {
	var editDiv = window.lastFocused.parents('#editOrderlineDiv');
	switch(cond) {
	case "Good":
		if(editDiv.find('input:radio[name="test2"]').length > 0) {
			editDiv.find('input:radio[name="test2"]').eq(0).prop('checked', true);
		} else {
			editDiv.find('input:radio[name="test16"]').eq(0).prop('checked', true);
			editDiv.find('input:radio[name="test13"]').eq(0).prop('checked', true);
			editDiv.find('input:radio[name="test14"]').eq(0).prop('checked', true);
		}
	break;
	
	case "Good Base":
		editDiv.find('input:radio[name="test16"]').eq(0).prop('checked', true);
		editDiv.find('input:radio[name="test13"]').eq(1).prop('checked', true);
		editDiv.find('input:radio[name="test14"]').eq(0).prop('checked', true);
	break;
	
	case "Broken":
		if(editDiv.find('input:radio[name="test2"]').length > 0) {
			editDiv.find('input:radio[name="test2"]').eq(1).prop('checked', true);
		} else {
			editDiv.find('input:radio[name="test16"]').eq(1).prop('checked', true);
			editDiv.find('input:radio[name="test13"]').eq(0).prop('checked', true);
			editDiv.find('input:radio[name="test14"]').eq(0).prop('checked', true);
		}
	break;
	
	case "Damaged":
		editDiv.find('input:radio[name="test16"]').eq(1).prop('checked', true);
		editDiv.find('input:radio[name="test13"]').eq(1).prop('checked', true);
		editDiv.find('input:radio[name="test14"]').eq(0).prop('checked', true);
	break;
	
	case "Low Grade":
		editDiv.find('input:radio[name="test16"]').eq(1).prop('checked', true);
		editDiv.find('input:radio[name="test13"]').eq(1).prop('checked', true);
		editDiv.find('input:radio[name="test14"]').eq(1).prop('checked', true);
	break;
	
	case "HD Good":
		editDiv.find('input:radio[name="test2"]').eq(0).prop('checked', true);
	break;
	
	case "HD Good Quick":
		editDiv.find('input:radio[name="test2"]').eq(0).prop('checked', true);
		editDiv.find('input:radio[name="test15"]').eq(0).prop('checked', true);	
	break;
	
	case "HD Good All":
		editDiv.find('input:radio[name="test2"]').eq(0).prop('checked', true);
		editDiv.find('input:radio[name="test15"]').eq(0).prop('checked', true);	
		editDiv.find('input:radio[name="test10"]').eq(0).prop('checked', true);	
	break;
	}
}


function switchSize(id) {
	ajaxCallback(replaceSize);
	selectAsset(id);
}


function swapHDDConnector() {
	swapProductName("IDE", "SATA");
}

function swapHDDFormFactor() {
	swapProductName("3.5 IN", "LPTP");
}

function swapProductName(swap1, swap2) {
	var item = $('#editOrderlineProductSearchText' + getEditAssetID()).val()
	item = item.replace("GENERIC ","");
	if(item.indexOf(swap1) > 0) {
		item = item.replace(swap1, swap2);
	} else if (item.indexOf(swap2) > 0 ) {
		item = item.replace(swap2, swap1);
	} else {
		return;
	}
	
	$('#editOrderlineProductSearchText' + getEditAssetID()).val(item);
	ajaxCallback(clickNewAssetName);
	$('#editOrderlineProductSearchText' + getEditAssetID()).trigger('keyup');
}


function clickNewAssetName() {
	$('#editOrderlineProductSearchResults' + getEditAssetID() + " a").eq(0).click();
	saveAsset(getEditAssetID());
	//ajaxCallback();
}
