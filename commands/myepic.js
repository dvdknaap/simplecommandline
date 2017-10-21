'use strict';

var myepicCommand = {
	"command": function (args, projectPath, redCommandPath) {
		let response   = {'success': false, 'message': 'Unknown error'};
		
		// Params
		let argSuccess = (typeof args['argSuccess'] !== "undefined" ? args['argSuccess'] : (typeof args[0] !== "undefined" ? args[0] : false));
		
		if (argSuccess == true) {
			response.success = true;
			response.message = 'command myepic:command successfully executed';
		}
		else {
			response.message = 'My custom error from myepic:command';
		}

		return response;
	}
};

module.exports = myepicCommand;