

////////////////////////////////////////////////
var AssetController = function (id) {
	this.id = id;
	this.asset = $('#' + id + 'ID');
	this.editAssetDiv = $('#' + id + 'EditDiv');
	this.productDiv = $('#' + id + 'Product');
}
AssetController.prototype = Object.create(InputForm.prototype);

AssetController.prototype.setAssetID = function (id) {
	this.asset.val(id);
//	this.asset.trigger('changed');
}

AssetController.prototype.getAssetID = function() {
	return this.asset.val();
}

AssetController.prototype.load = function (id) {
	if(typeof(id) == 'undefined') {
		var id = this.getAssetID(id); 
	} else {
		this.setAssetID(id);
	}
	if(id == "") {
		return;
	}
	var changedElements = this.changeDivs(this.editAssetDiv, "editAssetForm"); 
	ajaxCallback.call(this,function(){this.loadCallback(changedElements);});
	selectAsset(id);
}

AssetController.prototype.loadCallback = function (changedElements) {
	this.restoreDivs(changedElements);
//	this.productDiv.html($('#editOrderlineProductSearchText' + this.getAssetID()).val().replace("GENERIC HARD DRIVE ",""));
//Look for deleted asset here.
	this.asset.trigger('loaded');
}

//0 = pass, 1 = fail for condition. 
AssetController.prototype.setCondition = function (condition) {
	if(condition == "Pass") condition = "0";
	if(condition == "Fail") condition = "1";
	if(typeof(condition) != 'undefined') {
		$('.' + this.id + ' [name="test2"]').eq(condition).prop('checked', true);
		$('.' + this.id + ' [name="test15"]').eq(condition).prop('checked', true);
	}
//	$('#editOrderlineScrapped' + this.getAssetID()).prop('checked', true);
	this.asset.trigger('conditionSet');
}

AssetController.prototype.getAsset = function(currentID, assetType) {
//Checks ID
	assetType = assetType || "";
	if(!this.checkLoaded(currentID)) {
		this.editAssetDiv.html("");
		return ["The item with the ID of " + currentID + " doesn't exist or has been deleted.", currentID];
	}
	
//Checks that the item is not shipped.
	if($('.'+ this.id + ' #detailWrapper div').hasClass("scrapped")) {
		return ["The item " + currentID + " has been shipped or scrapped.", currentID];
	}

//Set the product type.	
	var type;
	if($("." + this.id + " [name='spec10']").length != 0) { //If the field exists, it's a hard drive.
		type = "hard drive";
	} else if ($("." + this.id + " [name='searchOrderlineSpecText6']").length != 0) { //If field exists, it's a laptop.
		type = "laptop";
	} else {
		type = "other";
	}

	
	if(assetType == "hard drive" || assetType == "laptop") {
		var currentAsset = new Product(currentID,type);	
	} else if(assetType == "simple") {
		currentAsset = new Asset(currentID,type);
	} else if (type == "hard drive") {
		currentAsset = new Product(currentID,type);
	} else if (type == "laptop") {
		currentAsset = new Laptop(currentID,type);
	}
	
	this.editAssetDiv.html("");
	
	return currentAsset;
}

AssetController.prototype.save = function (condition) {
	ajaxCallback.call(this,function(){this.saveCallback()},3);
	console.log("Saving asset: " + this.getAssetID());
	saveAsset(this.getAssetID());
}

AssetController.prototype.saveCallback = function () {
	this.asset.trigger('saved');
}

AssetController.prototype.printTag = function () {
	newWindow("id=" + this.getAssetID(), 'printassettag.php', 'assets', true);
}

AssetController.prototype.checkLoaded = function (currentID) {
	var assetID = $("." + this.id + " #editAssetID").val();
	if(typeof(assetID) == 'undefined' || assetID != currentID) {
		return false;
	} 
	return assetID;
}


////////////////////////////
	
//Creates an asset object. Will be inherited by other objects.
var Asset = function(id,type) {
	Object.defineProperty(this,"assetID", {value: id, writable : true, enumerable : false, configurable : true});
	this.assetType = type;
}	
//Has default text for assetType.
Asset.prototype = Object.create(Object.prototype, {
	assetType: {value: "Asset Type", writable: true,  enumerable: true,  configurable: true}
});
//Compares the specifications of assets. There will be more than just the assetType.
Asset.prototype.compare = function (asset2) {
	if (!asset2) return false;
	if (this.length != asset2.length) return false;

	for ( var p in this ) {
		if(this[p] != asset2[p]) {
			var result = Object.getPrototypeOf(this)[p] + " of the current item is " + this[p] + ". \n" + Object.getPrototypeOf(this)[p] + " of the first item is " + asset2[p] + ".";
			return result;
		}
	}
	return true;
}	

//inherits the Asset object and adds what's needed for comparing simple products, such as hard drives.
var Product = function (id,type,condition,product) {
	this.product = product || $("#editOrderlineProductSearchText" + id).val();
	
	//This checks the fail radio button.
	this.condition = condition || $("[name='test2']").eq(1).prop('checked');	
	
	if(this.condition == false) {
		this.condition = "Pass";
	} else if (this.condition == true) {
		this.condition = "Fail";
	}

	Asset.apply(this, arguments);
};
//Sets the default text for specifications. 
Product.prototype = Object.create(Asset.prototype, {
	product: {value: "Product Name",  writable: true,  enumerable: true,  configurable: true},
	condition: {value: "Product Condition",  writable: true,  enumerable: true,  configurable: true}
});

//This has the same concept as the Product object. However, I have not implemented it yet.
var Laptop = function (id,type,condition,product,attatchedAssets,webcam,cpuID) {
	Product.apply(this, arguments);
	//Sets the CPU info.
	Object.defineProperty(this,"cpuID", {value: cpuID || $('#spec6').val(), writable : true, enumerable : false, configurable : true});
	this.setCPU();
	this.product = this.setProduct();
	
//These need fixing. 
	this.attatchedAssets = attatchedAssets || ""; 
}
Laptop.prototype = Object.create(Product.prototype, {
	cpuGen:{value: "CPU Type",  writable: true,  enumerable: true,  configurable: true},
	attatchedAssets: {value: "Attatched Assets",  writable: true,  enumerable: true,  configurable: true},
//	webcam:{value: "Webcam",  writable: true,  enumerable: true,  configurable: true},
	cpuBrand:{value: "CPU Brand",  writable: true,  enumerable: true,  configurable: true}
});

Laptop.prototype.setProduct = function () {
	if(this.cpuGen == "I Series") {
		return "iSeries";
//This one needs fixed V 
	} else if(this.isHPBusiness()) {
		return "HP Business";
//This one also needs fixed. Lats
	} else if(this.isDellBusiness()) {
		return "Dell Business";
	} else if(this.condition == "Pass") {
		var	webcam = $('input[name="spec8"]:checked').val();
		var notes = $('[name="spec15"]').eq(0).val();
//need some way of verifying this text V 		
		if(notes.toLowerCase().indexOf("cracked")) { 
			return this.cpuGen + " with Cracked Screen";
//May need to double check that BIOS will be in text. Perhaps locked.
		} else if (notes.toLowerCase().indexOf("bios")) {
			return this.cpuGen + " with BIOS locked";
		} 
		if (webcam == "1") {
			return this.cpuGen + "with webcam";
		} else if (webcam == "0") {
			return this.cpuGen + "without webcam";
		}		
	} else if(this.condition == "Fail") {
		return this.cpuGen + " Dismantle";
	} 
	
	return "Unknown type";
}

Laptop.prototype.isHPBusiness = function () {
	hpArray = ["HP COMPAQ 6910P", "HP COMPAQ N_6400 SERIES", "HP ELITEBOOK 6930"]; 
		
	if(hpArray.indexOf(this.product) != -1)
		return true;
	else
		return false;	
}

Laptop.prototype.isDellBusiness = function () {
	var d = "DELL LATITUDE D";
	var m = "DELL PRECISION M";
	var e = "DELL LATITUDE E";
	dellArray = [d + "420", d + "430", d + "520", d + "530", d + "531", d + "620", d + "630", d + "820", d + "830", 
		m + "20", m + "2300", m + "2400", m + "4300", m + "4400", m + "50", m + "60", m + "6300", m + "6400", m + "65", m + "70", m + "90", 
		e + "4200", e + "4300", e + "4310", e + "5400", e + "5410", e + "5420", e + "5420M", e + "5500", e + "5510", e + "5520", e + "5520M",
		e + "6220", e + "6320", e + "6330", e + "6400", e + "6410", e + "6420", e + "6430", e + "6430S", e + "6500", e + "6510", e + "6520", e + "6530", ]; 
		
	if(dellArray.indexOf(this.product) != -1)
		return true;
	else
		return false;	
}

Laptop.prototype.setCPU = function () {
	var i;
	for(i = 0; i < this.cpuArray.length; i++) {
		if(this.cpuArray[i][0] == this.cpuID) 
			break;
	}
	if(i == this.cpuArray.length) {
		console.log("Trouble!");
		return;
	}
//	this.cpuName = this.cpuArray[i][1];
	this.cpuGen = this.cpuArray[i][2];
	this.cpuBrand = this.cpuArray[i][3]; 
}
firstArray = "71,AMD ATHLON 4,Pentium 3,AMD:\
77,AMD ATHLON 64,Pentium 4,AMD:\
220,AMD ATHLON 64 (TF-20),Green Planet,AMD:\
86,AMD ATHLON 64 X2,Dual Core,AMD:\
153,AMD ATHLON II X2,Dual Core,AMD:\
157,AMD ATHLON II X3,Quad Core,AMD:\
154,AMD ATHLON II X4,Quad Core,AMD:\
212,AMD ATHLON NEO,Pentium M,AMD:\
69,AMD ATHLON XP,Pentium 3,AMD:\
70,AMD ATHLON XP-M,Pentium 3,AMD:\
208,AMD C-50,Dual Core,AMD:\
224,AMD C-60,Dual Core,AMD:\
66,AMD DURON,Pre Pentium 3,AMD:\
225,AMD FUSION,Dual Core,AMD:\
68,AMD K6,Pre Pentium 3,AMD:\
91,AMD PHENOM II,Dual Core,AMD:\
155,AMD PHENOM X3,Quad Core,AMD:\
152,AMD PHENOM X4,Quad Core,AMD:\
110,AMD SEMPRON (DUAL CORE ERA),Green Planet,AMD:\
109,AMD SEMPRON (P4 ERA),Pentium 4,AMD:\
214,AMD SEMPRON (PENTIUM M ERA),Pentium M,AMD:\
78,AMD TURION 64,Pentium M,AMD:\
87,AMD TURION 64 X2,Dual Core,AMD:\
89,AMD TURION II,Dual Core,AMD:\
223,AMD TURION NEO,Dual Core,AMD:\
211,AMD V120,Green Planet,AMD:\
213,AMD V140,Green Planet,AMD:\
217,AMD VISION A10,Quad Core,AMD:\
57,AMD VISION A4,Dual Core,AMD:\
58,AMD VISION A6,Dual Core,AMD:\
59,AMD VISION A8,Quad Core,AMD:\
56,AMD VISION E SERIES,Green Planet,AMD:\
139,EXYNOS 5 DUAL,Other,Other:\
82,INTEL ATOM,Pentium M,Intel:\
97,INTEL CELERON (PENTIUM 4 ERA),Pentium 4,Intel:\
96,INTEL CELERON (PENTIUM III ERA),Pentium 3,Intel:\
98,INTEL CELERON (POST PENTIUM M),Green Planet,Intel:\
151,INTEL CELERON D,Pentium M,Intel:\
76,INTEL CELERON M,Pentium M,Intel:\
84,INTEL CORE 2 DUO,Dual Core,Intel:\
85,INTEL CORE 2 EXTREME,Quad Core,Intel:\
93,INTEL CORE 2 QUAD,Quad Core,Intel:\
92,INTEL CORE 2 SOLO,Green Planet,Intel:\
83,INTEL CORE DUO,Dual Core,Intel:\
60,INTEL CORE I3,I Series,Intel:\
61,INTEL CORE I5,I Series,Intel:\
62,INTEL CORE I7,I Series,Intel:\
80,INTEL CORE SOLO,Pentium M,Intel:\
94,INTEL PENTIUM (ORIGINAL),Pre Pentium 3,Intel:\
99,INTEL PENTIUM (POST PENTIUM M),Dual Core,Intel:\
74,INTEL PENTIUM 4,Pentium 4,Intel:\
150,INTEL PENTIUM D,Pentium M,Intel:\
90,INTEL PENTIUM DUAL-CORE,Dual Core,Intel:\
64,INTEL PENTIUM II,Pre Pentium 3,Intel:\
63,INTEL PENTIUM III,Pentium 3,Intel:\
75,INTEL PENTIUM M,Pentium M,Intel:\
65,INTEL PENTIUM MMX,Pre Pentium 3,Intel:\
226,INTEL PRE-PENTIUM,Pre Pentium 3,Intel:\
158,INTEL XEON,Green Planet,Intel:\
140,POWERPC G3,Other,Other:\
141,POWERPC G4,Other,Other:\
142,POWERPC G5,Other,Other:\
72,TRANSMETA CRUSOE,Other,Other:\
73,VIA C3,Pre Pentium 3,Other:\
67,VIA C7,Pre Pentium 3,Other".split(':');
	cpuArray = new Array();
	firstArray.forEach(function(el){
		cpuArray.push(el.split(','));
	});
Laptop.prototype.cpuArray = cpuArray;
