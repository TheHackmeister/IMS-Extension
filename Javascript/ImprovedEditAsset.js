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
	this.event.on('checked', $.proxy(function() {this.transfer();},this));
	this.event.on("finished", $.proxy(function() {if($('.assetCheck > input').is(':checked')) {this.sound.play(150,'Good');}},this));
}
try {
	AssetCheckSingle.prototype = Object.create(AssetCheck.prototype);
} catch (err) { location.reload(); }

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
				this.event.trigger('finished');
			}else{
				this.checkFailed(response);
			}
		},this), 'assets');
	} else {
		this.errorCheck('finished');
	}
}


AssetCheckSingle.prototype.setSpecialAsset = function (name) {
	return $('.assetSet :input[name="' + name + '"]').parent().parent().children(':checkbox');
}

