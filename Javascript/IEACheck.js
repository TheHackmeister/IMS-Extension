
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
AssetCheck.prototype.checkFailed = function (string, expected, found) {
	if(arguments.length == 3) {
		string = "The " + string + " check failed. \nWas expecting " + expected + " but found " + found + ".";
	}
	
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
	var found = this.editAssetDiv.find('[name="' + name + '"]:checked').val();
	//If the unset option is not enabled. 
	if(isChecked == false) {
		if(val != found) {
			this.checkFailed(el.parent().children('span').html().toLowerCase(), val, found);
			return false;
		}
	} else {
		//If the val is different, and but not unset.
		if(val !=  this.editAssetDiv.find('[name="' + name + '"]:checked').val() && typeof(this.editAssetDiv.find('[name="' + name + '"]:checked').val()) != 'undefined') {
			this.checkFailed(el.parent().children('span').html().toLowerCase(),val,found);
			return false;
		}
	}			
	return true;
}

AssetCheck.prototype.checkCheckbox = function (el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input:checkbox').is(':checked');
	var found = this.editAssetDiv.find('[name="' + name + '"]').is(':checked');
	
	if(found != value) {
		this.checkFailed(el.parent().children('span').html().toLowerCase(), value, found);
		return false;
	}
	return true;
}

AssetCheck.prototype.checkText = function (el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input').val();
	var found = this.editAssetDiv.find('[name="' + name + '"]').val();
	if(found != value) {
		this.checkFailed(el.parent().children('span').html().toLowerCase(),value,found);
		return false;
	}
	return true;
}

AssetCheck.prototype.checkProduct = function (el) {
	if(el.is(':checked')) {
		var expected = el.parent().children('div').children('.searchList').val();
		var assetProduct = 	this.editAssetDiv.find('#editOrderlineProductSearchText' + getEditAssetID(this.editAssetDiv)).val();
			
		if(expected.toLowerCase() != assetProduct.toLowerCase()) {
			this.checkFailed(el.parent().children('span').html().toLowerCase(),expected,assetProduct);
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
		var value = el.parent().children('div').children('select').val(); 
		
		if(type != value) {
			this.checkFailed(el.parent().children('span').html().toLowerCase(),value,type);
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkDarked = function (el, text) {
	if(el.is(':checked')) {
		var expected = el.parent().children('div').children(':checkbox').is(':checked');
		var found = ($('#scrapText').html() == text);
		
		if(expected ^ found) {
			this.checkFailed(el.parent().children('span').html().toLowerCase(),expected, found );
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
			this.checkFailed(el.parent().children('span').html().toLowerCase(),expected,assetProduct);
			return false;
		}	
	}
	return true;
}

//These are checks for boxing laptops.


AssetCheck.prototype.checkProductIsNotGeneric = function (el) {
	if(el.is(':checked')) {
		var expected = el.parent().children('div').children(':checkbox').is(':checked');
		var assetProduct = 	this.editAssetDiv.find('#editOrderlineProductSearchText' + getEditAssetID(this.editAssetDiv)).val();
		var found = (assetProduct.indexOf("GENERIC") != -1);
		
		if(expected ^ found) {
			this.checkFailed("generic", expected, found);
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
				this.checkFailed("Was expecting text in the notes field, but found none.");
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
			this.checkFailed("The condition test failed. Was expecting " + cond + " but did not find that." );
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
			this.checkFailed(el.parent().children('span').html().toLowerCase(), expectedCPUBrand, cpu[3]);
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
			this.checkFailed(el.parent().children('span').html().toLowerCase(), expectedCPUGen, cpu[2]);
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
