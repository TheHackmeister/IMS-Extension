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

// Have to override this function to get hide loading to work. 
md5Function(ajax,"ajax", "4223609c7a791584de980ef37abe78c2");
var ajax = function(string, file, code, plugin, path){  
	showLoading();
    if(plugin){
        string = string + "&file=" + file + "&plugin="+plugin;
    }else{
        string = string + "&file=" + file;
    }

    if(path){
        string += "&path="+path;
    }
    var filePath = getJSON();
    if(filePath != '' && filePath != 'undefined'){
	    var file = filePath + '/ajaxhandler.php';
    }else{
	    var file = 'ajaxhandler.php';
    }

    var response;
    $.ajax({
        url: file,
        data: string,
        async: true,
        dataType: "html",
        type: "POST",
        error: function(xhr, status, error) {
        	alert(status+" "+error+"\n"+xhr.responseText);
        	
            hideLoading();
        },
        complete: function(data, status){
	        //alert(data.responseText);
        	response = data.responseText;
        	if(typeof code == 'function'){
                code(response);
            }else if(typeof code == 'string'){
                eval(code);
            }
            
            if($(".chosen-select").length > 0){
                $(".chosen-select").chosen();
            }

            $(document).foundation();
			hideLoading(); //Added this.
        },

    }); 

    return response;      
} 

//This overloads the loading functions to allow skipping hiding of a loading page. This helps AHK follow what's going on the page better.
md5Function(showLoading,"showLoading", "c2bc4ce1b799cc30715f5c576f304226");
var showLoadingOld = showLoading;
showLoading = function(){
	document.title = 'IMS (Loading)';
	showLoadingOld.apply(this,arguments);
}
md5Function(hideLoading,"hideLoading","b39bc81027a83c750331837f786123ad");
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
//As of 4/29/14 Brad broke newWindow 
md5Function(newWindow, "newWindow", "a37dc9383d21af82330060ad8ca1bcd9");
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
					//I have timeout to stop the print window from interfearing with the beep. Should help, but may not fix %100. 
					window.setTimeout(function() {wnd.printWindow();}, 250);
					//wnd.setTimout(function() {alert(window);}, 25);
				}
			} else if (file == 'assetcountbylocationshortprocess.php') {
				wnd.document.close();
				wnd.Array.prototype.remove = Array.prototype.remove;
				wnd.findAndRemove = findAndRemove;
				wnd.countInLocation = countInLocation;

				wnd.onload = function () {
					wnd.countInLocation();
				}
			} else if (file == 'assetcountbylocationprocess.php' || file == 'assetcountbylocationprocess-groupbyasset.php') {
				wnd.document.close();
				wnd.Array.prototype.remove = Array.prototype.remove;
				wnd.findAndRemove = findAndRemove;
				wnd.countInLocationDetailed = countInLocationDetailed;

				wnd.onload = function () {
					wnd.countInLocationDetailed();
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

//Adds the improved pages after when core_loadMenus is called.
md5Function(core_loadMenus, "core_loadMenus", "388087d1ac18f19fd0feef8f4eab2c3c");
var core_loadMenus = function () {
    var string = '';
    var file = 'menus.php';

    ajax(string, file, function(response){
        $('body').html(response);
		setupIMS(); //Added
    }, 'core');

}

function getEditAssetID(assetDiv) {
	assetDiv = assetDiv || $(document);
	return assetDiv.find('#editAssetID').val();
}

//Automatically locks a PO when saved. Also sets focus to the product description box after save.
//Also makes sure there is an external ID.
md5Function(saveAsset,"saveAsset", "aa60c5d07da0f99f6583d93075e905d4");
var saveAssetOld = saveAsset;
var saveAsset = function(asset) {
	var id = "editOrderlineResult" + arguments[0];
	ajaxCallback(function(){saveAssetListener(asset);},3);
	saveAssetOld.apply(this, arguments);
};
var saveAssetListener = function (asset,id) {
		//If we're not adding to a PO, don't lock condition. 
		if($('h5:contains(Grading/Receiving)').length < 1) return;

		//if(checkEAN(asset)) return;
		
		saveAssetCondition(asset);		
		scrollAfterSave(asset);
		if($('#singleAssetProduct').is(':checked')) {
			 $('#addOrderlineSN').focus();
		} else {
			$('#addAssetProductSearchText').focus();    
		}
}

var scrollAfterSave = function (asset) {
	var assetDiv = $('h5:contains(ASSET: ' + asset + ')');
	var poOrEdit = assetDiv.closest('.pluginBody').attr('id');
	var childAsset = (assetDiv.parents('#editOrderlineDetailChild').length > 0);
	
	if(poOrEdit == 'orderWrapper'){
		if(childAsset) {
			core_scrollWindow('5');
		} else {
			core_scrollWindow('4');
		}
	}else if(poOrEdit == 'editAssetWrapper'){
		if(childAsset) {
			core_scrollWindow('3');
		} else {
			core_scrollWindow('1');
		}    	
	}
}

var getPONumber = function() {
	return $('h6:contains(PO: )').html().replace("PO: ", "");
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

