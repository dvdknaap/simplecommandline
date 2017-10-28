'use strict';
const fs       = require('fs');
const colors   = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});


var helpCommand = {
	"lastHelpMessageCommandName": "",
	"commands": "",
	"init": function (commands, projectCommandPath) {
		this.commands = commands;

		return this;
	},
	"helpMesssage": function (usedCommandName='') {

		let HelpMessage = '';
		HelpMessage += 'Usage:'+"\n"+
			'scl '+(usedCommandName !== '' && usedCommandName !== 'help' ? usedCommandName : 'commandName')+':commandMethod [arguments]'+"\n\n"+
			'Options:'+"\n\n"
		;

		// Loop throught all commands
		for (let commandName in this.commands) {
			if ((usedCommandName !== 'help' && usedCommandName !== '') && commandName !== usedCommandName) {
				continue;
			}

			this.lastHelpMessageCommandName = '';
			for (let commandMethod in this.commands[commandName]) {
				HelpMessage += this.printHelpMessage(commandName, commandMethod, this.commands[commandName][commandMethod]);
			}

			HelpMessage += "\n";
		}

		process.stdout.write(HelpMessage);
		process.exit(1);
	},
	"unknownCommand": function (commandName='') {

		process.stdout.write('Unknown command use \'scl'+(commandName !== '' ? ' '+commandName : '')+' help\' for more information');
		process.exit(1);
	},
	"printHelpMessage": function (commandName, commandMethod, commandInfo) {
		let maxColumnSpace = 10;
		let stringRepeat   = " ";		
		let HelpMessage    = "";

		if (this.lastHelpMessageCommandName !== commandName) {
			HelpMessage    = "  "+commandName+":\n";
		}

		HelpMessage += "\t"+commandMethod+"\n";
		HelpMessage += "\t  Name:"+stringRepeat.repeat(maxColumnSpace-5)+commandInfo['name']+"\n";
		HelpMessage += "\t  Desc:"+stringRepeat.repeat(maxColumnSpace-5)+commandInfo['desc']+"\n";
		HelpMessage += "\t  Command:"+stringRepeat.repeat(maxColumnSpace-8)+commandName+":"+commandMethod;

		HelpMessage += " "+colors.red("("+commandInfo['shortcut']+")")+"\n";
		HelpMessage += "\t  Usage:"+stringRepeat.repeat(maxColumnSpace-6)+commandInfo['usage']+"\n";

		// Only add example when we got an example
		if (typeof commandInfo['example'] !== "undefined" && commandInfo['example'] !== '') {
			HelpMessage += "\t  Example:"+stringRepeat.repeat(maxColumnSpace-8)+commandInfo['example']+"\n";
		}

		HelpMessage += "\n";

		// Set new last command name
		this.lastHelpMessageCommandName = commandName;
		return HelpMessage;
	}
};

module.exports = helpCommand;