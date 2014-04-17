/*
The order of this file goes like this:
Event functions
Builds for basic html
Builds for useful html
Builds for dropdowns
Checker function
Basic checker functions
*/

var AssetCheck = function (id,controlDiv,soundObj) {
	this.id = id || this.generateID();	
	AssetController.apply(this,arguments);
	this.controlDiv = controlDiv || $('#' + this.id + 'ControlDiv');
	this.sound = soundObj || beep;
		
	this.controlDiv.on('click', '.option', this.toggleVisible);
	this.controlDiv.on('click', '.radioCheckbox', this.unsetRadio);
	
	this.event.on("loaded", $.proxy(this.stripSaveOnClick,this));
	this.editAssetDiv.on('click', '[value="save"]' ,function () {saveAsset(getEditAssetID());this.select();});
}
try {
	AssetCheck.prototype = Object.create(AssetController.prototype);
} catch (err) { location.reload(); }

//For events.
AssetCheck.prototype.toggleVisible = function (event) {
	$(event.target).parent().children('div').toggle();
}

AssetCheck.prototype.unsetRadio = function (event) {
	if($(event.target).is(':checked')) {
		$(event.target).parent().children('input[type="radio"]:checked').prop('checked', false);
	}
}

AssetCheck.prototype.select = function () {
	this.asset.select();
}

AssetCheck.prototype.stripSaveOnClick = function () {
	this.editAssetDiv.find('[value=save]').attr('onclick','');
}

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
	
	container.append(this.buildTextBox('Product','Product', 'special'));
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

AssetCheck.prototype.buildSetList = function () {
	var container = $(event.target).parent().children('div');
	if(!$(event.target).is(':checked')) {
		container.html('');
		return;
	}
	
//	container.append(this.buildTextBox('Product','Product'));
//	container.append(this.buildContainer('checkSpecs','Specs', this.buildSpecs));
//	container.append(this.buildContainer('checkTests','Tests', this.buildTests));
	container.append(this.buildTextBox('Location','Location'));
//	container.append(this.buildTextBox('Sales Order','Sales Order'));
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

//These handle the checking
AssetCheck.prototype.checkAsset = function () {
	this.error = false;
	this.checkProduct(this.checkSpecialAsset('Product'));
	this.checkAssetType(this.checkSpecialAsset('Type'));
	this.checkDarked(this.checkSpecialAsset('Scrap'), "SCRAPPED!");
	this.checkDarked(this.checkSpecialAsset('Shipped'), "SHIPPED!");
	this.checkCPUType(this.checkSpecialAsset('spec6'));
	
	
	//Checks each checked option.
	$('.assetCheck .option:checked').parent().children('div').each($.proxy(function(i,el) {
		el = $(el);
		if(el.hasClass('special')) {
			return; //$.each version of continue. 
		}		
		//Radio Option
		if(el.children(':input').length == 3) {
			this.checkRadio(el);
		//Checkbox Option
		} else if(el.children(':input:checkbox').length == 1) {
			this.checkCheckbox(el);
		//Text Field
		} else {
			this.checkText(el);
		}
	}, this));
	
	this.checkCPUGeneration(this.checkSpecialAsset('cpuGen'));
	this.checkCPUBrand(this.checkSpecialAsset('cpuBrand'));
	this.checkCondition(this.checkSpecialAsset('checkCondition'));
	this.checkProductIsNotGeneric(this.checkSpecialAsset('productNotGeneric'));
	this.checkProductAndNotes(this.checkSpecialAsset('productMiscWithNotes'));
	
	this.errorCheck('checked')
}

//This will probably be overwritten in the multi asset version. 
AssetCheck.prototype.checkFailed = function (string) {
	this.possibleError = true;
	this.sound.play(500, "Bad");
	setTimeout($.proxy(function () {this.checkAlert(string);},this), 500);
}

AssetCheck.prototype.checkAlert = function (string) {
	var stop = confirm(string + '\nStop?');
	if(stop == true) {
		this.error = true; //This stops something from being transfered.
		this.possibleError = false;
	} else {
		this.error = false;
		this.possibleError = false;
		this.event.trigger('gotErrorResult');
	}	
}

AssetCheck.prototype.errorCheck = function (event) {
	if(this.error) {
		return;
	} else if(this.possibleError) {
		this.event.one('gotErrorResult',$.proxy(function () {this.errorCheck(event);},this));
	} else {
		this.event.trigger(event);
	}
}

AssetCheck.prototype.checkSpecialAsset = function (name) {
	return $('.assetCheck :input[name="' + name + '"]').parent().parent().children(':checkbox');
}

AssetCheck.prototype.checkRadio = function(el) {
	var isChecked = el.children(':input:checkbox').is(':checked');
	var val = el.children(':input:radio:checked').val() || 'undefined';
	var name = el.children(':input:radio').prop('name').replace('Checker','');
	//If the unset option is not enabled. 
	if(isChecked == false) {
		if(val != this.editAssetDiv.find('[name="' + name + '"]:checked').val()) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	} else {
		//If the val is different, and but not unset.
		if(val !=  this.editAssetDiv.find('[name="' + name + '"]:checked').val() && typeof(this.editAssetDiv.find('[name="' + name + '"]:checked').val()) != 'undefined') {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}			
	return true;
}

AssetCheck.prototype.checkCheckbox = function (el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input:checkbox').is(':checked');
	
	if(this.editAssetDiv.find('[name="' + name + '"]').is(':checked') != value) {
		this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
		return false;
	}
	return true;
}

AssetCheck.prototype.checkText = function (el) {
	var name = 	el.children(':input').prop('name');
	var value = el.children(':input').val();
	
	if(this.editAssetDiv.find('[name="' + name + '"]').val() != value) {
		this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
		return false;
	}
	return true;
}

AssetCheck.prototype.checkProduct = function (el) {
	if(el.is(':checked')) {
		var expected = el.parent().children('div').children(':input').val();
		var assetProduct = 	this.editAssetDiv.find('#editOrderlineProductSearchText' + getEditAssetID(this.editAssetDiv)).val();
		if(expected.toLowerCase() != assetProduct.toLowerCase()) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkAssetType = function (el) {
	if(el.is(':checked')) {
		var type;
		if(this.editAssetDiv.find('[name="spec8"]').length > 0) type = "laptop"; //Webcam
		else if(this.editAssetDiv.find('[name="spec19"]').length > 0) type = "tablet"; //Tablet OS
		else if(this.editAssetDiv.find('[name="spec4"]').length > 0) type = "desktop"; //Form Factor
		else if(this.editAssetDiv.find('[name="spec30"]').length > 0) type = "monitor"; //Brand 
		else if(this.editAssetDiv.find('[name="spec13"]').length > 0) type = "hdd"; // HD Type
		else if(this.editAssetDiv.find('[name="spec16"]').length > 0) type = "mp3"; //WIFI
		else type = "other";
		
		if(type != el.parent().children('div').children('select').val()) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkDarked = function (el, text) {
	if(el.is(':checked')) {
		if(el.parent().children('div').children(':checkbox').is(':checked') ^ $('#scrapText').html() == text) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkCPUType = function (el) {
	if(el.is(':checked')) {
		var expected = el.parent().children('div').children(':input').val();
		var assetProduct = 	this.editAssetDiv.find('#searchOrderlineSpecText6').val();
		if(expected.toLowerCase() != assetProduct.toLowerCase()) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}	
	}
	return true;
}

//These are checks for boxing laptops.


AssetCheck.prototype.checkProductIsNotGeneric = function (el) {
	if(el.is(':checked')) {
		var assetProduct = 	this.editAssetDiv.find('#editOrderlineProductSearchText' + getEditAssetID(this.editAssetDiv)).val();
		if(el.parent().children('div').children(':checkbox').is(':checked') ^ assetProduct.indexOf("GENERIC") != -1) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkProductAndNotes = function (el) {
	if(el.is(':checked')) {
		var assetProduct = 	this.editAssetDiv.find('#editOrderlineProductSearchText' + getEditAssetID(this.editAssetDiv)).val();
		if(assetProduct.indexOf("MISC") != -1) {
			//If there is nothing in the notes
			if(this.editAssetDiv.find('[name="spec15"]').val() == "") {
				this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
				return false;
			}
		}
	}
	return true;
}

AssetCheck.prototype.checkCondition = function (el) {
	if(el.is(':checked')) {
		var cond = el.parent().children('div').children('select').val();
		var err = false;
		
		//If we only have one condition to check. 
		if(this.editAssetDiv.find('input:radio[name="test2"]').length > 0) {
			cond += "1";
		} else {
			cond += "3";
		}
		
		//In the case of this switch, eq(0) is fail, and eq(1) is pass. 
		switch(cond) {
			case "Good1":
				if(this.editAssetDiv.find('input:radio[name="test2"]').eq(1).prop('checked')) err = true;
			break;
			
			case "Good3":
				if(this.editAssetDiv.find('input:radio[name="test16"]').eq(1).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test13"]').eq(1).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test14"]').eq(1).prop('checked')) err = true;
			break;
			
			case "Good Base3":
				if(this.editAssetDiv.find('input:radio[name="test16"]').eq(1).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test13"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test14"]').eq(1).prop('checked')) err = true;
			break;
			
			case "Broken1":
				if(this.editAssetDiv.find('input:radio[name="test2"]').eq(0).prop('checked')) err = true;
			break;
			
			case "Broken3":
				if(this.editAssetDiv.find('input:radio[name="test16"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test13"]').eq(1).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test14"]').eq(1).prop('checked')) err = true;
			break;
			
			case "Damaged3":
				if(this.editAssetDiv.find('input:radio[name="test16"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test13"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test14"]').eq(1).prop('checked')) err = true;
			break;
			
			case "Low Grade3":
				if(this.editAssetDiv.find('input:radio[name="test16"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test13"]').eq(0).prop('checked')) err = true;
				if(this.editAssetDiv.find('input:radio[name="test14"]').eq(0).prop('checked')) err = true;
			break;
			
			default:
				err = true;
			break;
			
		}
		if(err) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkCPUBrand = function (el) {
	if(el.is(':checked')) {
		var expectedCPUBrand = el.parent().children('div').children('select').val();
		var cpu = this.getCPUByName(this.editAssetDiv.find('[name="searchOrderlineSpecText6"]').val());
		if(cpu[3] != expectedCPUBrand) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.checkCPUGeneration = function (el) {
	if(el.is(':checked')) {
		var expectedCPUGen = el.parent().children('div').children('select').val();
		var cpu = this.getCPUByName(this.editAssetDiv.find('[name="searchOrderlineSpecText6"]').val());
		if(cpu[2] != expectedCPUGen) {
			this.checkFailed("The " + el.parent().children('span').html().toLowerCase() + ' check did not match.');
			return false;
		}
	}
	return true;
}

AssetCheck.prototype.getCPUByName = function (cpuName) {
	var result;
	this.cpuArray.forEach(function (el) {
		if(el[1] == cpuName) result = el;
	});
	if(!result) result = ["","", "Could't find"];
	
	return result;
}

AssetCheck.prototype.cpuArray = [["71", "AMD ATHLON 4", "Pentium 3", "AMD"],
["77", "AMD ATHLON 64", "Pentium 4", "AMD"],
["220", "AMD ATHLON 64 (TF-20)", "Green Planet", "AMD"],
["86", "AMD ATHLON 64 X2", "Dual Core", "AMD"],
["153", "AMD ATHLON II X2", "Dual Core", "AMD"],
["157", "AMD ATHLON II X3", "Quad Core", "AMD"],
["154", "AMD ATHLON II X4", "Quad Core", "AMD"],
["212", "AMD ATHLON NEO", "Pentium M", "AMD"],
["69", "AMD ATHLON XP", "Pentium 3", "AMD"],
["70", "AMD ATHLON XP-M", "Pentium 3", "AMD"],
["208", "AMD C-50", "Dual Core", "AMD"],
["224", "AMD C-60", "Dual Core", "AMD"],
["66", "AMD DURON", "Pre Pentium 3", "AMD"],
["225", "AMD FUSION", "Dual Core", "AMD"],
["68", "AMD K6", "Pre Pentium 3", "AMD"],
["91", "AMD PHENOM II", "Dual Core", "AMD"],
["155", "AMD PHENOM X3", "Quad Core", "AMD"],
["152", "AMD PHENOM X4", "Quad Core", "AMD"],
["110", "AMD SEMPRON (DUAL CORE ERA)", "Green Planet", "AMD"],
["109", "AMD SEMPRON (P4 ERA)", "Pentium 4", "AMD"],
["214", "AMD SEMPRON (PENTIUM M ERA)", "Pentium M", "AMD"],
["78", "AMD TURION 64", "Pentium M", "AMD"],
["87", "AMD TURION 64 X2", "Dual Core", "AMD"],
["89", "AMD TURION II", "Dual Core", "AMD"],
["223", "AMD TURION NEO", "Dual Core", "AMD"],
["211", "AMD V120", "Green Planet", "AMD"],
["213", "AMD V140", "Green Planet", "AMD"],
["217", "AMD VISION A10", "Quad Core", "AMD"],
["57", "AMD VISION A4", "Dual Core", "AMD"],
["58", "AMD VISION A6", "Dual Core", "AMD"],
["59", "AMD VISION A8", "Quad Core", "AMD"],
["56", "AMD VISION E SERIES", "Green Planet", "AMD"],
["139", "EXYNOS 5 DUAL", "Other", "Other"],
["82", "INTEL ATOM", "Pentium M", "Intel"],
["97", "INTEL CELERON (PENTIUM 4 ERA)", "Pentium 4", "Intel"],
["96", "INTEL CELERON (PENTIUM III ERA)", "Pentium 3", "Intel"],
["98", "INTEL CELERON (POST PENTIUM M)", "Green Planet", "Intel"],
["151", "INTEL CELERON D", "Pentium M", "Intel"],
["76", "INTEL CELERON M", "Pentium M", "Intel"],
["84", "INTEL CORE 2 DUO", "Dual Core", "Intel"],
["85", "INTEL CORE 2 EXTREME", "Quad Core", "Intel"],
["93", "INTEL CORE 2 QUAD", "Quad Core", "Intel"],
["92", "INTEL CORE 2 SOLO", "Green Planet", "Intel"],
["83", "INTEL CORE DUO", "Dual Core", "Intel"],
["60", "INTEL CORE I3", "I Series", "Intel"],
["61", "INTEL CORE I5", "I Series", "Intel"],
["62", "INTEL CORE I7", "I Series", "Intel"],
["80", "INTEL CORE SOLO", "Pentium M", "Intel"],
["94", "INTEL PENTIUM (ORIGINAL)", "Pre Pentium 3", "Intel"],
["99", "INTEL PENTIUM (POST PENTIUM M)", "Dual Core", "Intel"],
["74", "INTEL PENTIUM 4", "Pentium 4", "Intel"],
["150", "INTEL PENTIUM D", "Pentium M", "Intel"],
["90", "INTEL PENTIUM DUAL-CORE", "Dual Core", "Intel"],
["64", "INTEL PENTIUM II", "Pre Pentium 3", "Intel"],
["63", "INTEL PENTIUM III", "Pentium 3", "Intel"],
["75", "INTEL PENTIUM M", "Pentium M", "Intel"],
["65", "INTEL PENTIUM MMX", "Pre Pentium 3", "Intel"],
["226", "INTEL PRE-PENTIUM", "Pre Pentium 3", "Intel"],
["158", "INTEL XEON", "Green Planet", "Intel"],
["140", "POWERPC G3", "Other", "Other"],
["141", "POWERPC G4", "Other", "Other"],
["142", "POWERPC G5", "Other", "Other"],
["72", "TRANSMETA CRUSOE", "Other", "Other"],
["73", "VIA C3", "Pre Pentium 3", "Other"],
["67", "VIA C7", "Pre Pentium 3", "Other"]];