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
	#promise_mysql = null;

	{% for object in project.objects -%}
	#{{object.name | pascalCase }}Models = null;
	{% endfor %}

	/* TODO used ?
	constructor() {
		this.connectDb = this.connectDb.bind(this);
	}
	*/

	get db() {
		return this.#db;
	}	

	async connectDb() {
		const self = this;
		let promise_mysql = require('promise-mysql');
		const tempo = this.#config.reconnection.interval;

		function sleep(tempo) {
			return new Promise( (resolve) => {
				setTimeout(() => { resolve(); }, tempo);
			});
		}

		// connection retry loop
		this.#db = null;
		let db = null;
		const maxRetries = this.#config.reconnection.maxRetries;
		for (let retry = 0; retry < maxRetries ; retry++){
			console.log(`Connecting database...`);
			try {
				db = await promise_mysql.createConnection(this.#config);
				if (db.code === undefined) {
					break;
				}
				console.error(`Can not open database : ${db.code}`);
				db = null;
			}
			catch (error) {
				console.log(`Database connection error : ${error.message}`);
			}
			console.log(`Connection retry n°${retry+1}/${maxRetries} : waiting ${tempo}ms...`);
			await sleep(tempo);
		}
		this.#db = db;
		if (this.#db === null) 
			throw new Error('Can not connect database');
		this.#db.on('error', function(err) {
			self.#db = null;
			if (!err.fatal) return;
			if (err.code !== 'PROTOCOL_CONNECTION_LOST')
				throw err;
			console.log('DB connection lost...'); // : ' + err.stack);
			self.connectDb();
		});
		console.log("Database connection success");
	}

	async initialize(config) {
		console.log("Initializing Model");
		if (typeof(config) !== 'object')
			throw new Error('Invalid config parameter');
		if (this.#db != null)
			return;
		this.#config = config;
		await this.connectDb();

		{% for object in project.objects -%}
		this._{{object.name | pascalCase }}Models = require('./{{object.name | kebabCase }}-model.js')();
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
