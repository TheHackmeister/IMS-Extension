

//This is the base for the form objects. Just has an ID and a function to change the ID of $ objects without trouble.
var InputForm = function (id) {
	this.id = id;
	this.event;
}
//Could I simplify this to simple add and remove the ID?
InputForm.prototype.changeDivs = function() {
	 var elements = [];
	 for (var i = 0; i < arguments.length; i += 2) {
		var arg = arguments[i];
		arg.originalID = arg.attr('id');
		arg.attr('id', arguments[i+1]);
		elements.push(arg);
	 }
	 return elements;
}

InputForm.prototype.restoreDivs = function(elements) {
	elements.forEach(function(el) {
		el.attr('id', el.originalID);
	});
}

InputForm.prototype.generateID = function () {
	var rand = Math.random()*(10000-1000) + 1000;
	rand = Math.floor(rand);
	return rand;
}

InputForm.prototype.generateElement = function (elementId) {
	var element = $('#' + this.id + elementId);
	if(element.length > 0) {
		return element;
	} else {
		var elementDiv = $('#' + this.id + 'Div');
		if(elementDiv.length == 0) { //there is not an element div 
			elementDiv = $('<div/>', {id: this.id + "Div", class: this.id, style: "display:? none; width: 0px; height: 0px; overflow: hidden;?"}).appendTo('#dashboard');
		}
		return $('<div/>', {id: this.id + elementId}).appendTo(elementDiv);
	}
}

InputForm.prototype.generateInput = function (elementId) {
	var element = $('#' + this.id + elementId);
	if(element.length > 0) {
		return element;
	} else {
		var elementDiv = $('#' + this.id + 'Div');
		if(elementDiv.length == 0) { //there is not an element div 
			elementDiv = $('<div/>', {id: this.id + "Div", class: this.id, style: "display:? none; width: 0px; height: 0px; overflow: hidden;?"}).appendTo('#dashboard');
		}
		return $('<input/>', {id: this.id + elementId, type: "text", value: ""}).appendTo(elementDiv);
	}
}

InputForm.prototype.triggerEvent = function (event) {
	this.event.trigger(event);
}

InputForm.prototype.handleError = function (error) {
	alert(error);
}
