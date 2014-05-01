

//Create a replacement function for the AHK program. 
md5Function(goods_receipt_addAssetSelectProduct, "goods_receipt_addAssetSelectProduct", "f73794d7c2c01f8fd9091f6d6cc6b870");
var goods_receipt_addAssetSelectProductOld = goods_receipt_addAssetSelectProduct;
var goods_receipt_addAssetSelectProduct = function() {
	$('#addOrderlineSN').focus();
	goods_receipt_addAssetSelectProductOld.apply(this,arguments);
}

//I override this to not trigger when the first character is a ;, which is what I start all of my AHK shortcuts with.
md5Function(goods_receipt_addAssetSearchProduct,"goods_receipt_addAssetSearchProduct", "07686248460e526e055b9b6ba5f43d22");
var goods_receipt_addAssetSearchProductOld = goods_receipt_addAssetSearchProduct;
var goods_receipt_addAssetSearchProduct = function (event){    
	if($('#addAssetProductSearchText').val().indexOf(";") == 0) {
		return;
	} 
	goods_receipt_addAssetSearchProductOld.apply(this,arguments);
} 

//Calls the addOrderline function, and sets up callback for clicking print and setting focus to the External Asset field upon load.
md5Function(goods_receipt_addLine, "goods_receipt_addLine", "0417193737169515bd0ea61164dc1b01");
//This is temporary until Brad removes the error on line 25.
var goods_receipt_addLine = function(id){
    var product = document.getElementById('addAssetProductID').value;        
    var order = id;
    //var qty = document.getElementById('addOrderlineQTY').value;
    var sn = document.getElementById('addOrderlineSN').value;

    var condition = '';
    if($('#addAssetOrderlineConditionDropDown').length > 0){
        condition = "&condition=" + document.getElementById('addAssetOrderlineConditionDropDown').value;
    }

    var location = '';
    if($('#addOrderlineLocation').length){
        location = "&location="+document.getElementById('addOrderlineLocation').value;
    }

    var desc = document.getElementById('addAssetProductSearchText').value;
    
    //var string = "product="+product+"&order="+order+"&qty="+qty+"&sn="+sn+"&location="+location+"&desc="+desc;
	var string = "product="+product+"&order="+order+"&sn="+sn+"&qty="+"&desc="+desc + location + condition;
    var file = 'addorderline.php';

    ajax(string, file, function(response){
    	if(response.indexOf("Re-enter location key") == -1 && response.indexOf("SN exists. No duplicate SN allowed.") == -1){          
	         document.getElementById('addAssetProductID').value = '';
	         //document.getElementById('addOrderlineQTY').value = '';
	         document.getElementById('addOrderlineSN').value = '';
	         document.getElementById('addOrderlineLocation').value = '';
             document.getElementById('addAssetProductSearchItemNumberText').value = '';
	         document.getElementById('addAssetProductSearchText').value = '';
             $('#addAssetOrderlineConditionDropDown').val('NULL');
	         document.getElementById('addOrderlineResult').value = 'Asset Added';

	         $('#orderlineTable').prepend(response);
			 
			//Begin add
			$('a:contains(print)')[0].click();
			$('#orderlineTable a')[0].click();
			//End add
	    } 
	    else{
	         document.getElementById("addOrderlineResult").innerHTML = response;
	    } 
    }, 'goods_receipt');
} 


var goods_receipt_addLineOld = goods_receipt_addLine;
var goods_receipt_addLine = function() {
	window.skipHide = true;
	$('#addOrderlineResult').html("");
	goods_receipt_addLineOld.apply(this,arguments);
}

md5Function(editOrderline, 'editOrderline', "1216128b9d9d6d37a1badd69cbf3f9ea");
var editOrderline = function (id, e){
    var row = $(e).closest("tr")[0];

    var string = "ID="+id;

    $("tr").removeClass('selected');
    $(row).addClass('selected');
    var file = 'selectasset.php';

    ajax(string, file, function(response){
    	document.getElementById("editOrderlineDetail").innerHTML = response;
    	showBreadcrumbNavIcon('edit', 'fifth');
		addOrderLineListener();
    }, 'assets');	
}
var addOrderLineListener = function() {
	if($('#addOrderlineResult').eq(0).html() != "") {
		hideLoading();
		return;
	}
	if($('#template' + getEditAssetID()).length > 0) {
		$('a:contains(Templates:)').click();
		$('#specTemplate' + getEditAssetID()).prop('checked', true);
		$('#testTemplate' + getEditAssetID()).prop('checked', true);
		
		if($('#template' + getEditAssetID() + ' option').length == 2) {
			$('#template' + getEditAssetID() + ' option').eq(1).prop('selected', true);
			$('[value="APPLY"]').click();
		} 
	}
	$('#editOrderlineExternalAsset').focus().val($('#editOrderlineExternalAsset').val());
};


//Returns true if actions should be stopped. False if actions should continue.
var checkEAN = function () {
	var po = getPONumber();
	var check = true; 
	var wrapper = function () {
		if(po != getPONumber()) {
			check = true;
			po = getPONumber();
		}
		
		if(!check) 	return false;		
		
		var stop = false;	
		var error = false;
		if($('#editOrderlineExternalAsset').val() == "") {
			stop = confirm("You have not entered an external asset number. Stop and fix?");
			error = true;
		} else if($('#editOrderlineExternalCondition' + getEditAssetID()).val() == "") {
			stop = confirm("The external asset number is either wrong or you are in the wrong PO. Stop and fix?");
			error = true;
		}
		
		if(error) {
			if(stop) {
				return true;
			} else {
				answer = confirm("Would you like to turn off external asset number checking for this PO?");
				if(answer == true) check = false;
				return false;
			}
		} else {
			return false;
		}
	}	
	checkEAN = wrapper;
	return wrapper();
}