'use strict';

var {{commandName}}Command = {
	"{{commandMethod}}": function (args, projectPath, redCommandPath) {
		let response = {'success': false, 'message': 'Unknown error'};

		if (true) {
			response.success = true;
			response.message = 'command {{commandName}}:{{commandMethod}} successfully executed';
		}
		else {
			response.message = 'My custom error from {{commandName}}:{{commandMethod}}';
		}
		
		return response;
	}
};

module.exports = {{commandName}}Command;