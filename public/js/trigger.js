Trigger = function() {
	this.pattern = "";
	this.body = "";
	this.triggerType = TriggerTypeEnum.FROM_MUD;
	this.engine = null;
};

Trigger.prototype.match = function(text) {
	var reg = new RegExp(this.pattern);
	if (reg.test(text))
	{
		// Let's create a sandbox:
		// Variables visible inside the sandbox:
		var _commands = new CommandEngine(this.engine);
		(function(myScope, self, arg) {
		    with (myScope) {
		        eval(self.body);
		    }
		})(_commands, this, reg.exec(text));
		return true;
	}
	return false;
};


TriggerTypeEnum = {
	FROM_COMMAND_LINE: 0,
	FROM_MUD: 1
};