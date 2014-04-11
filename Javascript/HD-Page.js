var AssetControllerAdvanced = function (id, checker) {
	AssetController.apply(this,arguments);
	
	this.event.on("keyup", $.proxy(function(event) {if(event.keyCode == 13 || event.keyCode == 10) this.load();},this));
	this.event.on("loaded", $.proxy(function() {this.checkAsset(checker.assetDiv, function(){console.log("Finished");});},checker));
	this.event.on("loaded", $.proxy(this.stripSaveOnClick,this));
	
}
try {
AssetControllerAdvanced.prototype = new Object(AssetController.prototype);
} catch (err) { location.reload(); }

AssetControllerAdvanced.prototype.select = function () {
	this.asset.select();
}

AssetControllerAdvanced.prototype.stripSaveOnClick = function () {
	$('[value=save]').attr('onclick','');
}

//$.extend(AssetControllerAdvanced, Build);
	
var loadImprovedEditAsset = function () {
	var mainDiv = $('<div id="improvedAsset" class="improvedAsset" />');
	var assetWrapper = $('<div id="editAssetWrapper" />');
	var assetDiv = $('<div id="improvedAssetDiv" style="float:left; margin-right:195px;" />');
	var controlDiv = $('<div style="right:15px;position:absolute; width:160px;"> \
			<div style="position:fixed;"> Enter Asset: <input type="text" id="improvedAssetID"> </div> \
		</div>');
	
	checker = new AssetCheck (assetDiv);
	assetWrapper.append(assetDiv);
	mainDiv.append(assetWrapper);
	controlDiv.append(checker.buildSetup());
	
	mainDiv.prepend(controlDiv);
	
		
	$('#dashboard').html('').append(mainDiv);
//Should be local, but it makes it way easier for now.
	improvedAsset = new AssetControllerAdvanced("improvedAsset", checker);
	$('#improvedAssetDiv').on('click', '[value="save"]' ,function () {saveAsset(getEditAssetID());improvedAsset.select();});
	improvedAsset.select();
}





