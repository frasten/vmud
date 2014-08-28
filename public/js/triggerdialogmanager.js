TriggerDialogManager = function(mud, dialog){
	this.mud = mud;
	this.engine = mud.triggerEngine;
	this.triggerList = $("#trigger-list");
	this.dialog = dialog;
	this.editor = null;
};

TriggerDialogManager.prototype.loadTriggers = function() {
	var self = this;
	this.triggerList.empty();
	$.each(this.engine.triggers, function(key, value) {
		self.triggerList
			.append($("<option></option>")
			.attr("value", key)
			.text(value.pattern));
	});
};

TriggerDialogManager.prototype.bindEvents = function() {
	var self = this;
	this.triggerList.change(function() {
		var id = self.triggerList.find("option:selected").attr("value");
		var trig = self.engine.triggers[id];
		self.dialog.find("input[name='pattern']").val(trig.pattern);
		self.editor.setValue(trig.body);
		self.editor.moveCursorTo(0,0);
	});
}

TriggerDialogManager.prototype.initEditor = function() {
	this.editor = ace.edit("actions-editor");
	this.editor.setTheme("ace/theme/chrome");
	this.editor.getSession().setMode("ace/mode/javascript");
}

TriggerDialogManager.prototype.init = function() {
	this.initEditor();
	this.loadTriggers();
	this.bindEvents();
};