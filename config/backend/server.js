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
	try {
		config = loadConfig();
	}
	catch(error){
		console.error(`Error : ${error.message}`);
		process.exit(1);
	}

	console.log('Initialize models...');
	const ModelInit = require('./models/Model.js');
	let Model  = null;
	try {
		Model  = await ModelInit(config.db); 
		await Model.initialize(config); // TODO à fusionner avec fonction précèdente
	}
	catch (error) {
		const errorMessage = (error.message) ? error.message : error;
		console.error(`Can not open database : ${errorMessage}`);
		return false;
	}

	console.log('Modèle initialisé');


}

main()
