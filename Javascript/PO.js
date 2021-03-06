

//Create a replacement function for the AHK program. 
md5Function(goods_receipt_addAssetSelectProduct, "goods_receipt_addAssetSelectProduct", "cfaaf7cb2bb59599c80e9f295e6926cb");
var goods_receipt_addAssetSelectProductOld = goods_receipt_addAssetSelectProduct;
var goods_receipt_addAssetSelectProduct = function() {
	$('#addOrderlineSN').focus();
	goods_receipt_addAssetSelectProductOld.apply(this,arguments);
}

md5Function(goods_receipt_addAssetSelectProductGetConditions, "goods_receipt_addAssetSelectProductGetConditions", "059bbd8cc0d95fb56b2877d211ca3e6e");
var goods_receipt_addAssetSelectProductGetConditions = function() {

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
md5Function(goods_receipt_addLine, "goods_receipt_addLine", "22d35bda3e9a99cd683e6cb9e22ed2e0");
var goods_receipt_addLine = function(id){
    var product = document.getElementById('addAssetProductID').value;        
    var order = id;
    var sn = document.getElementById('addOrderlineSN').value;

    var desc = document.getElementById('addAssetProductSearchText').value;
    
    //var string = "product="+product+"&order="+order+"&qty="+qty+"&sn="+sn+"&location="+location+"&desc="+desc;
	var string = "product="+product+"&order="+order+"&sn="+sn+"&qty="+"&desc="+desc;
    var file = 'addorderline.php';
	
    ajax(string, file, function(response){
    	if(response.indexOf("Re-enter location key") == -1 && response.indexOf("SN exists. No duplicate SN allowed.") == -1){          
            if($('#singleAssetItemNumber')){
                if(!$('#singleAssetItemNumber').prop('checked')){
                    $('#addAssetProductSearchItemNumberText').val('');
                }
            }

            if($('#singleAssetProduct')){
                if(!$('#singleAssetProduct').prop('checked')){
                    $('#addAssetProductSearchText').val('');
                    $('#addAssetProductID').val('');
                }
            }

            if($('#singleAssetSN')){
                if(!$('#singleAssetSN').prop('checked')){
                    $('#addOrderlineSN').val('');
                    $('#addOrderlineSN').focus();
                }
            }
			
            document.getElementById("addOrderlineResult").innerHTML = 'Asset Added';            
			var response = $(response);
			$('#orderlineTable').prepend(response);
			 
			//Begin add
			response.find('a')[0].click();
			//End add
	    } 
	    else{
	         document.getElementById("addOrderlineResult").innerHTML = response;
			 hideLoading();
	    } 
    }, 'goods_receipt');
} 


var goods_receipt_addLineOld = goods_receipt_addLine;
var goods_receipt_addLine = function() {
	window.skipHide = true;
	$('#addOrderlineResult').html("");
	goods_receipt_addLineOld.apply(this,arguments);
}

md5Function(editOrderline, 'editOrderline', "d5051e5d92f5e65e700ba6cddac031c9");
var editOrderline = function (id, e){
    var row = $(e).closest("tr")[0];

    var string = "ID="+id;

    $("tr").removeClass('selected');
    $(row).addClass('selected');
    var file = 'selectasset.php';

	core_loadNextSliderSection(string, '2', file, 'assets', function(response){
        core_showBreadcrumbNavIcon('edit', e);
				addOrderLineListener();
    }, e);
}

var addOrderLineListener = function() {
	if($('#addOrderlineResult').eq(0).html() != "Asset Added") {
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
	
	$('input:button[value="print tag"]').before('<input type="button" class="button" value="save and print" onclick="saveAndPrint();"> ');
	
	$('#editOrderlineExternalAsset').focus().val($('#editOrderlineExternalAsset').val());
};


var saveAndPrint = function(asset) {
	asset = asset || getEditAssetID();
	
	ajaxCallback(function (){$('input:button[value="print tag"]').click();},3);
	saveAsset(asset);
}

//Returns true if actions should be stopped. False if actions should continue.
var checkEAN = function (id) {
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
		var parent = $('h5:contains(ASSET: ' + id + ')').parent().parent().parent();
		
		if(parent.find('#editOrderlineExternalAsset').val() == "") {
			stop = confirm("You have not entered an external asset number. Stop and fix?");
			error = true;
		} else if(parent.find('#editOrderlineExternalCondition' + getEditAssetID()).val() == "") {
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

//Below here is for adding child assets.
md5Function(addChildSelectProduct,"addChildSelectProduct", "036843197dd709d7e14f3a66d3ac1ef5");
var addChildSelectProductOld = addChildSelectProduct;
var  addChildSelectProduct = function () {
	if($(arguments[1]).closest('#editAssetChildren') > 0) {
		$(arguments[1]).closest('#editAssetChildren').find('[placeholder="SN"]').select();
	} else { 
		$('#editAssetChildren').find('[placeholder="SN"]').select();
	}
	addChildSelectProductOld.apply(this, arguments);
}

md5Function(addChildAsset,"addChildAsset", "1e8aaa4d4f24caedcfc13bcc43f319be");
var addChildAsset = function (id){
	window.skipHide = true; //Added
    var asset = id;        
    var product = document.getElementById('addChildProductID'+id).value;
    var qty = document.getElementById('addChildqty'+id).value;
    var sn = document.getElementById('addChildSN'+id).value;
    var desc = document.getElementById('addChildSearchProductText'+id).value;

    var location = ''
    if($('#addChildLocation'+id).length > 0){
        location = "&location="+$('#addChildLocation'+id).val();
    }
    
    var string = "product="+product+"&asset="+asset+"&sn="+sn+"&desc="+desc+"&qty="+qty+location;
    var file = 'addchild.php';

    ajax(string, file, function(response){
        if(string.indexOf('Re-enter location key') == -1){ //I changed this
            document.getElementById('addChildProductID'+id).value = '';
            document.getElementById('addChildSN'+id).value = '';
            document.getElementById('addChildSearchProductText'+id).value = '';
            document.getElementById('addChildResults'+id).innerHTML = '';
            
            table = document.getElementById('editAssetChildTable'+id);
            //var rowCount = table.rows.length;
            //var row = table.insertRow(1);
            //row.className = "line";

			var response = $(response);//Added
			
            //row.innerHTML = response;
            $(table).append(response);
					 
			//Begin add
			response.find('a:contains(print)')[0].click();
			response.find('a')[0].click();
			//End add
			
        }
        else{
            document.getElementById('addChildResults'+id).innerHTML = response;
			hideLoading(); //Added
        }
    }, 'assets');
} 

md5Function(editOrderlineChild, "editOrderlineChild", "b24087d546809419626d8d244f2c8560");
var editOrderlineChild =  function(id, e){
    var row = $(e).closest("tr")[0];

    var string = "ID="+id;

    $("tr").removeClass('selected');
    $(row).addClass('selected');
    var file = 'selectasset.php';

	core_loadNextSliderSection(string, '2', file, 'assets', function(response){
		var parent = $(e).closest('.pluginBody');
    	var response = response.replace(/onclick="saveAsset\(/g, 'onclick="saveChildAsset(');
		
		if($(parent).attr('id') == 'orderWrapper'){
			$('#editOrderlineDetailChild').html(response);
	    	core_showBreadcrumbNavIcon('edit', "6");	
    	}else if($(parent).attr('id') == 'editAssetWrapper'){
			$('#editAssetChild').html(response);
			core_showBreadcrumbNavIcon('edit', "4");			
	    }
    }, e);
} 

var saveChildAsset = function (asset) {
	saveAssetOld.apply(this,arguments);
	
	saveAssetCondition(asset);		
	scrollAfterSave(asset);
}
