TriggerDialogManager = function(mud){
	this.mud = mud;
	this.engine = mud.triggerEngine;
	this.triggerList = $("#trigger-list");
	this.patternField = null;
	this.triggerTypeField = null;
	this.dialog = null;
	this.editor = null;
	this.currentTriggerId = -1;
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
	this.currentTriggerId = -1;
};

TriggerDialogManager.prototype.bindEvents = function() {
	var self = this;
	this.triggerList.change(function() {
		self.saveCurrentTrigger();

		// Re-enable all the disabled controls:
		self.editor.setReadOnly(false);
		$("#deleteTrigger").removeAttr("disabled");
		self.patternField.removeAttr("disabled");
		self.triggerTypeField.removeAttr("disabled");

		var id = self.triggerList.find("option:selected").attr("value");
		self.currentTriggerId = id;
		var trig = self.engine.triggers[id];
		self.patternField.val(trig.pattern);
		self.triggerTypeField.val(trig.triggerType);
		self.editor.setValue(trig.body);
		self.editor.moveCursorTo(0,0);
		self.patternField.focus();
	});

	$("#addTrigger").click(function() {self.newTrigger();});
	$("#deleteTrigger").click(function() {self.deleteTrigger();});
	this.patternField.keyup(function() {self.refreshCurrentTriggerPattern();});
}

TriggerDialogManager.prototype.initEditor = function() {
	this.editor = ace.edit("actions-editor");
	this.editor.setTheme("ace/theme/chrome");
	this.editor.getSession().setMode("ace/mode/javascript");
}

TriggerDialogManager.prototype.init = function(dialog) {
	this.dialog = dialog;
	this.patternField = this.dialog.find("input[name='pattern']");
	this.triggerTypeField = this.dialog.find("[name='trigger-type']");
	this.initEditor();
	this.resize();
	this.loadTriggers();
	this.bindEvents();
	this.deselect();
};

TriggerDialogManager.prototype.resize = function() {
	this.triggerList.height(this.triggerList.parent().height() - $("#trigger-actions-toolbar").height() - 1)

	var parentHeight = this.triggerList.parent().height();
	var patternHeight = $("#pattern-fields").height();
	var otherFieldsHeight = $("#other-fields").height();
	var newHeight = parentHeight - patternHeight - otherFieldsHeight - 17;
	$("#actions-editor").height(newHeight);

	this.editor.resize();
};

TriggerDialogManager.prototype.newTrigger = function() {
	var newTrig = new Trigger();
	newTrig.engine = this.engine;
	this.engine.triggers.push(newTrig);
	this.engine.save();
	this.loadTriggers();
	this.triggerList.find("option:last").attr("selected", "selected");
	this.triggerList.change()
};

TriggerDialogManager.prototype.saveCurrentTrigger = function() {
	if (this.currentTriggerId < 0)
		// No trigger selected:
		return;

	// Create the new trigger:
	var newTrig = new Trigger();
	newTrig.pattern = this.patternField.val();
	newTrig.body = this.editor.getValue();
	newTrig.triggerType = this.triggerTypeField.val();
	newTrig.engine = this.engine;

	// Update/add the existing trigger:
	this.engine.triggers[this.currentTriggerId] = newTrig;
	this.engine.save();

	this.refreshCurrentTriggerPattern();
};

TriggerDialogManager.prototype.refreshCurrentTriggerPattern = function() {
	var currentTrigger = this.engine.triggers[this.currentTriggerId];
	this.triggerList.find("option").eq(this.currentTriggerId).text(this.patternField.val());
};

TriggerDialogManager.prototype.deleteTrigger = function() {
	if (this.currentTriggerId < 0)
		return;

	var ok = confirm("Do you really want to delete this trigger?");
	if (ok)
	{
		this.engine.triggers.splice(this.currentTriggerId, 1);
		this.engine.save();
		this.loadTriggers();
		this.deselect();
	}
};

TriggerDialogManager.prototype.deselect = function() {
	this.triggerList.val(-1);
	this.currentTriggerId = -1;
	this.patternField.val("");
	this.editor.setValue("");
	$("#deleteTrigger").attr("disabled", "disabled");
	this.patternField.attr("disabled", "disabled");
	this.triggerTypeField.attr("disabled", "disabled");

	this.editor.setReadOnly(true);
}