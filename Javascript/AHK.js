
//This is also based off the goods_receipt_addAssetSelectProduct md5	
var ahkInsertProduct = function (pid, text) {
		goods_receipt_addAssetSelectProduct(pid, $('<div/>').html(text)[0]);
}

md5Function(selectOrderlineSpec, "selectOrderlineSpec", "a793cc277d0a62be1e7d587966a45bbf");
var ahkInsertCPUType = function (cpuid, text) {
		selectOrderlineSpec(cpuid, 6, $('<div/>').html(text)[0], getEditAssetID());
}

var ahkInsertLocationAndEnterOrderLine = function (loc) {
	$('#addOrderlineLocation').val(loc); 
	$('input:button[value="add line"]')[0].click();
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
			$('input:radio[name="test16"]').eq(1).prop('checked', true);
			$('input:radio[name="test13"]').eq(0).prop('checked', true);
			$('input:radio[name="test14"]').eq(0).prop('checked', true);
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
	}
}