
//These build the basic html. 
AssetCheck.prototype.buildContainer = function (eClass,text,onClick) {
	var element = $('<div/>');
	element.addClass(eClass);

	var checkbox = $('<input type="checkbox"/>')
	checkbox.addClass('container');
	checkbox.on('click', $.proxy(onClick,this));	//Should be here. Gets different onClick functions.
	var container = $('<div/>').css('padding-left', '20px');
	
	element.append(checkbox);
	element.append(text);
	element.append(container);
	
	return element;
}

AssetCheck.prototype.buildRadio = function (specName,specNumber,special,good,bad) {
	var el = $('<div/>');
	good = good || "P";
	bad = bad || "F";
	special = special || false;
	specNumber = specNumber + "Checker";
	var titleCheckbox = $('<input type="checkbox"/>')
	titleCheckbox.addClass("option");
	
	var spec = $('<div/>').hide();
	var yes = $('<input class="inputOption" type="radio" name="' + specNumber + '" value="1"/>');
	var no = $('<input class="inputOption" type="radio" name="' + specNumber + '" value="0"/>');
	var checkbox = $('<input type="checkbox" class="radioCheckbox" name="' + specNumber + '"/>');
	var name = $('<span/>').html(specName);
	if(special) {
		spec.addClass("special");
	}
	
	el.append(titleCheckbox);
	el.append(name);
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
	var name = $('<span/>').html(specName);
	
	if(special) {
		spec.addClass("special");
		textbox.css('direction','rtl');
	}
	
	el.append(titleCheckbox);
	el.append(name);
	spec.append(textbox);	
	el.append(spec);
	return el;
}

AssetCheck.prototype.buildReturn = function () {
	var el = $('<div/>');
	var titleCheckbox = $('<input type="checkbox"/>')
	titleCheckbox.addClass("option");
	var title = $('<span/>').html('Return');
	var spec = $('<div/>').hide();

	var returnBox = $('<input type="text" class="inputOption" name="returnNumber" value=""/>');
	var locationBox = $('<input type="text" class="inputOption" name="returnLocation" value=""/>');
	var returnName = $('<span/>').html('Return Number');
	var locationName = $('<span/>').html('Location');
	spec.addClass("special");
	
	el.append(titleCheckbox);
	el.append(title);
	spec.append(returnName);	
	spec.append(returnBox);	
	spec.append(locationName);	
	spec.append(locationBox);	
	el.append(spec);
	return el;
}


AssetCheck.prototype.buildSearchList = function (specName,specNumber, special) {
	var el = $('<div/>');
	var titleCheckbox = $('<input type="checkbox"/>')
	titleCheckbox.addClass("option");
	special = special || false;
	var spec = $('<div/>').hide();
//Maybe remove class for these?
	var textbox = $('<input type="text" class="searchList" name="' + specNumber + '" value=""/>');
	var hidden = $('<input type="hidden" class="inputOption" name="' + specNumber + 'Hidden" value=""/>');
	var results = $('<div class="results" name="' + specNumber + 'Results" />');
	var name = $('<span/>').html(specName);
	
	if(special) {
		spec.addClass("special");
		textbox.css('direction','rtl');
	}
	
	el.append(titleCheckbox);
	el.append(name);	
	spec.append(hidden);	
	spec.append(textbox);	
	spec.append(results);	
	el.append(spec);
	
	return el;
}


AssetCheck.prototype.buildCheckBox = function (specName,specNumber, special, text) {
	var el = $('<div/>');
	text = text || "Checked";
	var titleCheckbox = $('<input type="checkbox"/>')
	titleCheckbox.addClass("option");
	special = special || false;
	var spec = $('<div/>').hide();
	var checkbox = $('<input type="checkbox" class="inputOption" name="' + specNumber + '" />');
	spec.prepend(text + ":");
	var name = $('<span/>').html(specName);	
		
	if(special) {
		spec.addClass("special");
	}
	el.append(titleCheckbox);
	el.append(name);
	spec.append(checkbox);	
	el.append(spec);
	return el;
}

AssetCheck.prototype.buildSimple = function (specName,specNumber, special, text) {
	var el = $('<div/>');
	text = text || "Checked";
	var titleCheckbox = $('<input type="checkbox"/>')
	var checkbox = $('<input type="checkbox" style="visibility:hidden;" class="inputOption" name="' + specNumber + '" />');
	titleCheckbox.addClass("option");
	special = special || false;
	var spec = $('<div/>').hide();
	spec.prepend(text);
	var name = $('<span/>').html(specName);	
		
	if(special) {
		spec.addClass("special");
	}
	el.append(titleCheckbox);
	el.append(name);
	spec.append(checkbox);	
	el.append(spec);
	return el;
}

AssetCheck.prototype.buildOption = function (specName,buildFunction, special) {
	var el = $('<div/>');
	var titleCheckbox = $('<input type="checkbox"/>')
	titleCheckbox.addClass("option");
	var spec = $('<div/>').hide();
	var name = $('<span/>').html(specName);
	
	special = special || false;
	if(special) {
		spec.addClass("special");
	}
	
	el.append(titleCheckbox);
	el.append(name);
	spec.append(buildFunction());	
	el.append(spec);
	return el;
}

//These compile the basic html units into usable html. 
AssetCheck.prototype.buildCheckList = function (event) {
	var container = $(event.target).parent().children('div');
	if(!$(event.target).is(':checked')) {
		container.html('');
		return;
	}
	var scrap = this.buildCheckBox('Scrapped','Scrap', 'special');
	var shipped = this.buildCheckBox('Shipped','Shipped', 'special');
	var type = this.buildOption('Type',this.buildOptionType, 'special');

	container.append(type);
	container.append(scrap); 
	container.append(shipped); 
	var specs = this.buildContainer('checkSpecs','Specs', this.buildSpecs);
	var tests = this.buildContainer('checkTests','Tests', this.buildTests);
	container.append(specs);
	container.append(tests);
	container.append(this.buildOption('CPU Gen',this.buildOptionCPUGen, 'special'));
	container.append(this.buildOption('CPU Brand',this.buildOptionCPUBrand, 'special'));
	container.append(this.buildOption('Condition',this.buildOptionCondition, 'special'));
	container.append(this.buildCheckBox('Prod Generic','productNotGeneric', 'special', 'Is'));
	container.append(this.buildSimple('Misc + Notes','productMiscWithNotes', 'special', 'Requires Notes'));
	
	type.children(':input:checkbox').click();
	scrap.children(':input:checkbox').click();
	shipped.children(':input:checkbox').click();
}


//These compile the basic html units into usable html. 
AssetCheck.prototype.buildSimpleCheckList = function (event) {
	var buildVar = event.target.value;	
	if (buildVar == "product") this.buildSimpleProduct($(event.target));
/*	var container = $(event.target).parent().children('div');
	if(!$(event.target).is(':checked')) {
		container.html('');
		return;
	}
	var scrap = this.buildCheckBox('Scrapped','Scrap', 'special');
	var shipped = this.buildCheckBox('Shipped','Shipped', 'special');
	var type = this.buildOption('Type',this.buildOptionType, 'special');

	container.append(type);
	container.append(scrap); 
	container.append(shipped); 
	var specs = this.buildContainer('checkSpecs','Specs', this.buildSpecs);
	var tests = this.buildContainer('checkTests','Tests', this.buildTests);
	container.append(specs);
	container.append(tests);
	container.append(this.buildOption('CPU Gen',this.buildOptionCPUGen, 'special'));
	container.append(this.buildOption('CPU Brand',this.buildOptionCPUBrand, 'special'));
	container.append(this.buildOption('Condition',this.buildOptionCondition, 'special'));
	container.append(this.buildCheckBox('Prod Generic','productNotGeneric', 'special', 'Is'));
	container.append(this.buildSimple('Misc + Notes','productMiscWithNotes', 'special', 'Requires Notes'));
	
	type.children(':input:checkbox').click();
	scrap.children(':input:checkbox').click();
	shipped.children(':input:checkbox').click();
*/

}



AssetCheck.prototype.buildSetList = function () {
	var container = $(event.target).parent().children('div');
	if(!$(event.target).is(':checked')) {
		container.html('');
		return;
	}
	container.append(this.buildContainer('setSpecs','Specs', this.buildSpecs));
	container.append(this.buildContainer('setTests','Tests', this.buildTests));
	container.append(this.buildCheckBox("Scrap","editOrderlineScrapped", 'special'));
	container.append(this.buildTextBox('Location','Location', 'special'));
	container.append(this.buildReturn());
	container.append(this.buildTextBox('Sales Order','salesOrder', 'special'));
}

AssetCheck.prototype.buildOptions = function () {
	var container = $(event.target).parent().children('div');
	if(!$(event.target).is(':checked')) {
		container.html('');
		return;
	}
	
	container.append(this.buildSimple('Auto stop on error','stopOnError', 'special', 'No popup'));
	container.append(this.buildSimple('Print Asset Tag','printTag', 'special', 'Printing Tags'));
	container.append(this.buildOption('Select After Load',this.buildOptionSelect, 'special'));
		
	//Print sticker.
	//AutoFocus - Default to SelectAsset. Could be append to notes or Ebay auction number
}


AssetCheck.prototype.buildSpecs = function (event) {
	var container = $(event.target).parent().children('div');
	if(!$(event.target).is(':checked')) {
		container.html('');
		return;
	}
	
	container.append(this.buildSearchList('Product','Product', 'special'));
	container.append(this.buildSearchList("CPU Type","spec6", 'special'));
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
	container.append(this.buildRadio('PASS POST','test16'));	
	container.append(this.buildRadio('LCD TEST','test13'));
	container.append(this.buildRadio('LV TEST','test14'));
	container.append(this.buildRadio('MEMTEST','test1'));
	container.append(this.buildRadio('CNTRACT WK','test3'));
	container.append(this.buildRadio('MB 2ND','test4'));
	container.append(this.buildRadio('REFURB','test5'));
	container.append(this.buildRadio('REFURB 2ND','test6'));
	container.append(this.buildRadio('REFURB 3RD','test7'));
	container.append(this.buildRadio('FW RESET','test8'));
	container.append(this.buildRadio('OS TEST','test9'));
	container.append(this.buildRadio('HD E-WIPE','test10'));
	container.append(this.buildRadio('HD Q-WIPE','test15'));
	
}

//These build dropdown menus.
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

AssetCheck.prototype.buildOptionCPUGen = function () {
	return $('<select class="inputOption" name="cpuGen"> \
				<option value="null"></option> \
				<option value="Pre Pentium 3">Pre P3</option> \
				<option value="Pentium 3">P3</option> \
				<option value="Pentium 4">P4</option> \
				<option value="Pentium M">PM</option> \
				<option value="Dual Core">Dual Core</option> \
				<option value="I Series">I Series</option> \
				<option value="Green Planet">Green Planet</option> \
				<option value="Other">Other</option> \
			</select>');
}

AssetCheck.prototype.buildOptionCPUBrand = function () {
	return $('<select class="inputOption" name="cpuBrand"> \
				<option value="null"></option> \
				<option value="Intel">Intel</option> \
				<option value="AMD">AMD</option> \
				<option value="Other">Other</option> \
			</select>');
}

AssetCheck.prototype.buildOptionCondition = function () {
	return $('<select class="inputOption" name="checkCondition"> \
				<option value="null"></option> \
				<option value="Good">Good</option> \
				<option value="Good Base">Good Base</option> \
				<option value="Broken">Broken</option> \
				<option value="Damaged">Damaged</option> \
				<option value="Low Grade">Low Grade</option> \
			</select>');
}

AssetCheck.prototype.buildOptionSelect = function () {
	return $('<select class="inputOption" name="selectField"> \
				<option value="Asset ID">Asset ID</option> \
				<option value="End of Notes">End of Notes</option> \
				<option value="eBay Auction Number">Auction Number</option> \
			</select>');
}

AssetCheck.prototype.buildOptionCheckType = function () {
	return $('<span>Check Type</span> \
			<select class="inputOption" name="CheckType"> \
				<option value="null"></option> \
				<option value="Product">Product</option> \
				<option value="DC">Not Working</option> \
				<option value="IS">Not Working</option> \
				<option value="Advanced">Advanced</option> \
			</select>');
}
