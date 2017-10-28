'use strict';

const fs       = require('fs');

var commandCommand = {
	"create": function (args, projectPath, simpleCommandPath, projectCommandPath) {
		let response = {'success': false, 'message': 'Unknown error'};

		// Params
		let commandName   = (typeof args['commandName'] !== "undefined" ? args['commandName'] : (typeof args[0] !== "undefined" ? args[0] : '')).toLowerCase();
		let commandMethod = (typeof args['commandMethod'] !== "undefined" ? args['commandMethod'] : (typeof args[1] !== "undefined" ? args[1] : '')).toLowerCase();
		let name          = (typeof args['name'] !== "undefined" ? args['name'] : (typeof args[2] !== "undefined" ? args[2] : '')).toLowerCase();
		let desc          = (typeof args['desc'] !== "undefined" ? args['desc'] : (typeof args[3] !== "undefined" ? args[3] : '')).toLowerCase();
		let shortcut      = (typeof args['shortcut'] !== "undefined" ? args['shortcut'] : (typeof args[4] !== "undefined" ? args[4] : '')).toLowerCase();
		let usage         = (typeof args['usage'] !== "undefined" ? args['usage'] : (typeof args[5] !== "undefined" ? args[5] : '')).toLowerCase();
		let example       = (typeof args['example'] !== "undefined" ? args['example'] : (typeof args[6] !== "undefined" ? args[6] : '')).toLowerCase();
		let globalCommand = (typeof args['globalCommand'] !== "undefined" ? args['globalCommand'] : (typeof args[7] !== "undefined" ? args[7] : 0));

		// Check if we received command name
		if (commandName === '') {
			response['message'] = 'No command name received, check command help for more infomation';
			return response;
		}

		// Check if we received command method
		if (commandMethod === '') {
			response['message'] = 'No command method received, check command help for more infomation';
			return response;
		}

		// Check if we received name
		if (name === '') {
			response['message'] = 'No command name received, check command help for more infomation';
			return response;
		}

		// Check if we received desc
		if (desc === '') {
			response['message'] = 'No command desc received, check command help for more infomation';
			return response;
		}

		// Check if we received shortcut
		if (shortcut === '') {
			response['message'] = 'No command shortcut received, check command help for more infomation';
			return response;
		}

		// Check if we received usage text
		if (usage === '') {
			response['message'] = 'No command usage received, check command help for more infomation';
			return response;
		}

		// Check if we need to add global command setting
		if (globalCommand && globalCommand == "1") {
			var commands = require(simpleCommandPath+'/globalCommands.json');
		} else {

			// Check if project command path doesn't exists
			if (!fs.existsSync(projectCommandPath)) {
				let mkdirp = require('mkdirp');
				    
				mkdirp.sync(projectCommandPath);
			}

			// Check if project command path doesn't exists
			if (!fs.existsSync(projectCommandPath+'/commands')) {
				let mkdirp = require('mkdirp');
				    
				mkdirp.sync(projectCommandPath+'/commands');
			}

			// Check if commands exists in project root
			if (fs.existsSync(projectCommandPath+'/commands.json')) {
				commands = require(projectCommandPath+'/commands.json');
			} else {
				commands = {};

				fs.writeFileSync(projectCommandPath+'/commands.json', JSON.stringify(commands));
			}
		}

		// Check if command already exists
		if (typeof commands[commandName] !== "undefined" && typeof commands[commandName][commandMethod] !== "undefined") {
			response.message = 'command already exists, remove command and try again';
			return response;
		}

		if (typeof commands[commandName] === "undefined") {
			commands[commandName] = {};
		}

		commands[commandName][commandMethod] = {
			'name': name,
			'desc': desc,
			'shortcut': shortcut,
			'usage': usage,
		};

		// Check if we received example text
		if (example !== '') {
			commands[commandName][commandMethod]['example'] = example;
		}

		// Check if we need to add global command setting
		if (globalCommand && globalCommand !== "") {
			commands[commandName][commandMethod]['globalCommand'] = globalCommand;
		}

		let commandExample  = fs.readFileSync(simpleCommandPath+'/examples/commands.js').toString();
		let allCommandsFile = '';
		let commandFile     = '';

		// When new command is global
		if (globalCommand == 1) {
			allCommandsFile = simpleCommandPath+'/globalCommands.json';
			commandFile     = simpleCommandPath+'/commands/'+commandName+'.js';
		} else {
			allCommandsFile = projectCommandPath+'/commands.json';
			commandFile     = projectCommandPath+'/commands/'+commandName+'.js';

			// Check if there is an custom example for commands
			if (fs.existsSync(projectCommandPath+'/examples/commands.js')) {
				commandExample  = fs.readFileSync(projectCommandPath+'/examples/commands.js').toString();
			}
		}

		// Replace model templates
		commandExample = commandExample.
			replace(/{{commandName}}/g, commandName).
			replace(/{{commandMethod}}/g, commandMethod)
		;

		try {

			fs.writeFileSync(allCommandsFile, JSON.stringify(commands));

			// Check if command file already exists
			if (fs.existsSync(commandFile)) {

				response.success = 2;
				response.message = 'command '+commandName+':'+commandMethod+' already exists add the following '+commandMethod+' function to '+commandFile+":\r\n";
				response.message += commandExample;

			}
			// No command file found so create it
			else {
				fs.writeFileSync(commandFile, commandExample);

				response.success = true;
				response.message = 'command '+commandName+':'+commandMethod+' successfully created';
			}

		} catch (e) {
			response.message = 'Cannot write command '+commandName+': '+e.message;
		}

		return response;
	},
	"remove": function (args, projectPath, simpleCommandPath, projectCommandPath) {
		let response      = {'success': false, 'message': 'Unknown error'};
		
		// Params
		let commandName     = (typeof args['commandName'] !== "undefined" ? args['commandName'] : (typeof args[0] !== "undefined" ? args[0] : '')).toLowerCase();
		let commandMethod   = (typeof args['commandMethod'] !== "undefined" ? args['commandMethod'] : (typeof args[1] !== "undefined" ? args[1] : '')).toLowerCase();
		
		let allCommandsFile = projectCommandPath+'/commands.json';

		// Check if commands not exists in project root
		if (!fs.existsSync(projectCommandPath+'/commands.json')) {
			response.message = 'No commands.json found in project directory';
			return response;
		}

		let commands        = require(allCommandsFile);
		let commandFile     = projectCommandPath+'/commands/'+commandName+'.js';

		try {
			// Check if command file already exists
			if (fs.existsSync(commandFile)) {
				let requireCommandFile = require(commandFile);

				// Check if there are more command method for this command
				if (Object.keys(requireCommandFile).length > 1) {
					response.success = 2;
					response.message = 'There are more command methods found so remove function '+commandMethod+' manualy in '+commandFile;
				}
				// Only 1 command method so we can safely remove the command file
				else {
					response.success = true;
					fs.unlinkSync(commandFile);
				}
			}

			// remove command method from command line
			delete commands[commandName][commandMethod];

			// Check if there are no command methods anymore for this command
			if (Object.keys(commands[commandName]).length === 0) {

				// remove command method from command line
				delete commands[commandName];
			}

			fs.writeFileSync(allCommandsFile, JSON.stringify(commands));

			if (!response.success) {
				response.success = true;
			}
			
			response.message = 'command '+commandName+':'+commandMethod+' successfully removed';

		} catch (err) {
			response.message = 'My custom error from command:remove';
		}
		
		return response;
	}

};

module.exports = commandCommand;