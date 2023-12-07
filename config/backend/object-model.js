'use strict'
var db = null;

class {{object.name | pascalCase }}Model {

	static control{{object.name | pascalCase }}Object({{object.name | camelCase }}, controlId = true){
		if (typeof({{object.name | camelCase }}) !== 'object')
			throw new Error('Invalid <{{object.name | camelCase }}> argument');
		if (controlId) {
			if ({{object.name | camelCase }}.id === undefined)
				throw new Error('{{object.name | pascalCase }} ID is undefined');
			if ({{object.name | camelCase }}.id === null)
				throw new Error('{{object.name | pascalCase }} ID is null');
			if (typeof({{object.name | camelCase }}.id) !== '{{object.name | camelCase }}')
				throw new Error('{{object.name | pascalCase }} is not an number');
		}
		// control title
		const propertyList = [ 
			{name: 'name', type:'string'},
		];
		if (controlId)
			propertyList.push({ name: 'creationTimeStamp', type: 'string'});
		for (let prop of propertyList){
			if ({{object.name | camelCase }}[prop.name] === undefined)
				throw new Error(`Property <${prop.name}> of {{object.name | camelCase }} is undefined`);
			if (typeof({{object.name | camelCase }}[prop.name]) !== prop.type)
				throw new Error(`Property <${prop.name}> of {{object.name | camelCase }} is not as ${prop.type}`);
		}
	}


	static {{object.name | camelCase }}FromDb(record) {
		return {
			{% for property in object.properties -%}
			{%- liquid
			  if property.last
				assign separator = ''
			  else
				assign separator = ','
			  endif -%}
			{{property.name}} : record.{{property.name}}{{separator}}
			{% endfor -%}
		};
	}

	static async get{{object.name | pascalCase }}List() {
		let sql = 'SELECT * FROM {{object.attributes.table_name }};'
		// TODO order by
		// TODO field selection 
		const result = await db.query(sql);
		if (result.code) 
			throw new Error(result.code);
		const {{object.name | camelCase }}List = [];
		for (let {{object.name | camelCase }}Record of result) 
			{{object.name | camelCase }}List.push( this.{{object.name | camelCase }}FromDb({{object.name | camelCase }}Record) );
		return {{object.name | camelCase }}List;
	}

	static async create{{object.name | pascalCase }}({{object.name | camelCase }}) {
		this.control{{object.name | pascalCase }}Object({{object.name | camelCase }}, false);
		const fieldNames = [
			{%- liquid 
			    assign sep = ""
			    for property in object.properties
			       if property.type.name != 'id' 
			           if property.attributes.auto_counter != true
				     echo sep
			             echo property.name | prepend: "'" | append: "'"
			             assign sep = ", "
			           endif
			       endif
			    endfor 
			    for link in object.links
			      echo sep
		              echo link.name | capitalize | prepend: "id" | prepend: "'" | append: "'"
		              assign sep = ", "
			    endfor 
			-%}
		];
		const markArray = Array(fieldNames.length).fill('?');
		const sqlRequest = `
			INSERT INTO {{object.attributes.table_name}}(${fieldNames.join(', ')}) 
			       VALUES (${markArray.join(', ')});
		`;
		const sqlParams = [];
		for (let fieldName of fieldNames) {
			const value = {{object.name | camelCase }}[fieldName];
			if (value === undefined)
				throw new Error(`Property <${fieldName}> not defined in {{object.name}}`);
			sqlParams.push(value);
		}
		//console.log("SQL request", sqlRequest);
		//console.log("SQL params ", sqlParams);
		const result = await db.query(sqlRequest, sqlParams);
		if (result.code)
			throw new Error(result.code);
		{{object.name | camelCase }}.id = result.insertId;
		return {{object.name | camelCase }};
	}

}

module.exports = (_db) => {
	db = _db;
	return {{object.name | pascalCase }}Model;
}

