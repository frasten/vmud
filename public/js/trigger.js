Trigger = function(obj) {
	this.pattern = "";
	this.body = "";
	this.triggerType = TriggerTypeEnum.FROM_MUD;
	this.engine = null;

	// If an object was passed then initialise properties from that object:
    for (var prop in obj) this[prop] = obj[prop];
};

Trigger.prototype.match = function(text) {
	var reg = new RegExp(this.pattern);
	if (reg.test(text))
	{
		console.debug("New trigger match: " + this.pattern + " with text: " + text);
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