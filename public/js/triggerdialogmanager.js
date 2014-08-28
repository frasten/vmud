TriggerDialogManager = function(mud){
	this.mud = mud;
	this.engine = mud.triggerEngine;
	this.triggerList = $("#trigger-list");
	this.patternField = null;
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
};

TriggerDialogManager.prototype.bindEvents = function() {
	var self = this;
	this.triggerList.change(function() {
		self.saveCurrentTrigger();

		var id = self.triggerList.find("option:selected").attr("value");
		self.currentTriggerId = id;
		var trig = self.engine.triggers[id];
		self.patternField.val(trig.pattern);
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
	this.initEditor();
	this.resize();
	this.loadTriggers();
	this.bindEvents();
};

TriggerDialogManager.prototype.resize = function() {
	this.triggerList.height(this.triggerList.parent().height() - $("#trigger-actions-toolbar").height())

	var parentHeight = this.triggerList.parent().height();
	var patternHeight = $("#pattern-fields").height();
	var newHeight = parentHeight - patternHeight - 16;
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
	newTrig.triggerType = TriggerTypeEnum.FROM_COMMAND_LINE; // TODO TEMP!!!
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
	// NOOP
};