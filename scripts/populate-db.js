'use strict';

const companyCount = 30;
const apiUrl = 'http://localhost:9001/api/v1';

const companyName = [ 
	'Dupont', 'Charles', 'André', 'Antoine', 'Fabvre', 'Antoine', 
	'Lorraine', 'Martin', 'Robert', 'Carpentier', 'Sanchez', 'Fournier',
	'Girard', 'Dubois', 'Richard', 'Michel', 'Laurent', 'Gauthier', 'Morin',
	'Noel', 'Meyer', 'Dufour', 'Remy', 'Le Roux', 'Prevost', 'Fernandez',
	'Bailly', 'Menard', 'Daniel', 'Leblanc', 'Michaud', 'Da Silva',
	'Renaud', 'Pichon', 'Gilbert', 'Leclerc', 'Rolland', 'Bernard',
	'Laporte', 'Lamy', 'Perret', 'Lacroix', 'Picard', 'Collin', 'Caron',
	'Vôsges', 'Toul', 'Nancy', 'Est', 'France' ];
const companyDomains = [
	'Acier', 'Plomberie', 'Cuisine', 'Béton', 'Plastique', 'Chimie',
	'Bitumes', 'Solaire', 'Eolienne', 'Electronique', 'Textile', 'Bois', 
	'Automobile', 'Transports', 'Corderie', 'Verrerie', 'Papeterie',
	'Electricté', 'Robotique', 'Peinture', 'Mécanique', 'Papéterie',
	'Décoltage', 'Ciment', 'Construction'
	];
const companyStatus = [ 'SA', 'SARL', 'EURL' ];

async function populateCompanies(){
	console.log("Populating companies...");
	for (let iCompany = 0; iCompany < companyCount; iCompany++)
	{
		let companyFullName = Array(
				companyName[ parseInt(companyName.length * Math.random())],  
				companyDomains[ parseInt(companyDomains.length * Math.random())],
				companyStatus[ parseInt(companyStatus.length * Math.random())]
			).join(' ');
		let companyAddress = '';
		console.log(`- creating company ${iCompany} / ${companyCount} <${companyFullName}>`); 
		const url = `${apiUrl}/company/create`;
		const params = {
			method:'POST',
			headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify({
				company : { 
					name: companyFullName,
					address: companyAddress
				}
			})
		};
		try {
			let result = await fetch(url, params);
			if (result.status !== 200) {
				console.error( `Backend HTTP response status=${result.status} : ${result.statusText}`);
				break;
			}
			const json = await result.json();
			if (! json.ok){
				console.error( `API Error : ${json.message}`);
				break;
			}
		}
		catch (error) {
			const errorMessage =  (error.message !== undefined) ? error.message : error;
			console.error( `\tERROR : ${errorMessage}`);
			break;
		}
	}
}

async function checkBackend() {
	const url = `${apiUrl}`;
	const params = {
		method:'GET',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
	};
	try {
		let result = await fetch(url, params);
		if (result.status !== 200)
			throw new Error(`HTTP response status is not 200 but ${result.status} (${result.statusText})`);
		const json = await result.json();
		if (! json.ok)
			console.error( `API Error : ${json.message}`);
	}
	catch (error) {
		const errorMessage =  (error.message !== undefined) ? error.message : error;
		console.error( `\tERROR : ${errorMessage}`);
		return false;
	}

}

async function main() {
	if (await checkBackend() === false) {
		console.error(`Backend is not ready (address ${apiUrl})`);
		process.exit(1);
	}
	await populateCompanies();
	console.log('Script terminated');
}

main();
