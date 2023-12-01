'use strict'

var param = null;

class Model {

	_db = null;
	{% for object in project.objects %}
	_{{object.attributes.pascal_name}}Models = null;
	{% endfor %}

	static async initDB(){
		console.log("Intialize database");
		if (this._db != null)
			return;
		let promise_mysql = require('promise-mysql');
		this._db = await promise_mysql.createConnection(param);
		if (this._db.code) {
			console.error("Problème de connexion en base");
			this._db = null;
		}
	}

	static async initialize(config) {
		console.log("Model.Initialise");
		if (this._db == null)
			await this.initDB();
		{% for object in project.objects %}
		this._{{object.attributes.pascal_name}}Models = require('./{{object.attributes.kebab_name}}-model.js')(this._db);
		{% endfor %}
	}

	{% for object in project.objects %}
	static get{{object.attributes.pascal_name}}Models() {
		return this._{{object.attributes.pascal_name}}Models;
	}
	{% endfor %}

}

module.exports = (_param) => {
	param = _param;
	return Model;
};
