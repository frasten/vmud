vMud = function(url, socket, cmd, screen, menu){
	this.connected = false;
	this.url = url;
	this.socket = socket;
	this.cmd = cmd;
	this.screen = screen;
	this.menu = new Menu(menu);
	this.triggerEngine = null;

	this._initHandlers();
	this._initCommandline();
	this._initWebSocket();
	this.socket.emit('setUserInfo',{});
};


vMud.prototype._initHandlers = function(){
	$('*')
		.keydown(function(e){
			e.stopPropagation();
			switch(e.which){
				case 8:
					if(!$("*:focus").is('input')){
						e.preventDefault();
					}
					break;

				default:
			}
		});
};

vMud.prototype._initCommandline = function(){
	var self = this;
	this.triggerEngine = new TriggerEngine(self.screen, self.socket);

	this.cmd
		.focus()
		.commandLine({
			socket: self.socket,
			screen: self.screen,
			triggerEngine: self.triggerEngine
		});
};

vMud.prototype._initWebSocket = function(){
	var self = this;
	this
		.socket
		.on('socket output', function(data){
			self.dataReceived(data.data);
		})
		.on('system output', function(data){
			self.systemMsg(data.data);
		})
		.on('remote closed', function(){
			self.connected = false;
			self.systemMsg('#Disconnected');
		})
};

vMud.prototype.dataReceived = function(text){
	text = this.normaliseInput(text);

	var lines = text.split("<br />");
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		var cleanedText = this.cleanText(line);
		this.writeToScreen(line + "<br />");
		this.triggerEngine.runAllTriggers(cleanedText, TriggerTypeEnum.FROM_MUD);
	};
};

vMud.prototype.writeToScreen = function(text){
	this.screen
		.html(this.screen.html() + text)
		.scrollTop(this.screen[0].scrollHeight);;
}

vMud.prototype.normaliseInput = function(text){
	if(typeof text == 'string' && text.indexOf(String.fromCharCode(65533)) !== false){
		var tmp 		= '',
			strip_char 	= [65533, 1, 0];
		for(var i = 0 ; i < text.length ; i++){
			if($.inArray(text.charCodeAt(i), strip_char) < 0){
				tmp += text.charAt(i);
			}
		}
		text = tmp;

		if(/^Password:/.test(text)){
			this.cmd.val('').attr('type', 'password').focus();
		}
	}
	return text;
};

vMud.prototype.cleanText = function(text) {
	return $("<div>" + text + "</div>").text();
}

vMud.prototype.systemMsg = function(txt){
	var cmd  = $('<span/>')
			.addClass('system-message')
			.text('#' + txt)
		;

	this.writeToScreen(cmd.html());
};

vMud.prototype.connect = function(data){
	if(!this.connected){
		this.socket.emit('connectTo', data);
		this.connected = true;
		this.cmd.focus();
	} else {
		this.screen.systemMsg('Already connected');
	}
};

vMud.prototype.disconnect = function(){
	this.socket.emit('close remote connection');
};