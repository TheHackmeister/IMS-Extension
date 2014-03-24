
//This gets overrides if the option to not unset asset conditions is set. 
ReturnForm.prototype.processAsset = function (oldID) {	
debugger;
	debugger;
	var id = this.prepare(oldID);
	this.asset.asset.val(id);
	this.event.trigger('prepared');
}
