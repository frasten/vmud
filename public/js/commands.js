CommandEngine = function(engine) {
	this.triggerEngine = engine;
};

/**
	Sends some text to the MUD as is.
	Usage: send("kill seneca");
*/
CommandEngine.prototype.send = function(text) {
	this.triggerEngine.sendRawCommand(text);
}

/**
	Echoes some text locally inside the client window.
	Usage: echo("Hello world.");
*/
CommandEngine.prototype.echo = function(text) {
	this.triggerEngine.screen.appendCmd(text);
}