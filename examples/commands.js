'use strict';

var {{commandName}}Command = {
	"{{commandMethod}}": function (args, projectPath, simpleCommandPath, projectCommandPath) {
		let response = {'success': false, 'message': 'Unknown error'};

		// Params
		let argSuccess = (typeof args['firstArgName'] !== "undefined" ? args['firstArgName'] : (typeof args[0] !== "undefined" ? args[0] : false));
		
		if (argSuccess == true) {
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