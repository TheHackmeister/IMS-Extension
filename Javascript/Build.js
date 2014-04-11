
var AssetCheck = function (assetDiv) {
	this.assetDiv = assetDiv;

}
AssetCheck.prototype.attach = function (parent,child) {
	parent.append(child);
}

AssetCheck.prototype.buildContainer = function (eClass,text,onClick) {
	var element = $('<div/>');
	element.addClass(eClass);

	var checkbox = $('<input type="checkbox"/>')
	checkbox.addClass('container');
	checkbox.on('click', $.proxy(onClick,this));
	
	var container = $('<div/>').css('padding-left', '20px');
	
	element.append(checkbox);
	element.append(text);
	element.append(container);
	
	return element;
}

//I think I can remove eClass

AssetCheck.prototype.buildRadio = function (specName,specNumber,special,good,bad) {
	var el = $('<div/>');
	good = good || "P";
	bad = bad || "F";
	special = special || false;
	specNumber = specNumber + "Checker";
	var titleCheckbox = $('<input type="checkbox"/>')
//	titleCheckbox.addClass(eClass);
	titleCheckbox.addClass("option");
	
	var spec = $('<div/>').hide();
	var yes = $('<input class="inputOption" type="radio" name="' + specNumber + '" value="1"/>');
	var no = $('<input class="inputOption" type="radio" name="' + specNumber + '" value="0"/>');
	var checkbox = $('<input type="checkbox" name="' + specNumber + '"/>');
//I think I need an event based higher up.	
	checkbox.on('click', this.unsetRadio);
	
	if(special) {
		spec.addClass("special");
	}
	
	el.append(titleCheckbox);
	el.append(specName);
	spec.append(yes).append(good);	
	spec.append(no).append(bad);
	spec.append(checkbox).append('Unset');
	el.append(spec);
	return el;
}

AssetCheck.prototype.buildSpecRadio = function (specName,specNumber,special) {
	return this.buildRadio(specName,specNumber,special,"Y","N");
}

AssetCheck.prototype.buildTextBox = function (specName,specNumber, special) {
	var el = $('<div/>');
	var titleCheckbox = $('<input type="checkbox"/>')
	titleCheckbox.addClass("option");
	special = special || false;
	var spec = $('<div/>').hide();
	var textbox = $('<input type="text" class="inputOption" name="' + specNumber + '" value=""/>');
	
	if(special) {
		spec.addClass("special");
		textbox.css('direction','rtl');
	}
	
	el.append(titleCheckbox);
	el.append(specName);
	spec.append(textbox);	
	el.append(spec);
	return el;
}

AssetCheck.prototype.buildCheckBox = function (specName,specNumber, special) {
	var el = $('<div/>');
	var titleCheckbox = $('<input type="checkbox"/>')
	titleCheckbox.addClass("option");
	special = special || false;
	var spec = $('<div/>').hide();
	var checkbox = $('<input type="checkbox" class="inputOption" name="' + specNumber + '" />');
	spec.prepend("Checked:");
		
	if(special) {
		spec.addClass("special");
	}
	el.append(titleCheckbox);
	el.append(specName);
	spec.append(checkbox);	
	el.append(spec);
	return el;
}


AssetCheck.prototype.buildOption = function (specName,buildFunction, special) {
	var el = $('<div/>');
	var titleCheckbox = $('<input type="checkbox"/>')
	titleCheckbox.addClass("option");
	var spec = $('<div/>').hide();

	special = special || false;
	if(special) {
		spec.addClass("special");
	}
	
	el.append(titleCheckbox);
	el.append(specName);
	spec.append(buildFunction());	
	el.append(spec);
	return el;
}

AssetCheck.prototype.toggleVisible = function (event) {
	$(event.target).parent().children('div').toggle();
}

AssetCheck.prototype.unsetRadio = function (event) {
	if($(event.target).is(':checked')) {
		$(event.target).parent().children('input[type="radio"]:checked').prop('checked', false);
	}
}

AssetCheck.prototype.buildSetup = function () {
	var container = $('<div style="margin-top:65px;"/>');
	var check = this.buildContainer('assetCheck','Check', this.buildCheckList);
	container.append(check);
	container.on('click', '.option', this.toggleVisible);
	var set = this.buildContainer('assetSet', 'Set', this.buildSetList);
	container.append(set);
	return container;
}

AssetCheck.prototype.buildCheckList = function (event) {
	var container = $(event.target).parent().children('div');
	if(!$(event.target).is(':checked')) {
		container.html('');
		return;
	}
	
//These will probably need to be modified to fit whatever I come up with in the execution side.
	container.append(this.buildTextBox('Product','Product', 'special'));
	container.append(this.buildOption('Type',this.buildOptionType, 'special'));
	container.append(this.buildCheckBox('Scrapped','Scrap', 'special')); // Should have option to check for, not for, and not check. 
	container.append(this.buildCheckBox('Shipped','Shipped', 'special')); //Default to check for not shipped/scrapped. 
	var specs = this.buildContainer('checkSpecs','Specs', this.buildSpecs);
	var tests = this.buildContainer('checkTests','Tests', this.buildTests);
	container.append(specs);
	container.append(tests);
}

AssetCheck.prototype.buildSetList = function () {
	var container = $(event.target).parent().children('div');
	if(!$(event.target).is(':checked')) {
		container.html('');
		return;
	}
	
//These will probably need to be modified to fit whatever I come up with in the execution side.
	container.append(this.buildTextBox('Product','Product'));
	container.append(this.buildContainer('checkSpecs','Specs', this.buildSpecs));
	container.append(this.buildContainer('checkTests','Tests', this.buildTests));
	container.append(this.buildTextBox('Location','Location'));
	container.append(this.buildTextBox('Sales Order','Sales Order'));
}

AssetCheck.prototype.buildSpecs = function (event) {
	var container = $(event.target).parent().children('div');
	if(!$(event.target).is(':checked')) {
		container.html('');
		return;
	}
	
	container.append(this.buildTextBox("CPU Type","spec6", 'special'));
	container.append(this.buildTextBox("CPU Speed","spec5"));
	container.append(this.buildOption("RAM",this.buildOptionRam));
	container.append(this.buildTextBox("Screen Size","spec3"));
	container.append(this.buildCheckBox("Webcam","spec8"));
	container.append(this.buildOption("Optical Drive",this.buildOptionOptical));
	container.append(this.buildTextBox("USB Ports","spec27"));
	container.append(this.buildCheckBox("HDMI","spec28"));
	container.append(this.buildCheckBox("Memory Card","spec29"));
	container.append(this.buildOption("CoA",this.buildOptionCOA));
	container.append(this.buildCheckBox("OS","spec18"));
	container.append(this.buildCheckBox("HD Adapter","spec25"));
	container.append(this.buildCheckBox("HD Caddy","spec24"));
	container.append(this.buildCheckBox("Battery","spec20"));
	container.append(this.buildCheckBox("Adapter","spec25"));
	container.append(this.buildTextBox("Notes","spec15"));
//	container.append(this.buildOption("HDD Size",));
//	container.append(this.buildOption("HDD Type",));
	container.append(this.buildCheckBox("WIFI","spec16"));
//	container.append(this.buildOption("Mobile Connection",));
//	container.append(this.buildOption("Form Factor",));
//	container.append(this.buildOption("Screen Condition (Out of 10)",));
//	container.append(this.buildOption("Outer Case Condition (Out of 10)",));
//	container.append(this.buildOption("Inner Case Condition (Out of 10)",));
//	container.append(this.buildOption("Hinge Condition (Out of 5)",));
//	container.append(this.buildOption("Brand",));
	container.append(this.buildTextBox("Model","spec31"));
}

AssetCheck.prototype.buildTests = function (event) {
	var container = $(event.target).parent().children('div');
	if(!$(event.target).is(':checked')) {
		container.html('');
		return;
	}
	
	container.append(this.buildRadio('CONDITION','test2'));
	container.append(this.buildRadio('MEMTEST','test1'));
	container.append(this.buildRadio('CNTRACT WK','test3'));
	container.append(this.buildRadio('MB 2ND','test4'));
	container.append(this.buildRadio('REFURB','test5'));
	container.append(this.buildRadio('REFURB 2ND','test6'));
	container.append(this.buildRadio('REFURB 3RD','test7'));
	container.append(this.buildRadio('FW RESET','test8'));
	container.append(this.buildRadio('OS TEST','test9'));
	container.append(this.buildRadio('HD E-WIPE','test10'));
	container.append(this.buildRadio('LCD TEST','test13'));
	container.append(this.buildRadio('FH TEST','test14'));
	container.append(this.buildRadio('HD Q-WIPE','test15'));
	container.append(this.buildRadio('PASS POST','test16'));	
}


AssetCheck.prototype.buildOptionRam = function () {
	return $('<select class="inputOption" name="spec7"> \
				<option value="null"></option> \
				<option value="15">1 GB</option> \
				<option value="100">1.25 GB</option> \
				<option value="38">1.5 GB</option> \
				<option value="143">128 MB</option> \
				<option value="216">16 GB</option> \
				<option value="16">2 GB</option> \
				<option value="101">2.5 GB</option> \
				<option value="12">256 MB</option> \
				<option value="39">3 GB</option> \
				<option value="40">4 GB</option> \
				<option value="215">5 GB</option> \
				<option value="13">512 MB</option> \
				<option value="102">6 GB</option> \
				<option value="156">7 GB</option> \
				<option value="14">768 MB</option> \
				<option value="103">8 GB</option> \
			</select>');
}

AssetCheck.prototype.buildOptionOptical = function () {
	return $('<select class="inputOption" name="spec9"> \
				<option value="null"></option> \
				<option value="9">BLU-RAY</option> \
				<option value="8">CD-ROM</option> \
				<option value="7">CDRW</option> \
				<option value="138">DAMAGED</option> \
				<option value="5">DVD-ROM</option> \
				<option value="6">DVD/CDRW</option> \
				<option value="4">DVDRW</option> \
				<option value="11">N/A</option> \
				<option value="10">NONE/MISSING</option> \
			</select>');
}

AssetCheck.prototype.buildOptionCOA = function () {
	return $('<select class="inputOption" name="spec14"> \
				<option value="null"></option> \
				<option value="149">Legible Product Key Only</option> \
				<option value="113">None/unreadable</option> \
				<option value="112">Pre-Windows XP</option> \
				<option value="125">Windows 7 Home Premium</option> \
				<option value="127">Windows 7 Pro</option> \
				<option value="126">Windows 7 Starter</option> \
				<option value="128">Windows 7 Ultimate</option> \
				<option value="129">Windows 8</option> \
				<option value="130">Windows 8 Pro</option> \
				<option value="122">Windows Vista Business</option> \
				<option value="120">Windows Vista Home Basic</option> \
				<option value="121">Windows Vista Home Premium</option> \
				<option value="123">Windows Vista Ultimate</option> \
				<option value="114">Windows XP Home</option> \
				<option value="117">Windows XP Media Center</option> \
				<option value="115">Windows XP Pro</option> \
				<option value="116">Windows XP Tablet</option> \
			</select>');
}

AssetCheck.prototype.buildOptionType = function () {
	return $('<select class="inputOption" name="Type"> \
				<option value="null"></option> \
				<option value="laptop">Laptop</option> \
				<option value="tablet">Tablet</option> \
				<option value="desktop">Desktop</option> \
				<option value="monitor">Monitor</option> \
				<option value="hdd">HDD</option> \
				<option value="mp3">MP3</option> \
				<option value="other">Other</option> \
			</select>');
}

AssetCheck.prototype.checkAsset = function (assetDiv, finishedFunction) {
	
	this.checkProduct(assetDiv, this.getSpecialAsset('Product'));
	this.checkAssetType(assetDiv, this.getSpecialAsset('Type'));
	this.checkDarked(assetDiv, this.getSpecialAsset('Scrap'), "SCRAPPED!");
	this.checkDarked(assetDiv, this.getSpecialAsset('Shipped'), "SHIPPED!");
	this.checkCPUType(assetDiv, this.getSpecialAsset('spec6'));
		
	//Checks each checked option.
	$('.assetCheck .option:checked').parent().children('div').each(function(i,el) {
		el = $(el);
		if(el.hasClass('special')) {
			return; //$.each version of continue. 
		}		
		//Radio Option
		if(el.children(':input').length == 3) {
			this.checkRadio(assetDiv, el);
		//Checkbox Option
		} else if(el.children(':input:checkbox').length == 1) {
			this.checkCheckbox(assetDiv, el);
		//Text Field
		} else {
			this.checkText(assetDiv, el);
		}
	});
	
	finishedFunction();
}

AssetCheck.prototype.checkRadio = function(assetDiv, el) {
	var isChecked = el.children(':input:checkbox').is(':checked');
	var val = el.children(':input:radio:checked').val() || 'undefined';
	var name = el.children(':input:radio').prop('name').replace('Checker','');
	//If the unset option is not enabled. 
	if(isChecked == false) {
		if(val != assetDiv.find('[name="' + name + '"]:checked').val()) {
			console.log("Radio Failure!");
		}
	} else {
		//If the val is different, and but not unset.
		if(val !=  assetDiv.find('[name="' + name + '"]:checked').val() && typeof(assetDiv.find('[name="' + name + '"]:checked').val()) != 'undefined') {
			console.log("Radio 1 Failure!");
		}
	}			
}

AssetCheck.prototype.checkCheckbox = function (assetDiv, el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input:checkbox').is(':checked');
	
	if(assetDiv.find('[name="' + name + '"]').is(':checked') != value) {
		console.log("Failure!");
	}
}

AssetCheck.prototype.checkText = function (assetDiv, el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input').val();
	
	if(assetDiv.find('[name="' + name + '"]').val() != value) {
		console.log("Failure!");
	}
}

AssetCheck.prototype.checkProduct = function (assetDiv, el) {
	if(el.is(':checked')) {
		var expected = el.parent().children('div').children(':input').val();
		var assetProduct = 	assetDiv.find('#editOrderlineProductSearchText' + getEditAssetID(assetDiv)).val();
		if(expected.toLowerCase() != assetProduct.toLowerCase()) {
			console.log("Product Failure");
		}		
	}
}

AssetCheck.prototype.checkAssetType = function (assetDiv, el) {
	if(el.is(':checked')) {
		var type;
		if(assetDiv.find('[name="spec8"]').length > 0) type = "laptop"; //Webcam
		else if(assetDiv.find('[name="spec19"]').length > 0) type = "tablet"; //Tablet OS
		else if(assetDiv.find('[name="spec4"]').length > 0) type = "desktop"; //Form Factor
		else if(assetDiv.find('[name="spec30"]').length > 0) type = "monitor"; //Brand 
		else if(assetDiv.find('[name="spec13"]').length > 0) type = "hdd"; // HD Type
		else if(assetDiv.find('[name="spec16"]').length > 0) type = "mp3"; //WIFI
		else type = "other";
		
		if(type != el.parent().children('div').children('select').val()) {
			console.log("Type fail");
		}
	}
}

AssetCheck.prototype.checkDarked = function (assetDiv, el, text) {
	if(el.is(':checked')) {
		if(el.parent().children('div').children(':checkbox').is(':checked') ^ $('#scrapText').html() == text) {
			console.log(text+ " Failure");
		}
	}
}

AssetCheck.prototype.checkCPUType = function (assetDiv, el) {
	if(el.is(':checked')) {
		var expected = el.parent().children('div').children(':input').val();
		var assetProduct = 	assetDiv.find('#searchOrderlineSpecText6').val();
		if(expected.toLowerCase() != assetProduct.toLowerCase()) {
			console.log("CPU Type Failure");
		}	
	}
}

AssetCheck.prototype.getSpecialAsset = function (name) {
	return $('.assetCheck :input[name="' + name + '"]').parent().parent().children(':checkbox');
}





/*
Build.prototype.buildOption = function (event) {

}

Build.prototype.buildOption = function (event) {

}

Build.prototype.buildOption = function (event) {

}

Build.prototype.buildOption = function (event) {

}
*/
