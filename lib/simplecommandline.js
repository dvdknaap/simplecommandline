'use strict';

let commands = false;
let path     = require('path');
let appDir   = path.dirname(require.main.filename);

// Check if config is in project root
if (fs.existsSync(appDir+'/commands.json')) {
	commands = require(appDir+'/commands.json');
}
// No config.json found
else {
	throw new Error("No commands.json found, read README.md for help");
}

const colors   = require('colors');

var simpleCommandline = {
	"filename": '',
	"projectPath": '',
	"redCommandPath": '',
	"commandName": '',
	"commandMethod": '',
	"shortCut": '',
	"args": {},
	"init": function (filename) {
		this.filename       = filename;
		this.projectPath    = process.cwd();
		this.redCommandPath = __dirname;
		this.parse();

		// Unknown command
		if (this.commandName === '') {

			let help = require('../commands/help.js');
			help.helpMesssage();
			return;
		}

		// If command method is help
		if ( this.commandName === 'help' || this.commandMethod === 'help') {

			let help = require('../commands/help.js');
			help.helpMesssage(this.commandName);
			return;
		}

		// Unknown method
		if (this.commandMethod === '') {

			let help = require('../commands/help.js');
			help.unknownCommand(this.commandName);
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
			let passCommand = (typeof commands[this.commandName] !== "undefined" ? commands[this.commandName] : null);

			let help = require('../commands/help.js');
			help.unknownCommand(passCommand);
			return;
		}

		// Require command file
		let command = require('../commands/'+this.commandName+'.js');

		//Execute command
		let response = command[this.commandMethod](this.args, this.projectPath, this.redCommandPath);

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
		for (var i = 2; i < len; ++i) {
			let arg = process.argv[i];
			// console.info(arg, 'arg'+i);

			if (arg.substring(0, 2) === '--') {
				let argSplit  = arg.split('=');
				let argName   = argSplit[0].replace('--', '');

				this.args[argName] = argSplit[1];
			} else {
				if (this.commandName === '') {
					if (arg.indexOf(':') !== -1) {
						let argSplit  = arg.split(':');
						this.commandName = argSplit[0].replace('--', '');
						this.commandMethod = argSplit[1].replace('--', '');
					} else {
						this.commandName = arg;
					}
				} else if (this.commandMethod === '') {
					this.commandMethod = arg;
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