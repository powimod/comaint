'use strict';

function loadConfig()
{
	const configFile = './config.json';
	console.log(`Loading configuration file ${configFile}`);
	const nconf = require('nconf');
	nconf.argv()
	     .env()
	     .file({ file: configFile });

	const dbParam = nconf.get('database');
	if (dbParam === undefined)
		throw new Error(`Can't find <database> section in configuration file ${configFile}`);
	for (let prop of ['host', 'port', 'user', 'password', 'database' ])
		if (dbParam[prop] === undefined)
			throw new Error(`Can't find <${prop}> property in <database> section of ${configFile}`);

	const serverParam = nconf.get('server');
	if (serverParam === undefined)
		throw new Error(`Can't find <server> section in configuration file ${configFile}`);
	for (let prop of ['host', 'port' ])
		if (serverParam[prop] === undefined)
			throw new Error(`Can't find <${prop}> property in <server> section of ${configFile}`);

	const tokenParam = nconf.get('token');
	if (tokenParam === undefined)
		throw new Error(`Can't find <token> section in configuration file ${configFile}`);
	for (let prop of ['secret'])
		if (tokenParam[prop] === undefined)
			throw new Error(`Can't find <${prop}> property in <token> section of ${configFile}`);

	const config = {
		db: dbParam,
		server: serverParam,
		token: tokenParam
	}

	return config;
}

async function main() {
	let config = null;
	config = loadConfig();

	console.log('Initializing model...');
	const ModelSingleton = require('./models/model.js');
	let model  = ModelSingleton.getInstance();
	await model.initialize(config.db);

	console.log('Initializing view...');
	const ViewSingleton = require('./views/view.js');
	let view = ViewSingleton.getInstance();

	console.log('Initializing controller...');
	const ControllerSingleton = require('./routes/controller.js');
	let controller = ControllerSingleton.getInstance();
	controller.initialize(config.server, model, view);

	await controller.run();
}

main()
/* TODO reactivate this
.catch(error) {
	const message = (error.message) ? error.message : error;
	console.error(`Error : ${message}`);
	process.exit(1);
}
*/
