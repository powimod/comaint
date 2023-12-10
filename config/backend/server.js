{% render "../../templates/license_header_js.liquid",
		project     : project.attributes.backend_project_name,
  		description : project.attributes.backend_project_description,
		authors     : project.attributes.authors,
		copyright   : project.attributes.copyright,
		filename    : 'server.js'
		%}
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

	if (dbParam.pingInterval === undefined)
		dbParam.pingInterval = 60000;
	if (dbParam.reconnection === undefined)
		dbParam.reconnection = {};
	if (dbParam.reconnection.interval === undefined)
		dbParam.reconnection.interval = 1000;
	if (dbParam.reconnection.maxRetries === undefined)
		dbParam.reconnection.maxRetries = 60;

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
