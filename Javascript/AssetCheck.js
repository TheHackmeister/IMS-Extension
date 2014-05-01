/*
The order of this file goes like this:
Event functions
Builds for basic html
Builds for useful html
Builds for dropdowns
Checker function
Basic checker functions
*/

var AssetCheck = function (id,controlDiv,soundObj) {
	this.id = id || this.generateID();	
	AssetController.apply(this,arguments);
	this.controlDiv = controlDiv || $('#' + this.id + 'ControlDiv');
	this.sound = soundObj || beep;
		
	this.controlDiv.on('click', '.option', this.toggleVisible);
	this.controlDiv.on('click', '.radioCheckbox', this.unsetRadio);
	this.controlDiv.on('keyup', '.searchList', $.proxy(this.searchProductOrCPU,this));
	this.controlDiv.on('click', '.results a', $.proxy(this.selectProductOrCPU, this));
	
	this.event.on("loaded", $.proxy(this.stripSaveOnClick,this));
	this.editAssetDiv.on('click', '[value="save"]' , $.proxy(function () {saveAsset(getEditAssetID());this.selectID();}, this));
}
try {
	AssetCheck.prototype = Object.create(AssetController.prototype);
} catch (err) { location.reload(); }

//For events.
AssetCheck.prototype.toggleVisible = function (event) {
	$(event.target).parent().children('div').toggle();
}

AssetCheck.prototype.unsetRadio = function (event) {
	if($(event.target).is(':checked')) {
		$(event.target).parent().children('input[type="radio"]:checked').prop('checked', false);
	}
}

AssetCheck.prototype.selectID = function () {
	this.asset.select();
}

AssetCheck.prototype.select = function () {
	var checked = this.getOption('selectField') || false;

	if(checked.is(':checked')) {
		var selector = checked.parent().find('select').val();
	} else {
		var selector = "Asset ID"
	}
	switch(selector) {
		case "eBay Auction Number":
			this.selectAuctionNumber();
		break;
		
		case "End of Notes":
			this.selectNotes();
		break;
		case "Asset ID":
		default:
			this.asset.select();
		break;
	}
}

AssetCheck.prototype.selectAuctionNumber = function () {
	this.editAssetDiv.find('#1').select();
}

AssetCheck.prototype.selectNotes = function () {
	var notes = this.editAssetDiv.find('[name="spec15"]');
	var newLine = "\n";

	if(notes.val().length == 0) {
		newLine = "";
	}
	notes.val(notes.val() + newLine);
	notes[0].setSelectionRange(notes.val().length, notes.val().length);
}

AssetCheck.prototype.stripSaveOnClick = function () {
	this.editAssetDiv.find('[value=save]').attr('onclick','');
}


AssetCheck.prototype.searchOption = function (el) {
	el = $(el);
	//Product
	var text = el.val();
	var product = ""; //I don't think I need this. Why would a product be needed for a product search?
	var asset = this.asset.val();
	
	var string = 'string='+el.val()+'&product='+product+"&asset="+asset;
    var file = 'editassetsearchproduct.php';

    ajax(string, file, function(response){
    	el.parent().find('.results').html(response)
    }, 'assets');

	//CPU
	var id = '6';
	var string = "ID="+id+"&value="+text+"&asset="+asset;
    var file = 'searchorderlinespec.php';
 
    if(text != ''){
        ajax(string, file, function(response){
            document.getElementById("searchOrderlineSpecResults"+id).innerHTML = response;
        }, 'goods_receipt');
    }else{
       el.parent().find('.results').html('');
    }

	
}

md5Function(editAssetSelectProduct, "editAssetSelectProduct", "587959341153fd8f3834f440dc8cd753");
AssetCheck.prototype.selectOption = function (id, asset, el) {
    el.parent().parent().find('input').val(e.innerHTML);
	el.parent().parent().find('.hidden').val(id);
	el.parent().html('');
}

//These handle the checking
AssetCheck.prototype.checkAsset = function () {
	this.error = false;
	this.checkProduct(this.checkSpecialAsset('Product'));
	this.checkAssetType(this.checkSpecialAsset('Type'));
	this.checkDarked(this.checkSpecialAsset('Scrap'), "SCRAPPED!");
	this.checkDarked(this.checkSpecialAsset('Shipped'), "SHIPPED!");
	this.checkCPUType(this.checkSpecialAsset('spec6'));
	
	
	//Checks each checked option.
	$('.assetCheck .option:checked').parent().children('div').each($.proxy(function(i,el) {
		el = $(el);
		if(el.hasClass('special')) {
			return; //$.each version of continue. 
		}		
		//Radio Option
		if(el.children(':input').length == 3) {
			this.checkRadio(el);
		//Checkbox Option
		} else if(el.children(':input:checkbox').length == 1) {
			this.checkCheckbox(el);
		//Text Field
		} else {
			this.checkText(el);
		}
	}, this));
	
	this.checkCPUGeneration(this.checkSpecialAsset('cpuGen'));
	this.checkCPUBrand(this.checkSpecialAsset('cpuBrand'));
	this.checkCondition(this.checkSpecialAsset('checkCondition'));
	this.checkProductIsNotGeneric(this.checkSpecialAsset('productNotGeneric'));
	this.checkProductAndNotes(this.checkSpecialAsset('productMiscWithNotes'));
	
	this.errorCheck('checked')
}

//This will probably be overwritten in the multi asset version. 
AssetCheck.prototype.checkFailed = function (string) {
	this.possibleError = true;
	this.sound.play(500, "Bad");
	if(this.getOption('stopOnError').is(':checked')) {
		this.error = true;
		this. possibleError = false;
	} else {
		setTimeout($.proxy(function () {this.checkAlert(string);},this), 500);
	}
}

AssetCheck.prototype.checkAlert = function (string) {
	var stop = confirm(string + '\nStop?');
	if(stop == true) {
		this.error = true; //This stops something from being transfered.
		this.possibleError = false;
	} else {
		this.error = false;
		this.possibleError = false;
		this.event.trigger('gotErrorResult');
	}	
}

AssetCheck.prototype.errorCheck = function (event) {
	if(this.error) {
		return;
	} else if(this.possibleError) {
		this.event.one('gotErrorResult',$.proxy(function () {this.errorCheck(event);},this));
		return false;
	} else {
		this.event.trigger(event);
		return false;
	}
}

AssetCheck.prototype.checkSpecialAsset = function (name) {
	return $('.assetCheck :input[name="' + name + '"]').parent().parent().children(':checkbox');
}

AssetCheck.prototype.checkRadio = function(el) {
	var isChecked = el.children(':input:checkbox').is(':checked');
	var val = el.children(':input:radio:checked').val() || 'undefined';
	var name = el.children(':input:radio').prop('name').replace('Checker','');
	//If the unset option is not enabled. 
	if(isChecked == false) {
		if(val != this.editAssetDiv.find('[name="' + name + '"]:checked').val()) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	} else {
		//If the val is different, and but not unset.
		if(val !=  this.editAssetDiv.find('[name="' + name + '"]:checked').val() && typeof(this.editAssetDiv.find('[name="' + name + '"]:checked').val()) != 'undefined') {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}			
	return true;
}

AssetCheck.prototype.checkCheckbox = function (el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input:checkbox').is(':checked');
	
	if(this.editAssetDiv.find('[name="' + name + '"]').is(':checked') != value) {
		this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
		return false;
	}
	return true;
}

AssetCheck.prototype.checkText = function (el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input').val();
	
	if(this.editAssetDiv.find('[name="' + name + '"]').val() != value) {
		this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
		return false;
	}
	return true;
}

AssetCheck.prototype.checkProduct = function (el) {
	if(el.is(':checked')) {
		var expected = el.parent().children('div').children('.searchList').val();
		var assetProduct = 	this.editAssetDiv.find('#editOrderlineProductSearchText' + getEditAssetID(this.editAssetDiv)).val();
		if(expected.toLowerCase() != assetProduct.toLowerCase()) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkAssetType = function (el) {
	if(el.is(':checked')) {
		var type;
		if(this.editAssetDiv.find('[name="spec8"]').length > 0) type = "laptop"; //Webcam
		else if(this.editAssetDiv.find('[name="spec19"]').length > 0) type = "tablet"; //Tablet OS
		else if(this.editAssetDiv.find('[name="spec4"]').length > 0) type = "desktop"; //Form Factor
		else if(this.editAssetDiv.find('[name="spec30"]').length > 0) type = "monitor"; //Brand 
		else if(this.editAssetDiv.find('[name="spec13"]').length > 0) type = "hdd"; // HD Type
		else if(this.editAssetDiv.find('[name="spec16"]').length > 0) type = "mp3"; //WIFI
		else type = "other";
		
		if(type != el.parent().children('div').children('select').val()) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkDarked = function (el, text) {
	if(el.is(':checked')) {
		if(el.parent().children('div').children(':checkbox').is(':checked') ^ $('#scrapText').html() == text) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkCPUType = function (el) {
	if(el.is(':checked')) {
		var expected = el.parent().children('div').children('.searchList').val();
		var assetProduct = 	this.editAssetDiv.find('#searchOrderlineSpecText6').val();
		if(expected.toLowerCase() != assetProduct.toLowerCase()) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}	
	}
	return true;
}

//These are checks for boxing laptops.


AssetCheck.prototype.checkProductIsNotGeneric = function (el) {
	if(el.is(':checked')) {
		var assetProduct = 	this.editAssetDiv.find('#editOrderlineProductSearchText' + getEditAssetID(this.editAssetDiv)).val();
		if(el.parent().children('div').children(':checkbox').is(':checked') ^ assetProduct.indexOf("GENERIC") != -1) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkProductAndNotes = function (el) {
	if(el.is(':checked')) {
		var assetProduct = 	this.editAssetDiv.find('#editOrderlineProductSearchText' + getEditAssetID(this.editAssetDiv)).val();
		if(assetProduct.indexOf("MISC") != -1) {
			//If there is nothing in the notes
			if(this.editAssetDiv.find('[name="spec15"]').val() == "") {
				this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
				return false;
			}
		}
	}
	return true;
}

AssetCheck.prototype.checkCondition = function (el) {
	if(el.is(':checked')) {
		var cond = el.parent().children('div').children('select').val();
		var err = false;
		
		//If we only have one condition to check. 
		if(this.editAssetDiv.find('input:radio[name="test2"]').length > 0) {
			cond += "1";
		} else {
			cond += "3";
		}
		
		//In the case of this switch, eq(0) is fail, and eq(1) is pass. 
		switch(cond) {
			case "Good1":
				if(this.editAssetDiv.find('input:radio[name="test2"]').eq(1).prop('checked')) err = true;
			break;
			
			case "Good3":
				if(this.editAssetDiv.find('input:radio[name="test16"]').eq(1).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test13"]').eq(1).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test14"]').eq(1).prop('checked')) err = true;
			break;
			
			case "Good Base3":
				if(this.editAssetDiv.find('input:radio[name="test16"]').eq(1).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test13"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test14"]').eq(1).prop('checked')) err = true;
			break;
			
			case "Broken1":
				if(this.editAssetDiv.find('input:radio[name="test2"]').eq(0).prop('checked')) err = true;
			break;
			
			case "Broken3":
				if(this.editAssetDiv.find('input:radio[name="test16"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test13"]').eq(1).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test14"]').eq(1).prop('checked')) err = true;
			break;
			
			case "Damaged3":
				if(this.editAssetDiv.find('input:radio[name="test16"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test13"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test14"]').eq(1).prop('checked')) err = true;
			break;
			
			case "Low Grade3":
				if(this.editAssetDiv.find('input:radio[name="test16"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test13"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test14"]').eq(0).prop('checked')) err = true;
			break;
			
			default:
				err = true;
			break;
			
		}
		if(err) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkCPUBrand = function (el) {
	if(el.is(':checked')) {
		var expectedCPUBrand = el.parent().children('div').children('select').val();
		var cpu = this.getCPUByName(this.editAssetDiv.find('[name="searchOrderlineSpecText6"]').val());
		if(cpu[3] != expectedCPUBrand) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkCPUGeneration = function (el) {
	if(el.is(':checked')) {
		var expectedCPUGen = el.parent().children('div').children('select').val();
		var cpu = this.getCPUByName(this.editAssetDiv.find('[name="searchOrderlineSpecText6"]').val());
		if(cpu[2] != expectedCPUGen) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.getCPUByName = function (cpuName) {
	var result;
	this.cpuArray.forEach(function (el) {
		if(el[1] == cpuName) result = el;
	});
	if(!result) result = ["","", "Could't find"];
	
	return result;
}

//I create my own rather than use Brads and deal with renaming elements. 
//md5Function(goods_receipt_addAssetSearchProduct, "goods_receipt_addAssetSearchProduct", "");
//This has already been checked.
AssetCheck.prototype.searchProductOrCPU = function (el) {
//This may need to be el.target.
	var e = el;
	el = $(el.target);
	el.parent().find('input:hidden').val("");
    

  
  
	if(el.prop('name').indexOf('Product') != -1) {
		var string = "string="+el.val();
		var file = 'addassetproductsearch.php';
	} else if (el.prop('name').indexOf('spec6') != -1) {
		var string = "ID="+ "6" +"&value="+el.val() + "&asset=";// Orignal finished with +"&asset="+asset. But I don't see needing the asset. Also, id for CPU is 6.
		var file = 'searchorderlinespec.php';	
	}
	
	
	var resultsDiv = el.parent().find('.results');
    //key up
    if(e.keyCode == 38){
        var current = resultsDiv.find('li.selected');
        resultsDiv.find('li.selected').removeClass('selected');
        $(current).prev().addClass('selected');
    //key down
    }else if(e.keyCode == 40){
        var current = resultsDiv.find('li.selected');
        resultsDiv.find('li.selected').removeClass('selected');
        $(current).next().addClass('selected');
    //return    
    }else if(e.keyCode == 13){      
        resultsDiv.find('li.selected a').trigger('click');
    }else{      
        if(el.val() != ''){ 
            ajax(string, file, function(response){
				//response needs to be modified to strip the javascript calls
				//<a href="#" onclick="goods_receipt_addAssetSelectProduct('296', this)">ACER ASPIRE 4330</a>
			//Might also need to remove for CPU.
				response = response.replace("searchResultsShort", ""); //Stops brad's code from running his command.
				response = response.replace(/onclick="goods_receipt_addAssetSelectProduct\('/g, 'value="');//In between these is the product id.
				response = response.replace(/onclick="selectOrderlineSpec\('/g, 'value="');
				
				response = response.replace(/', this\)/g, '"');
				response = response.replace(/', 6, this, \); return false;"/g, '"');
                el.parent().find('.results').html(response);
            }, 'goods_receipt');
    
        }else{
             el.parent().find('.results').html("");
        }
    }    
} 

AssetCheck.prototype.selectProductOrCPU = function (e) {
    var el = $(e.target);

	
	var id = el.attr('value');//Figure out how to get ID from javascript.
	//var element = id.split(":"); //id is orignally passed in.
		
	el.parent().parent().parent().parent().find('input:hidden').val(id);
    
	el.parent().parent().parent().parent().find('input:text').val(el.html());
	el.parent().parent().parent().parent().find('.results').html('');
}

AssetCheck.prototype.getOption = function (name) {
	return $('.options :input[name="' + name + '"]').parent().parent().children(':checkbox');
}

AssetCheck.prototype.checkPrintTag = function (el) {
	if(el.is(':checked')) {
		newWindow('id='+this.getAssetID(),'printassettag.php', 'assets', true);
	}
	return true;
}

AssetCheck.prototype.cpuArray = [["71", "AMD ATHLON 4", "Pentium 3", "AMD"],
["77", "AMD ATHLON 64", "Pentium 4", "AMD"],
["220", "AMD ATHLON 64 (TF-20)", "Green Planet", "AMD"],
["86", "AMD ATHLON 64 X2", "Dual Core", "AMD"],
["153", "AMD ATHLON II X2", "Dual Core", "AMD"],
["157", "AMD ATHLON II X3", "Quad Core", "AMD"],
["154", "AMD ATHLON II X4", "Quad Core", "AMD"],
["212", "AMD ATHLON NEO", "Pentium M", "AMD"],
["69", "AMD ATHLON XP", "Pentium 3", "AMD"],
["70", "AMD ATHLON XP-M", "Pentium 3", "AMD"],
["208", "AMD C-50", "Dual Core", "AMD"],
["224", "AMD C-60", "Dual Core", "AMD"],
["66", "AMD DURON", "Pre Pentium 3", "AMD"],
["225", "AMD FUSION", "Dual Core", "AMD"],
["68", "AMD K6", "Pre Pentium 3", "AMD"],
["91", "AMD PHENOM II", "Dual Core", "AMD"],
["155", "AMD PHENOM X3", "Quad Core", "AMD"],
["152", "AMD PHENOM X4", "Quad Core", "AMD"],
["110", "AMD SEMPRON (DUAL CORE ERA)", "Green Planet", "AMD"],
["109", "AMD SEMPRON (P4 ERA)", "Pentium 4", "AMD"],
["214", "AMD SEMPRON (PENTIUM M ERA)", "Pentium M", "AMD"],
["78", "AMD TURION 64", "Pentium M", "AMD"],
["87", "AMD TURION 64 X2", "Dual Core", "AMD"],
["89", "AMD TURION II", "Dual Core", "AMD"],
["223", "AMD TURION NEO", "Dual Core", "AMD"],
["211", "AMD V120", "Green Planet", "AMD"],
["213", "AMD V140", "Green Planet", "AMD"],
["217", "AMD VISION A10", "Quad Core", "AMD"],
["57", "AMD VISION A4", "Dual Core", "AMD"],
["58", "AMD VISION A6", "Dual Core", "AMD"],
["59", "AMD VISION A8", "Quad Core", "AMD"],
["56", "AMD VISION E SERIES", "Green Planet", "AMD"],
["139", "EXYNOS 5 DUAL", "Other", "Other"],
["82", "INTEL ATOM", "Pentium M", "Intel"],
["97", "INTEL CELERON (PENTIUM 4 ERA)", "Pentium 4", "Intel"],
["96", "INTEL CELERON (PENTIUM III ERA)", "Pentium 3", "Intel"],
["98", "INTEL CELERON (POST PENTIUM M)", "Green Planet", "Intel"],
["151", "INTEL CELERON D", "Pentium M", "Intel"],
["76", "INTEL CELERON M", "Pentium M", "Intel"],
["84", "INTEL CORE 2 DUO", "Dual Core", "Intel"],
["85", "INTEL CORE 2 EXTREME", "Quad Core", "Intel"],
["93", "INTEL CORE 2 QUAD", "Quad Core", "Intel"],
["92", "INTEL CORE 2 SOLO", "Green Planet", "Intel"],
["83", "INTEL CORE DUO", "Dual Core", "Intel"],
["60", "INTEL CORE I3", "I Series", "Intel"],
["61", "INTEL CORE I5", "I Series", "Intel"],
["62", "INTEL CORE I7", "I Series", "Intel"],
["80", "INTEL CORE SOLO", "Pentium M", "Intel"],
["94", "INTEL PENTIUM (ORIGINAL)", "Pre Pentium 3", "Intel"],
["99", "INTEL PENTIUM (POST PENTIUM M)", "Dual Core", "Intel"],
["74", "INTEL PENTIUM 4", "Pentium 4", "Intel"],
["150", "INTEL PENTIUM D", "Pentium M", "Intel"],
["90", "INTEL PENTIUM DUAL-CORE", "Dual Core", "Intel"],
["64", "INTEL PENTIUM II", "Pre Pentium 3", "Intel"],
["63", "INTEL PENTIUM III", "Pentium 3", "Intel"],
["75", "INTEL PENTIUM M", "Pentium M", "Intel"],
["65", "INTEL PENTIUM MMX", "Pre Pentium 3", "Intel"],
["226", "INTEL PRE-PENTIUM", "Pre Pentium 3", "Intel"],
["158", "INTEL XEON", "Green Planet", "Intel"],
["140", "POWERPC G3", "Other", "Other"],
["141", "POWERPC G4", "Other", "Other"],
["142", "POWERPC G5", "Other", "Other"],
["72", "TRANSMETA CRUSOE", "Other", "Other"],
["73", "VIA C3", "Pre Pentium 3", "Other"],
["67", "VIA C7", "Pre Pentium 3", "Other"]];