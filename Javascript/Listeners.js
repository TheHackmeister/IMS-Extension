//This prevents the backspace from going back a page. Important because AHK clears the shortcuts with a backspace.
window.addEventListener('keydown',function(e){
	if(e.keyIdentifier=='U+0008'||e.keyIdentifier=='Backspace'){
		if(e.target==document.body || e.target.type == "button" || e.target.type == "select-one" || e.target.type == "radio"){ 
			e.preventDefault();
		}
	}
},true);

$('<li class="folder root closed"> \
		<a href="#" onclick="showMenu(this); return false;"> \
			<div>Improved Pages</div> \
		</a> \
		<ul class="hide"> \
			<li class="contents"> \
				<a href="javascript: loadImprovedEditAsset();"> \
					<div>Improved Edit Asset</div> \
				</a> \
			</li> \
		</ul> \
	</li>').insertAfter('.leftMenu > .folder.root.closed:last');

//Upon enter, these move the focus to a more helpful box.
$('body').on('change', "#editAssetTransferLocation", function() {$('#editAssetTransferAssets').select();});
$('body').on('change', "#editAssetTransferEbayAuction", function() {$('#editAssetTransferAssets').select();});
$('body').on('change', "#editLocationTransferParent", function() {$('#editLocationTransferLocation').select();});

$('body').on('change', "#searchOrderText", function() {$('[value="search"]').click();});
$('body').on('change', "#searchAssetText", function() {$('[value="search"]').click();});
$('body').on('change', "#searchLocationText", function() {$('[value="search"]').click();});

$('body').on('change', "#addOrderlineSN", function() {$('#addOrderlineLocation').focus();});



// Triggers for selecting PO, SO, or Return
$('#dashboardBody').on('keyup', '#searchOrderText', function(e) {
if(e.keyCode == 10 || e.keyCode == 13) {

	if($('h5:contains(Edit Exchange/Return)').length > 0) {
		clickTopOption(1);
		searchReturn();
	} else if ($('h5:contains(Edit Sales Order)').length > 0) {
		clickTopOption(2);
		searchSalesOrder();
	} else if ($('h5:contains(Edit Goods Receipt)').length > 0) {
		clickTopOption(2);
		searchOrder();
	}
}
});
$('#dashboardBody').on('click', '[onclick="searchAsset()"]', function(e) {
	clickTopOption(1);
});