
//This gets overrides if the option to not unset asset conditions is set. 
ReturnForm.prototype.processAsset = function (oldID) {	
	debugger;
	var id = this.prepare(oldID);
	this.event.trigger('prepared');
}
