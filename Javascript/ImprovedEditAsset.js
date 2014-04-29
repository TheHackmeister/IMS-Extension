var loadImprovedEditAsset = function () {
	
	var mainDiv = $('<div id="improvedAsset" class="improvedAsset" />');
	var assetWrapper = $('<div id="editAssetWrapper" />');
	var assetDiv = $('<div id="improvedAssetDiv" style="float:left; margin-right:210px;" />');
	var controlDiv = $('<div style="right:15px;position:absolute; width:160px;"> \
			<div style="position:fixed;"> Enter Asset: <input type="text" id="improvedAssetID"> </div> \
		</div>');
	
	assetWrapper.append(assetDiv);
	mainDiv.append(assetWrapper);
	mainDiv.prepend(controlDiv);
	
	$('#dashboard').html('').append(mainDiv);

//Should be local, but it makes it way easier for now.
	improvedAsset = new AssetCheckSingle("improvedAsset", controlDiv);
	improvedAsset.select();
}


var AssetCheckSingle = function (id,controlDiv) {
	AssetCheck.apply(this,arguments);
		
	//This builds the controls. 
	var container = $('<div style="margin-top:65px;"/>');
	container.append(this.buildContainer('assetCheck','Check', this.buildCheckList));
	container.append(this.buildContainer('assetSet', 'Set', this.buildSetList));
	this.controlDiv.append(container);
	
	//Events.
	this.event.on("keyup", $.proxy(function(event) {if(event.keyCode == 13 || event.keyCode == 10) this.load();},this));
//	this.event.on('change', $.proxy(function(event) {this.load();},this));
	this.event.on("loaded", $.proxy(function() {this.checkAsset();},this));
	this.event.on('checked', $.proxy(function() {this.setSpecsAndTests();},this));
	this.event.on('saved', $.proxy(function() {this.transfer();},this));
	this.event.on('transfered', $.proxy(function() {this.addToSO();},this));
	this.event.on("finished", $.proxy(function() {if($('.assetCheck > input').is(':checked')) {this.sound.play(150,'Good');}},this));
}
try {
	AssetCheckSingle.prototype = Object.create(AssetCheck.prototype);
} catch (err) { location.reload(); }

AssetCheckSingle.prototype.setSpecsAndTests = function () {
	this.error = false;
	
	//	this.checkProduct(this.checkSpecialAsset('Product'));
	// setCPU
	
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
	
	if($('.setTests .option:checked').length > 0 || $('.setSpecs .option:checked').length > 0) {
		this.save();
	} else {
		this.event.trigger('saved'); //Otherwise transfer and SO wont run.
	}
//	this.errorCheck('checked')
}


AssetCheckSingle.prototype.setRadio = function(el) {
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

AssetCheckSingle.prototype.setCheckbox = function (el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input:checkbox').prop('checked');
	
	if(this.editAssetDiv.find('[name="' + name + '"]').length == 0) {
		this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' field does not exist in this asset.');
		return false;
	}
	
	
	this.editAssetDiv.find('[name="' + name + '"]').prop('checked', value) 
}

AssetCheckSingle.prototype.setText = function (el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input').val();
	
	if(this.editAssetDiv.find('[name="' + name + '"]').length == 0) {
		this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' field does not exist in this asset.');
		return false;
	}
	
	this.editAssetDiv.find('[name="' + name + '"]').val(value);
}


//I don't overload this function, but I do have my own version.
md5Function(transferAssets, 'transferAssets', "80d068cc18033e6ed4c9bea95a5be9a8");
//This is not a reusable transfer function. Consider refactoring to be more reusable.
AssetCheckSingle.prototype.transfer = function () {
	var loc = this.setSpecialAsset('Location');
	if(loc.is(':checked')) {
		var location = loc.parent().find('div > :input').val();
		var assets = this.asset.val();
		var string = "location="+location + "&assets=" + assets;
		var file = 'editassettransferprocess.php';
		ajax(string, file, $.proxy(function(response){
			if (response.indexOf("Transfer Successful") != -1){
				this.event.trigger('transfered');
			}else{
				this.checkFailed(response);
			}
		},this), 'assets');
	} else {
		this.errorCheck('transfered');
	}
}

//I don't overload this function, but I do have my own version.
md5Function(addSalesOrderLine, 'addSalesOrderLine', "ed638fa787dc7fdab54c8614019aaaf7");
//This is not a reusable SO function. Consider refactoring to be more reusable.
AssetCheckSingle.prototype.addToSO = function () {
	var so = this.setSpecialAsset('salesOrder');
	if(so.is(':checked')) {
		var sorder = so.parent().find('div > :input').val();
		var string = "order="+sorder+"&assets="+this.asset.val();
		var file = 'addsalesorderline.php';

		ajax(string, file, $.proxy(function(response){
			this.event.trigger('finished');
		},this), 'sales_order');
	} else {
		this.errorCheck('finished');
	}
}

AssetCheckSingle.prototype.setSpecialAsset = function (name) {
	return $('.assetSet :input[name="' + name + '"]').parent().parent().children(':checkbox');
}

