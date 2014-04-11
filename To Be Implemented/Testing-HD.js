

//////////////////////////////////////

CheckHd = function (id) {
	this.id = id;
	this.asset = new AssetController(id);
	this.poDiv = $('#' + id + 'PO');
	this.poNotes = $('#' + id + 'PONotes');
	this.scrapOption = $('#' + id + 'ScrapOption');

	this.printOption = $('#' + id + 'PrintOption');
	this.formFactor = $('#' + id + 'FormFactor');
	
	//Event handlers 

	this.asset.asset.on('change', $.proxy(function() {this.load();},this.asset));
	this.asset.asset.on('loaded', $.proxy(function () {
		this.asset.asset.focus().select();
		this.printTag();
		this.loadPONotes();
		this.checkHd();
		this.asset.productDiv.html($('#editOrderlineProductSearchText' + this.asset.getAssetID()).val().replace("GENERIC HARD DRIVE ",""));
		
		//$('#editOrderlineProductSearchText' + this.asset.getAssetID()).val($('#editOrderlineProductSearchText' + this.asset.getAssetID()).val().replace("GENERIC HARD DRIVE ","").replace("3.5 IN ","LPTP ").replace(" SATA","").replace(" IDE","")).trigger('keyup');
	},this));
	this.asset.editAssetDiv.on('click', 'input[value="save"]', $.proxy(function () {this.asset.asset.focus().select();},this));
}
CheckHd.prototype = Object.create(InputForm.prototype);

CheckHd.prototype.loadPONotes = function () {
	var changedElements = this.changeDivs(this.poDiv, "editOrderForm"); 
	ajaxCallback.call(this,function(){this.loadPONotesCallback(changedElements)});
	selectOrder($('.' + this.id + ' #editOrderlinePO').val().replace(/\/\d+/, ""));
}

CheckHd.prototype.loadPONotesCallback = function (changedElements) {
	this.restoreDivs(changedElements);
	this.poNotes.html($('.' + this.id + ' #notes').val());
	this.poDiv.html("");
}

CheckHd.prototype.printTag = function () {
	if(this.printOption.is(":checked") == true) {
		this.asset.printTag();
	}
}

CheckHd.prototype.checkHd = function () {
	if($('#editOrderlineProductSearchText' + this.asset.getAssetID()).val().indexOf(this.formFactor.val()) == -1) {
		alert("The product is not of type " + this.formFactor.val());
	}
	
	if($('.' + this.id + ' [name="test2"]').eq(1).prop('checked') == true && this.scrapOption.is(":checked") != true) {
		alert("Asset condition is bad.");
	}
	
	if($('.' + this.id + ' [name="test2"]').eq(0).prop('checked') == true && this.scrapOption.is(":checked") == true) {
		alert("Asset condition is good");
	}
	
	if(typeof($('.' + this.id + ' [name="test15"]').val()) == 'undefined') {
		alert("Asset does not have quickwipe test.");
	}
}

/////////////////////////////////////////////////////
var SetAssetCondition = function (id) {
	this.id = id;
	this.condition = $('#' + id + 'Condition');
	TransferWithPreCheck.apply(this, arguments);
//	this.count = $("#" + id + 'Count');
//	this.submit = $("#" + id + 'Button');
//	this.checkType = $('#' + id + 'CheckType');
//	this.location = new Loc(id);
//	this.asset = new AssetController(id);
//	this.beep = beepAlert;

		
	
//Event Handlers
	this.submit.on('click',$.proxy(function() {$('#asset1EditDiv').html("");this.startSettingCondition();},this));
	this.asset.asset.on('loaded', $.proxy(function () {this.asset.setCondition(this.getCondition());},this));
	this.asset.asset.on('conditionSet', $.proxy(function() {this.save();},this.asset));
	this.asset.asset.on('saved', $.proxy(function() {this.continueSettingCondition();}, this));
		
	this.assets.on('keyup', $.proxy(function(event){
	   if (event.keyCode == 13 || event.keyCode == 10) {
			this.countAssets();
			this.preCheck();
		} else {
			this.countAssets();
		}
	},this));
}
SetAssetCondition.prototype = Object.create(TransferWithPreCheck.prototype);



SetAssetCondition.prototype.startSettingCondition = function () {
	if(this.location.val() == "") {
		alert("Please enter a transfer to location");
		return;
	}
	this.assetList = this.assets.val().replace(/^\s*[\r\n]/gm, "");
	this.assetList = this.assetList.split(/\n/);
	if(this.assetList[this.assetList.length - 1] == "") {
		this.assetList.pop();
	}
	this.listLength = this.assetList.length;
	this.asset.load(this.assetList[0]);
}

SetAssetCondition.prototype.getCondition = function () {
	return this.condition.val();
}

SetAssetCondition.prototype.setupComparison = function (asset, id) {
	var comp = new Product("",this.checkType.val(),this.condition.val(), "");
	comp.product = asset.product;
	return comp;
}

SetAssetCondition.prototype.continueSettingCondition = function () {
	//hideLoading(); Not needed?
	console.log("On asset " + (this.listLength - this.assetList.length + 1) + " of " + this.listLength + ".");
	
	this.assetList.remove(0);
	if (this.assetList.length > 0) {
		this.asset.load(this.assetList[0]);
	} else {
		console.log("Starting transfer.");
		this.transfer();
	}
}


////////////////////////////////////
//HTML for HD testing page.
$('#dashboardBody').html('Current Asset: <input id="asset1ID" value="" placeholder="Current Asset"> <span id="asset1Product" style="font-size:2em;">None </span></br> \
	Form Factor: <select id="asset1FormFactor"> \
			<option value="LPTP">Laptop Drive</option> \
			<option value="">None</option> \
			<option value="3.5 IN">Desktop Drive</option> \
		</select> </br> \
	Print Tag:<input type="checkbox" id="asset1PrintOption"> </br>\
	Disable scrapping alert:<input type="checkbox" id="asset1ScrapOption"> </br> \
<div class="divCell asset1"> \
	PO Notes: <span id="asset1PONotes">PO Notes</span>  </br> \
	<div id="asset1EditDiv"></div> \
	<div id="asset1PO" style="visibility:hidden; width:1px; height:1px;"> </div>\
</div> \
</br></br> \
<div class="sac"> \
	<div>Set condition and transfer</div>\
	<div>Transfer Location: <input id="sacLocation" placeholder="Location"> </br> \
	Condition: <select id="sacCondition"> \
		<option value="Pass">Pass</option> \
		<option value="Fail">Fail</option> \
	</select> \
	Check Type: <select id="sacCheckType"> \
		<option value="hard drive">Hard Drive</option> \
		<option value="laptop">Laptop</option> \
		<option value="simple">Simple</option> \
		<option value="none">None</option> \
	</select> </br>\
	<textarea rows="20" cols="30" id="sacAssets"></textarea>	\
	<button id="sacButton">Set condition</button> \
	<span id="sacCount"></span> \
	<div id="sacResults"></div> \
	<input type="hidden" id="sacID" value=""> \
	<div id="sacEditDiv" style="visibility:hidden; width:1px; height:1px;"> </div> \
</div>');
var beepAlert = new SoundAlert();
var check = new CheckHd('asset1');
var sac = new SetAssetCondition('sac');
