'use strict';

class Controller {
	#param;
	#model;
	#view; 
	#app = null; // Express application

	{% for object in project.objects -%}
	_{{object.attributes.pascal_name}}Routes = null;
	{% endfor %}

	initialize(param, model, view) {
		if (! param instanceof Object)
			throw new Error('Invalid param argument');
		if (! model instanceof Object || model.constructor.name !== 'Model')
			throw new Error('Invalid model argument');
		if (! view instanceof Object || view.constructor.name !== 'View')
			throw new Error('Invalid view argument');

		this.#param = param;
		this.#model = model;
		this.#view = view; 

		const express = require('express');
		this.#app = express();
		this.#app.use(express.json())
		this.#app.use(express.urlencoded({extended: true}));

		const cors = require('cors')
		this.#app.use(cors());

		// TODO add session

		this.#app.get('/', (request, response) => {
			this.#view.sendJsonResult(response, 'API {{project.name}} frontend ready');
		});

		this.#app.get('/version', (request, response) => {
			this.#view.sendJsonResult(response, '{{project.name backend}} V{{project.attributes.backend_project_version}}');
		});

		this.#app.get('/api/{{project.attributes.api_version}}', (request, response) => {
			this.#view.sendJsonResult(response, '{{project.name}} backend API {{project.attributes.api_version}} ready');
		});

		{% for object in project.objects %}
		this._{{object.attributes.pascal_name}}Routes = require('./{{object.attributes.kebab_name}}-routes.js')(this.#app, this.#model.get{{object.attributes.pascal_name}}Models(), this.#view);
		{%- endfor %}
	}


	{% for object in project.objects %}
	get{{object.attributes.pascal_name}}Routes() {
		console.log(this._{{object.attributes.pascal_name}}Routes);
		return this._{{object.attributes.pascal_name}}Routes;
	}
	{% endfor %}

	async run () {
		if (this.#app === null)
			throw new Error('Controller not initialized');
		this.#app.listen(this.#param.port, 
			() => { // success
				console.log(`Listening on port ${this.#param.port}`);
			}
		);
	}


}

class ControllerSingleton {
	constructor() {
		throw new Error('Can not instanciate singleton object!');
	}
	static getInstance() {
		if (! ControllerSingleton.instance)
			ControllerSingleton.instance = new Controller();
		return ControllerSingleton.instance;
	}
}

module.exports = ControllerSingleton;
/* TODO cleanup
module.exports = (_serverParam, _Model, _View) => {
	if (typeof(_serverParam) !== 'object')
		throw new Error('Invalid ServerParam argument');
	console.log("dOm====================== control");
	console.log(typeof(_Model));
	console.log(typeof(_View));
	if (typeof(_serverParam) !== 'object')
		throw new Error('Invalid ServerParam argument');
	serverParam = _serverParam;
	View = _View;
	Model = _Model;
	return Controller;
};
*/
