'use strict';
var serverParam = null;
var Model = null;
var View = null;

class Controller {
	static app;

	static async initialize() {

		console.log("Init controller");
		const express = require('express');
		this.app = express();
		this.app.use(express.json())
		this.app.use(express.urlencoded({extended: true}));

		const cors = require('cors')
		this.app.use(cors());

		// TODO add session

		this.app.get('/', (request, response) => {
			View.sendJsonResult(response, 'API {{project.name}} frontend ready');
		});

		this.app.get('/version', (request, response) => {
			// TODO centralize backend version
			View.sendJsonResult(response, '{{project.name backend}} V{{project.attributes.backend_project_version}}');
		});

	}

	static async run () {
		this.app.listen(serverParam.port, 
			() => { // success
				console.log(`Listening on port ${serverParam.port}`);
			}
		);
	}
}

module.exports = (_serverParam, _Model, _View) => {
	serverParam = _serverParam;
	View = _View;
	Model = _Model;
	return Controller;
};
