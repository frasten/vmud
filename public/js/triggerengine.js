TriggerEngine = function(screen, socket)
{
	this.screen = screen;
	this.socket = socket;
};

TriggerEngine.prototype.parseInput = function(command)
{
	// Try to split eventual multiple commands if separated by ";"
	// (but we don't want to mess up the smileys ;)
	var singleCommands = command.split(/;(?![-()='])/g);
	if (singleCommands.length > 1)
	{
		for (var i = 0; i < singleCommands.length; i++) {
			var newCom = singleCommands[i].trim();
			this.parseInput(newCom);
		}
		return;
	}

	// Speedwalk (.nes2ud):
	if(command.charAt(0) == '.' && !/[^nwsedu0-9]+/.test(command.substring(1))){
		this.parseSpeedWalkPath(command.substring(1));
	} else {
		this.sendRawCommand(command);
	}

};

TriggerEngine.prototype.sendRawCommand = function(command) {
	this.screen.appendCmd(command);
	this.socket.emit('web input', command);
};

/**
	Tries to parse a string composed of directions.
	For example: "neswud" is expanded to the following commands:
	n;e;s;w;u;d.

	You can try to repeat a direction by putting a number of times
	in front of the direction.
	For example: .2e is expanded to: e;e
*/
TriggerEngine.prototype.parseSpeedWalkPath = function(path) {
	var times = 1;
	for(var i = 0 ; i < path.length ; i++) {
		var chr = path.charAt(i);
		var intChr = parseInt(chr);
		if (!isNaN(intChr))
		{
			// I was asked to repeat n times a direction:
			times = intChr;
			continue;
		}
		for (var j = 0; j < times; j++) {
			this.sendRawCommand(chr);
		};
		times = 1; // Reset the counter
	}
};