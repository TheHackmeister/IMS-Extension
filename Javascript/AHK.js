
//This is also based off the goods_receipt_addAssetSelectProduct md5	
var ahkInsertProduct = function (pid, text) {
		goods_receipt_addAssetSelectProduct(pid, $('<div/>').html(text)[0]);
}

md5Function(selectOrderlineSpec, "selectOrderlineSpec", "a793cc277d0a62be1e7d587966a45bbf");
var ahkInsertCPUType = function (cpuid, text) {
		selectOrderlineSpec(cpuid, 6, $('<div/>').html(text)[0], getEditAssetID());
}

var ahkInsertLocationAndEnterOrderLine = function (loc) {
	var lastFocused = window.lastFocused;
	if(lastFocused.isChildOf('#editAssetChildrenWrapper')) {
		lastFocus.parent('#editAssetChildrenWrapper').find('[placeholder="location"]').val(loc);
		lastFocus.parent('#editAssetChildrenWrapper').find('input[value="create"]').click();
	} else {
		$('#addOrderlineLocation').val(loc); 
		$('input:button[value="add line"]')[0].click();
	}
}

var ahkInsertCondition = function(cond) {

	switch(cond) {
	case "Good":
		if($('input:radio[name="test2"]').length > 0) {
			$('input:radio[name="test2"]').eq(0).prop('checked', true);
		} else {
			$('input:radio[name="test16"]').eq(0).prop('checked', true);
			$('input:radio[name="test13"]').eq(0).prop('checked', true);
			$('input:radio[name="test14"]').eq(0).prop('checked', true);
		}
	break;
	
	case "Good Base":
		$('input:radio[name="test16"]').eq(0).prop('checked', true);
		$('input:radio[name="test13"]').eq(1).prop('checked', true);
		$('input:radio[name="test14"]').eq(0).prop('checked', true);
	break;
	
	case "Broken":
		if($('input:radio[name="test2"]').length > 0) {
			$('input:radio[name="test2"]').eq(1).prop('checked', true);
		} else {
			$('input:radio[name="test16"]').eq(1).prop('checked', true);
			$('input:radio[name="test13"]').eq(0).prop('checked', true);
			$('input:radio[name="test14"]').eq(0).prop('checked', true);
		}
	break;
	
	case "Damaged":
		$('input:radio[name="test16"]').eq(1).prop('checked', true);
		$('input:radio[name="test13"]').eq(1).prop('checked', true);
		$('input:radio[name="test14"]').eq(0).prop('checked', true);
	break;
	
	case "Low Grade":
		$('input:radio[name="test16"]').eq(1).prop('checked', true);
		$('input:radio[name="test13"]').eq(1).prop('checked', true);
		$('input:radio[name="test14"]').eq(1).prop('checked', true);
	break;
	
	case "HD Good":
		$('input:radio[name="test2"]').eq(0).prop('checked', true);
	break;
	
	case "HD Good Quick":
		$('input:radio[name="test2"]').eq(0).prop('checked', true);
		$('input:radio[name="test15"]').eq(0).prop('checked', true);	
	break;
	
	case "HD Good All":
		$('input:radio[name="test2"]').eq(0).prop('checked', true);
		$('input:radio[name="test15"]').eq(0).prop('checked', true);	
		$('input:radio[name="test10"]').eq(0).prop('checked', true);	
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
