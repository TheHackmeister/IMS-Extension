
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
var showLoadingOld = showLoading;
showLoading = function(){
	document.title = 'IMS (Loading)';
	showLoadingOld.apply(this,arguments);
}
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

//Overloads the newWindow function. Adds clicking the print button on page load and adds support for Firefox. 
function newWindow(string, file, plugin){ 
	var code = '';
	if(plugin){
		string = string + '&file=' + file + '&plugin='+plugin;
	}else{
		string = string + '&file=' + file;
	}
	var response;
	$.ajax({
		url: 'pagehandler.php',
		data: string,
		async: false,
		dataType: 'html',
		type: 'POST',
		success: function(data) {
			response = data;
			eval(code);
		},
		error: function(xhr, status, error) {
			var err = eval('(' + xhr.responseText + ')');
			response = err.Message;
		}
	}); 
	var wnd = window.open('about:blank', '', '_blank');
	wnd.document.write(response);
	if (plugin == 'assets'){
		wnd.document.close();
		wnd.onload = function( ) {
			wnd.document.title = 'Print Ready';
			wnd.printWindow();
		}
	}
}
	
//Calls the addOrderline function, and sets up callback for clicking print and setting focus to the External Asset field upon load.
var addOrderLineOld = addOrderLine;
var addOrderLine = function() {
	window.skipHide = true;
	$('#addOrderLineResult').html("");
	ajaxCallback(addOrderLineListener);
	addOrderLineOld.apply(this,arguments);
}
var addOrderLineListener = function() {
	if($('#addOrderLineResult').html() != "") {
		hideLoading();
		return;
	}
	ajaxCallback(function(){addOrderLineListener2();});
	$('.printLink')[0].click();
};
var addOrderLineListener2 = function () {
	$('#editOrderlineExternalAsset').focus().val($('#editOrderlineExternalAsset').val());
};

function getEditAssetID() {
	return document.getElementById("editAssetID").value;
}

//Automatically locks a PO when saved. Also sets focus to the product description box after save.
var saveAssetOld = saveAsset;
var saveAsset = function(asset) {
	var id = "editOrderlineResult" + arguments[0];
	$("." + id).eq(0).on("DOMSubtreeModified",saveAssetListener(asset,id));
	saveAssetOld.apply(this, arguments);
};
var saveAssetListener = function (asset,id) {

	var handler = function (asset,id) {
		//If we're not adding to a PO, don't lock condition. 
		if(!document.getElementById("addAssetDiv")) return;
		
		saveAssetCondition(asset);		
        $('#addAssetProductSearchText').focus();    
		
		$("." + id).eq(0).off("DOMSubtreeModified");
		$("." + id).eq(0).html($("." + id).eq(0).html() + " ");
	}.bind(this, asset, id);
	return handler;
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

//If there is only one PO result found, it is selected.
function clickTopOption() {
	ajaxCallback(function(){
		if($('.search').length == 1) {
			$('.search a').eq(0)[0].click();
		}	
	});
}

// Triggers for selecting PO
$('#dashboardBody').on('keyup', '#searchOrderText', function(e) {
if(e.keyCode == 10 || e.keyCode == 13) {
	searchOrder();
	clickTopOption();
}
});
$('#dashboardBody').on('click', '#editOrderSearch [value="search"]', function(e) {
	clickTopOption();
});


//This is the base for the form objects. Just has an ID and a function to change the ID of $ objects without trouble.
var InputForm = function (id) {
	this.id = id;
	this.event;
}
//Could I simplify this to simple add and remove the ID?
InputForm.prototype.changeDivs = function() {
	 var elements = [];
	 for (var i = 0; i < arguments.length; i += 2) {
		var arg = arguments[i];
		arg.originalID = arg.attr('id');
		arg.attr('id', arguments[i+1]);
		elements.push(arg);
	 }
	 return elements;
}

InputForm.prototype.restoreDivs = function(elements) {
	elements.forEach(function(el) {
		el.attr('id', el.originalID);
	});
}

InputForm.prototype.generateID = function () {
	var rand = Math.random()*(10000-1000) + 1000;
	rand = Math.floor(rand);
	return rand;
}

InputForm.prototype.generateElement = function (elementId) {
	var element = $('#' + this.id + elementId);
	if(element.length > 0) {
		return element;
	} else {
		var elementDiv = $('#' + this.id + 'Div');
		if(elementDiv.length == 0) { //there is not an element div 
			elementDiv = $('<div/>', {id: this.id + "Div", class: this.id, style: "display:​ none; width: 0px; height: 0px; overflow: hidden;​"}).appendTo('#dashboard');
		}
		return $('<div/>', {id: this.id + elementId}).appendTo(elementDiv);
	}
}

InputForm.prototype.generateInput = function (elementId) {
	var element = $('#' + this.id + elementId);
	if(element.length > 0) {
		return element;
	} else {
		var elementDiv = $('#' + this.id + 'Div');
		if(elementDiv.length == 0) { //there is not an element div 
			elementDiv = $('<div/>', {id: this.id + "Div", class: this.id, style: "display:​ none; width: 0px; height: 0px; overflow: hidden;​"}).appendTo('#dashboard');
		}
		return $('<input/>', {id: this.id + elementId, type: "text", value: ""}).appendTo(elementDiv);
	}
}

InputForm.prototype.triggerEvent = function (event) {
	this.event.trigger(event);
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
