
AssetCheck.prototype.setSpecsAndTests = function () {
	this.error = false;
	
	this.setProduct(this.setSpecialAsset('Product'));
	this.setCPUType(this.setSpecialAsset('spec6'));
	this.setScrapped(this.setSpecialAsset('editOrderlineScrapped'));
	
	
	//Checks each checked option.
	$('.assetSet .option:checked').parent().children('div').each($.proxy(function(i,el) {
		el = $(el);
		if(el.hasClass('special')) {
			return; //$.each version of continue. 
		}		
		//Radio Option
		if(el.children(':input').length == 3) {
			this.setRadio(el);
		//Checkbox Option
		} else if(el.children(':input:checkbox').length == 1) {
			this.setCheckbox(el);
		//Text Field
		} else {
			this.setText(el);
		}
	}, this));
	
	if($('.setTests .option:checked').length > 0 || $('.setSpecs .option:checked').length > 0 || this.setSpecialAsset('editOrderlineScrapped').is(':checked')) {
		this.errorCheck('saveReady');
	} else {
		this.event.trigger('saved'); //Otherwise transfer and SO wont run.
	}
//	this.errorCheck('checked')
}


AssetCheck.prototype.setSpecialAsset = function (name) {
	return $('.assetSet :input[name="' + name + '"]').parent().parent().children(':checkbox');
}


AssetCheck.prototype.setRadio = function(el) {
	var isChecked = el.children(':input:checkbox').is(':checked');
	var val = el.children(':input:radio:checked').val() || 'undefined';
	var name = el.children(':input:radio').prop('name').replace('Checker','');

	if(this.editAssetDiv.find('[name="' + name + '"]').length == 0) {
		this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' field does not exist in this asset.');
		return false;
	}
	
	//If the unset option is enabled. 
	if(val == 'undefined') {
		this.editAssetDiv.find('[name="' + name + '"]').prop('checked', false)
	} else {
		this.editAssetDiv.find('[name="' + name + '"][value="' + val + '"]').prop('checked', true);
	}
}

AssetCheck.prototype.setCheckbox = function (el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input:checkbox').prop('checked');
	
	if(this.editAssetDiv.find('[name="' + name + '"]').length == 0) {
		this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' field does not exist in this asset.');
		return false;
	}
	
	
	this.editAssetDiv.find('[name="' + name + '"]').prop('checked', value) 
}

AssetCheck.prototype.setText = function (el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input').val();
	
	if(this.editAssetDiv.find('[name="' + name + '"]').length == 0) {
		this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' field does not exist in this asset.');
		return false;
	}
	
	this.editAssetDiv.find('[name="' + name + '"]').val(value);
}


AssetCheck.prototype.setScrapped = function (el) {
	if(el.is(':checked')) {
		var checked = el.parent().children('div').children('input:checkbox').prop('checked')
		
		this.editAssetDiv.find('#editOrderlineScrapped' + getEditAssetID(this.editAssetDiv)).prop('checked', checked);
	}
}

AssetCheck.prototype.setProduct = function (el) {
	if(el.is(':checked')) {
		var pid = 	el.parent().find('input:hidden').val();
		var product = el.parent().find('input:text').val()
				
		this.editAssetDiv.find('#editOrderlineProductSearchText' + getEditAssetID(this.editAssetDiv)).val(product);
		this.editAssetDiv.find('#editOrderlineProductID' + getEditAssetID(this.editAssetDiv)).val(pid);
	}
}

AssetCheck.prototype.setProduct = function (el) {
	if(el.is(':checked')) {
		var pid = 	el.parent().find('input:hidden').val();
		var product = el.parent().find('input:text').val()
				
		this.editAssetDiv.find('#editOrderlineProductSearchText' + getEditAssetID(this.editAssetDiv)).val(product);
		this.editAssetDiv.find('#editOrderlineProductID' + getEditAssetID(this.editAssetDiv)).val(pid);
	}
}

AssetCheck.prototype.setCPUType = function (el) {
	if(el.is(':checked')) {
		var cpuID = el.parent().find('input:hidden').val();
		var cpu = el.parent().find('input:text').val()
				
		this.editAssetDiv.find('#searchOrderlineSpecText6').val(cpu);
		this.editAssetDiv.find('#spec6').val(cpuID);
	}
}

