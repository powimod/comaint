'use strict';
var serverParam = null;
var Model = null;
var View = null;

class Controller {
	static app;

	{% for object in project.objects %}
	_{{object.attributes.pascal_name}}Routes = null;
	{% endfor %}

	static async initialize() {
		console.log("Init controller");

		{% for object in project.objects %}
		this._{{object.attributes.pascal_name}}Routes = require('./{{object.attributes.kebab_name}}-routes.js')(this._db);
		{% endfor %}

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


	{% for object in project.objects %}
	static get{{object.attributes.pascal_name}}Routes() {
		return this._{{object.attributes.pascal_name}}Routes;
	}
	{% endfor %}

}

module.exports = (_serverParam, _Model, _View) => {
	serverParam = _serverParam;
	View = _View;
	Model = _Model;
	return Controller;
};
