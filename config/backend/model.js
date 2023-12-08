{% render "../../templates/license_header_js.liquid",
		project     : project.attributes.backend_project_name,
  		description : project.attributes.backend_project_description,
		authors     : project.attributes.authors,
		copyright   : project.attributes.copyright,
		filename    : 'model.js'
		%}
'use strict'

class Model {

	#config = null;
	#db = null;

	{% for object in project.objects -%}
	#{{object.name | pascalCase }}Models = null;
	{% endfor %}


	async initialize(config) {
		console.log("Initializing Model");
		if (typeof(config) !== 'object')
			throw new Error('Invalid config parameter');
		this.#config = config;
		if (this.#db != null)
			return;
		let promise_mysql = require('promise-mysql');
		this.#db = await promise_mysql.createConnection(config);
		if (this.#db.code) {
			console.error(`Can not open database : ${this.#db.code}`);
			this.#db = null;
		}

		{% for object in project.objects -%}
		this._{{object.name | pascalCase }}Models = require('./{{object.name | kebabCase }}-model.js')(this.#db);
		{% endfor %}
	}

	{% for object in project.objects %}
	get{{object.name | pascalCase }}Models() {
		return this._{{object.name | pascalCase }}Models;
	}
	{% endfor %}
}

class ModelSingleton {
	constructor() {
		throw new Error('Can not instanciate singleton object!');
	}
	static getInstance() {
		if (! ModelSingleton.instance)
			ModelSingleton.instance = new Model();
		return ModelSingleton.instance;
	}
}

module.exports = ModelSingleton;
