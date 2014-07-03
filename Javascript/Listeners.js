//This prevents the backspace from going back a page. Important because AHK clears the shortcuts with a backspace.
window.addEventListener('keydown',function(e){
	if(e.keyIdentifier=='U+0008'||e.keyIdentifier=='Backspace'){
		if(e.target==document.body || e.target.type == "button" || e.target.type == "select-one" || e.target.type == "radio"){ 
			e.preventDefault();
		}
	}
},true);

//Upon enter, these move the focus to a more helpful box.
$('body').on('change', "#editAssetTransferLocation", function() {$('#editAssetTransferAssets').select();});
$('body').on('change', "#editAssetTransferEbayAuction", function() {$('#editAssetTransferAssets').select();});
$('body').on('change', "#editLocationTransferParent", function() {$('#editLocationTransferLocation').select();});

/*
$('body').on('change', "#searchText", function(){clickTopListener.apply(this,arguments);});
$('body').on('keyup', '#searchText', clickTopListener);
$('body').on('click', '[onclick="searchAsset()"]', function(e) {
	clickTopListener(1);
});
*/

$('body').on('keyup', "#searchText", function(e) {if(e.keyCode == 10 || e.keyCode == 13) $('[value="search"]').click();});
$('body').on('click', '[value="search"]', function(e) {
	clickTopOption(1);
});


$('body').on('change', "#addOrderlineSN", function() {$('#addOrderlineLocation').focus();});
$('body').on('change', "[placeholder='SN']", function() {$(this).parent().parent().find('[placeholder="location"]').focus();});

$('body').on('click', '#editOrderlineDetailChild input[value="save"]', function() {scrollWindow('fifth');}); 
$('body').on('click', 'h6:contains(Children)', function() {$(this).parent().parent().find('input:eq(1)').select();});




var clickTopListener = function (e) {
	if(e.keyCode == 10 || e.keyCode == 13) {
/*		if($('h5:contains(Edit Exchange/Return)').length > 0) {
			clickTopOption(1);
			searchReturn();
		} else if ($('h5:contains(Edit Sales Order)').length > 0) {
			clickTopOption(2);
			searchSalesOrder();
		} else if ($('h5:contains(Edit Goods Receipt)').length > 0) {
			clickTopOption(2);
			searchOrder();
		} else if($('h5:contains(Edit Location)').length > 0) {
			clickTopOption(1);
			searchLocation();
		}
	}
*/	
		clickTopOption(1);
		$('[value="search"]').click();		
	}
}

