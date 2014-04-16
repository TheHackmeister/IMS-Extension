//This stuff improves general IMS functionality	

//This allows me to call something after an AJAX call without overloading another function.
var ajaxCallback = function (func, ct) {
	var counter = 0;
	var countTo = ct || 0;
	var wrapper = function() {
		if(counter == countTo) {
			$('#loadingWrapper').off('hasFinished');
			func.call(this);
		} else {
			counter++;
		}
	};
	$('#loadingWrapper').on('hasFinished',$.proxy(wrapper,this));
//	$('#loadingWrapper').one('hasFinished',$.proxy(wrapper,this));
}


//This overloads the loading functions to allow skipping hiding of a loading page. This helps AHK follow what's going on the page better.
md5Function(showLoading,"showLoading", "e1775ec305172c883c0d0f04c8f420a1");
var showLoadingOld = showLoading;
showLoading = function(){
	document.title = 'IMS (Loading)';
	showLoadingOld.apply(this,arguments);
}
md5Function(hideLoading,"hideLoading","6f168be39aba932e6bd28a27a1249c22");
var hideLoadingOld = hideLoading;
hideLoading = function (){
	if(window.skipHide)
	{	
		window.skipHide = false;	
		$('#loadingWrapper').trigger('hasFinished');
		return;
	}
    hideLoadingOld();
	$('#loadingWrapper').trigger('hasFinished');
	document.title = 'IMS';
}

//Overloads the newWindow function. Adds clicking the print button on page load and adds a more useful count for the short report
md5Function(newWindow, "newWindow", "f9910d0afe84fac4a58824b891fc8f92");
var newWindow = function (string, file, plugin, print){   
    var code = '';

    if(plugin){
        string = string + "&file=" + file + "&plugin="+plugin;
    }else{
        string = string + "&file=" + file;
    }

    var response;
    $.ajax({
        url: 'pagehandler.php',
        data: string,
        async: false,
        dataType: "html",
        type: "POST",
        success: function(data) {            
            response = data;
            //eval(code); 
            var wnd = window.open("", "_blank", "location=yes");
            wnd.document.write(response);
            $(document).foundation();    
			//Begin add
			if (plugin == 'assets'){
				wnd.document.close();
				wnd.onload = function( ) {
					wnd.document.title = 'Print Ready';
					wnd.printWindow();
				}
			} else if (file == 'assetcountbylocationshortprocess.php') {
				wnd.document.close();
				wnd.Array.prototype.remove = Array.prototype.remove;
				wnd.findAndRemove = findAndRemove;
				wnd.countInLocation = countInLocation;

				wnd.onload = function () {
					wnd.countInLocation();
				}
			}			
			//End add
        },
        error: function(xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            response = err.Message;
        }
    });
} 

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
md5Function(goods_receipt_addLine, "goods_receipt_addLine", "b715613c9ede8cb4cab0e4370f6bde3e");
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
	var string = "product="+product+"&order="+order+"&sn="+sn+"&desc="+desc + location + condition;
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
	ajaxCallback(addOrderLineListener);
	goods_receipt_addLineOld.apply(this,arguments);
}
var addOrderLineListener = function() {
	if($('#addOrderlineResult').eq(0).html() != "") {
		hideLoading();
		return;
	}
	ajaxCallback(function(){addOrderLineListener2();});
	$('a:contains(print)')[0].click();
	$('#orderlineTable a')[0].click();
};
var addOrderLineListener2 = function () {
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

function getEditAssetID(assetDiv) {
	assetDiv = assetDiv || $(document);
	return assetDiv.find('#editAssetID').val();
}

//Automatically locks a PO when saved. Also sets focus to the product description box after save.
//Also makes sure there is an external ID.
md5Function(saveAsset,"saveAsset", "e30397ccef9924fe928eee9758b52b28");
var saveAssetOld = saveAsset;
var saveAsset = function(asset) {
	var id = "editOrderlineResult" + arguments[0];
	ajaxCallback(function(){saveAssetListener(asset);},3);
	saveAssetOld.apply(this, arguments);
};
var saveAssetListener = function (asset,id) {
		//If we're not adding to a PO, don't lock condition. 
		if($('h5:contains(Grading/Receiving)').length < 1) return;

		if(checkEAN()) return;
		
		saveAssetCondition(asset);		
		scrollWindow("fourth");
		$('#addAssetProductSearchText').focus();    
}

var getPONumber = function() {
	return $('h6:contains(PO: )').html().replace("PO: ", "");
}

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

///////////////
//Adds features
///////////////


// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

//If there is only one PO, SO, or Return result found, it is selected.
function clickTopOption(expectedSearches) {
	ajaxCallback(function(){
		if($('.search').length == expectedSearches) {
			$('.search a').eq(0)[0].click();
		}	
	});
}


//Creates an object that makes beep noises. Used for quality control checks later on.
 function SoundAlert() {
	this.context = new webkitAudioContext(); 
	this.osc = this.context.createOscillator(),  
	this.osc.type = 2;  
	this.osc.frequency.value = 49;   
	this.osc.noteOn(0);
}
SoundAlert.prototype.play = function (time, freq, callback) {
		if(freq == "Good") this.osc.frequency.value = 520;
		if(freq == "Bad") this.osc.frequency.value = 98;
		
		this.osc.connect(this.context.destination);  
//		this.osc.noteOn(0);
		var soundObject = this.osc;
		window.setTimeout(function(){
			soundObject.disconnect();
			if(typeof(callback) != 'undefined') callback();
		},time);
}
var beep = new SoundAlert();



