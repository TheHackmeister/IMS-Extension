var loadImprovedEditAsset = function () {
	
	var mainDiv = $('<div id="improvedAsset" class="improvedAsset" />');
	var assetWrapper = $('<div id="editAssetWrapper" />');
	var assetDiv = $('<div id="improvedAssetDiv" style="float:left; margin-right:195px;" />');
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
	this.event.on("loaded", $.proxy(function() {this.checkAsset(function(){console.log("Finished");});},this));
	this.event.on("checked", $.proxy(function() {this.checkAsset(function(){this.event.trigger();});},this));
}
try {
	AssetCheckSingle.prototype = Object.create(AssetCheck.prototype);
} catch (err) { location.reload(); }



