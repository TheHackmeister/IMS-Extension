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
	container.append(this.buildContainer('options', 'Options', this.buildOptions));
	this.controlDiv.append(container);

	
	//Events.
	this.event.on("keyup", $.proxy(function(event) {if(event.keyCode == 13 || event.keyCode == 10) this.load();},this));
//	this.event.on('change', $.proxy(function(event) {this.load();},this));
	this.event.on("loaded", $.proxy(function() {this.checkAsset();},this));
	this.event.on('checked', $.proxy(function() {this.setSpecsAndTests();},this));
	this.event.on('checked', $.proxy(function() {this.checkPrintTag(this.getOption('printTag'));}, this));
	
	this.event.on('saveReady', $.proxy(function() {this.save();},this));
	this.event.on('saved', $.proxy(function() {this.transferOrReturn();},this));
	this.event.on('transfered', $.proxy(function() {this.addToSO();},this));
	this.event.on("finished", $.proxy(function() {if($('.assetCheck > input').is(':checked')) {this.sound.play(150,'Good');}},this));
}
try {
	AssetCheckSingle.prototype = Object.create(AssetCheck.prototype);
} catch (err) { location.reload(); }

//I don't overload this function, but I do have my own version.
md5Function(transferAssets, 'transferAssets', "928056f58778f3b5642522cb7a68aa69");
//This is not a reusable transfer function. Consider refactoring to be more reusable.
AssetCheckSingle.prototype.transfer = function () {
	var loc = this.setSpecialAsset('Location');
	if(loc.is(':checked')) {
		var location = loc.parent().find('div > :input').val();
		var assets = this.asset.val();
		var string = "location="+location + "&items=" + assets + "&transferContents=" + "false";
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


AssetCheckSingle.prototype.transferOrReturn = function () {
	var loc = this.setSpecialAsset('Location');
	var returnAsset = this.setSpecialAsset('returnNumber');

	if (loc.is(':checked') && returnAsset.is(':checked')) {
		this.checkFailed('You cannot have both transfer and return set.');
		return;
	}
	
	if (loc.is(':checked')) {
		this.transfer();
	} 
	
	if (returnAsset.is(':checked')) {
		this.returnAsset();
	}
	
	if(!returnAsset.is(':checked') && !loc.is(':checked')) {
		this.errorCheck("transfered");
	}
}

AssetCheckSingle.prototype.returnAsset = function () {
	console.log("Return called");
	var returnN = this.setSpecialAsset('returnNumber');
	if(returnN.is(':checked')) {
		console.log("Return started");
		var returnNumber = returnN.parent().find('input[name="returnNumber"]').val();
		var location = returnN.parent().find('input[name="returnLocation"]').val();
		var asset = this.asset.val();
		
		var string = "order="+returnNumber+"&asset="+asset+"&location="+location;
		var file = 'addreturnlineasset.php';   

		ajax(string, file,  $.proxy(function(response){
			if(response != "Re-enter location key"){
				this.event.trigger('transfered');
			} else {
				this.checkFailed(response);
			}
		},this), 'returns');
	} else {
		this.errorCheck('transfered');
	}
}

//I don't overload this function, but I do have my own version.
md5Function(addSalesOrderLine, 'addSalesOrderLine', "67e53e278be1e7e42bc6b06982cbc04e");
//This is not a reusable SO function. Consider refactoring to be more reusable.
AssetCheckSingle.prototype.addToSO = function () {
	var so = this.setSpecialAsset('salesOrder');
	if(so.is(':checked')) {
		var sorder = so.parent().find('div > :input').val();
		var price = '';
		/* Price has not been implemented in my code yet. 
		if($('#transferPrice').length > 0){
			price = $('#transferPrice').val();
		}
		*/
		
		var string = "order="+sorder+"&assets="+this.asset.val()+"&price="+price;
		var file = 'addsalesorderline.php';

		ajax(string, file, $.proxy(function(response){
			this.event.trigger('finished');
		},this), 'sales_order');
	} else {
		this.errorCheck('finished');
	}
}
/*
AssetCheckSingle.prototype.finalReload() = function () {
	if() {
		this.loadNoCallback();
	}
}
*/
/*
md5Function(addReturnlineAsset, "addReturnlineAsset", "7112031b50e735476541b9867c57dc14");
AssetCheckSingle.prototype.returnAsset = function () {
	var returnAsset = this.setSpecialAsset('Return');
	if(returnAsset.is(':checked')) {
		
		var returnNumber = returnAsset.parent().find('div > :input').val();
		var asset = this.asset.val();		
		var location = document.getElementById('addReturnlineLocation').value;
		
		var string = "order="+order+"&asset="+asset+"&location="+location;
		var file = 'addreturnlineasset.php';   

		ajax(string, file, function(response){
			if(response != "Re-enter location key"){
				document.getElementById('addReturnlineAssetTag').value = '';
				document.getElementById('addReturnlineLocation').value = '';
				//table = document.getElementById('returnlineTable');
				$('#addReturnLineWrapper').prepend(response);
			}
			else{
				 document.getElementById("addOrderLineResult").innerHTML = response;
			}
		}, 'returns');

		
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

*/
