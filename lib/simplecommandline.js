'use strict';

let simpleCommandline = {
	"filename": '',
	"projectPath": '',
	"globalCommandPath": '',
	"projectCommandPath": '',
	"commandName": '',
	"commandMethod": '',
	"shortCut": '',
	"args": {},
	"init": function (filename, globalCommandPath) {

		let colors              = require('colors');
		let commands            = false;
		let fs                  = require('fs');
		let extend              = require('util')._extend;
		let logo                = fs.readFileSync(__dirname+'/../logo.ascii');
		
		this.filename           = filename;
		this.projectPath        = process.cwd();
		this.projectCommandPath = this.projectPath+'/helpers/simplecommandline';
		this.globalCommandPath  = globalCommandPath;
		this.parse();


		// Check if global commands is in global npm module folder
		if (fs.existsSync(this.projectCommandPath+'/logo.ascii')) {			
			logo = fs.readFileSync(this.projectCommandPath+'/logo.ascii');
		}

		// Set logo
		console.log(String(logo).blue);
		process.stdout.write("\n");		

		// Check if global commands is in global npm module folder
		if (fs.existsSync(this.globalCommandPath+'/globalCommands.json')) {
			commands = require(this.globalCommandPath+'/globalCommands.json');
		}
		// No commands.json found
		else {
			throw new Error("No globalCommands.json found, be sure there is a global commands file: "+this.globalCommandPath+'/globalCommands.json');
		}

		// Check if commands is in project root
		if (fs.existsSync(this.projectCommandPath+'/commands.json')) {
			commands = extend(commands, require(this.projectCommandPath+'/commands.json'));
		}

		// Unknown command
		if (this.commandName === '') {

			let help = require(this.globalCommandPath+'/commands/help.js');
			help.init(commands, this.projectCommandPath).helpMesssage();
			return;
		}

		// If command method is help
		if ( this.commandName === 'help' || this.commandMethod === 'help') {

			let help = require(this.globalCommandPath+'/commands/help.js');
			help.init(commands, this.projectCommandPath).helpMesssage(this.commandName);
			return;
		}

		// Unknown method
		if (this.commandMethod === '') {

			let help = require(this.globalCommandPath+'/commands/help.js');
			help.init(commands, this.projectCommandPath).unknownCommand(this.commandName);
			return;
		}

		// Check if we can find the command
		if (typeof commands[this.commandName] === "undefined") {

			// Try to find the command or command shortCut
			for (let commandName in commands) {
				for (let commandMethod in commands[commandName]) {
					if (commands[commandName][commandMethod]['shortCut'] === this.commandName+':'+this.commandMethod) {
						this.commandName   = commandName;
						this.commandMethod = commandMethod;
						this.shortCut      = commands[commandName][commandMethod]['shortCut'];
						break;
					}
				}
			}
		}

		// Check if we can find the command
		if (typeof commands[this.commandName] === "undefined" || typeof commands[this.commandName][this.commandMethod] === "undefined") {
			let passCommand = (typeof commands[this.commandName] !== "undefined" ? this.commandName : null);

			let help = require(this.globalCommandPath+'/commands/help.js');
			help.init(commands, this.projectCommandPath).unknownCommand(passCommand);
			return;
		}

		// Require command file
		if (typeof commands[this.commandName][this.commandMethod]['globalCommand'] !== "undefined" && commands[this.commandName][this.commandMethod]['globalCommand']) {
			var command = require(this.globalCommandPath+'/commands/'+this.commandName+'.js');
		}
		else {
			var command = require(this.projectCommandPath+'/commands/'+this.commandName+'.js');
		}

		//Execute command
		let response = command[this.commandMethod](this.args, this.projectPath, this.globalCommandPath, this.projectCommandPath);

		//Check if response was success
		if (response.success) {
			// Check if success = 2 [warning]
			if (response.success === 2) {
				console.info(colors.yellow(response.message));
			}
			else {
				console.info(colors.green(response.message));
			}
		} else {
			console.info(colors.red(response.message));
		}
	},
	"parse": function () {
		let len       = process.argv.length;
		let totalArgs = 0;

		// parse options
		for (let i = 2; i < len; ++i) {
			let arg = process.argv[i];

			if (arg.substring(0, 2) === '--') {
				let argSplit  = arg.split('=');
				let argName   = argSplit[0].replace('--', '');

				argSplit.shift();

				this.args[argName] = (argSplit.length === 1 ? argSplit[0] : argSplit.join('='));
			} else {
				if (this.commandName === '') {
					if (arg.indexOf(':') !== -1) {
						let argSplit       = arg.split(':');
						this.commandName   = argSplit[0].replace('--', '').toLowerCase();
						this.commandMethod = argSplit[1].replace('--', '').toLowerCase();
					} else {
						this.commandName = arg.toLowerCase();
					}
				} else if (this.commandMethod === '') {
					this.commandMethod = arg.toLowerCase();
				} else {
					this.args[totalArgs] = arg;
					++totalArgs;
				}
			}
		}

		// console.info('args'.input, this.args);
		// console.log(this, 'this');
	}
};

module.exports = simpleCommandline;