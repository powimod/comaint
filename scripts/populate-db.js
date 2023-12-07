'use strict';

const companyCount = 20;
const maxUnitPerCompany = 5;

const apiUrl = 'http://localhost:9001/api/v1';

const assert = require('node:assert').strict;

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
	'Automobile', 'Transport', 'Corderie', 'Verrerie', 'Papeterie',
	'Electricté', 'Robotique', 'Peinture', 'Mécanique', 'Papéterie',
	'Décoltage', 'Ciment', 'Construction', 'Logistique'
	];
const companyStatus = [ 'SA', 'SARL', 'EURL' ];


const unitTypes = [ 'Usine', 'Atelier', 'Entrepôt', 'Bâtiment', 'Unité', 'Usine'  ];

async function populateUnits(company){
	let unitCount = parseInt(maxUnitPerCompany * Math.random());
	if (unitCount === 0)
		unitCount = 1;
	console.log(`\tCreating ${unitCount} units for company <${company.name}>...`);
	let counters = {};
	for (let iUnit = 0; iUnit < unitCount; iUnit++)
	{
		const unitTypeIndex = parseInt(unitTypes.length * Math.random());
		if ( counters[unitTypeIndex] === undefined)
			counters[unitTypeIndex] = 0;
		counters[unitTypeIndex] += 1;
		const unitNumber = counters[unitTypeIndex];
		const unitName = `${unitTypes[unitTypeIndex]} n°${unitNumber}`;
		const unitDescription = '';
		console.log(`\t- creating unit ${iUnit + 1}/${unitCount} <${unitName}>`); 
		let unit = { 
			name: unitName,
			idCompany : company.id,
			description : unitDescription
		};
		const url = `${apiUrl}/unit/create`;
		const params = {
			method:'POST',
			headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify({ unit : unit })
		};
		// try { TODO reactivate this
			let result = await fetch(url, params);
			if (result.status !== 200) {
				console.error( `Backend HTTP response status=${result.status} : ${result.statusText}`);
				break;
			}
			const json = await result.json();
			if (! json.ok){
				console.error( `API Error : ${json.error}`);
				break;
			}
			unit = json.unit;
			assert (unit !== undefined);
			assert (typeof(unit) === 'object');
			assert (unit.id !== undefined);
			assert (! isNaN(unit.id));

			//await populateUnitSecitons(unit);
		//}
		//catch (error) {
		//	const errorMessage =  (error.message !== undefined) ? error.message : error;
		//	console.error( `\tERROR : ${errorMessage}`);
		//	break;
		//}
	}
}

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
		console.log(`- creating company ${iCompany+1}/${companyCount} <${companyFullName}>`); 
		let company = { 
			name: companyFullName,
			address: companyAddress
		};
		const url = `${apiUrl}/company/create`;
		const params = {
			method:'POST',
			headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify({ company : company })
		};
		//try { TODO reactivate this
			let result = await fetch(url, params);
			if (result.status !== 200) {
				console.error( `Backend HTTP response status=${result.status} : ${result.statusText}`);
				break;
			}
			const json = await result.json();
			if (! json.ok){
				console.error( `API Error : ${json.error}`);
				break;
			}
			company = json.company;
			assert (company !== undefined);
			assert (typeof(company) === 'object');
			assert (company.id !== undefined);
			assert (! isNaN(company.id));

			await populateUnits(company);
		//}
		//catch (error) {
		//	const errorMessage =  (error.message !== undefined) ? error.message : error;
		//	console.error( `\tERROR : ${errorMessage}`);
		//	break;
		//}
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
		if (! json.ok) {
			console.error( `API Error : ${json.error}`);
		}
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
