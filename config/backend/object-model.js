'use strict'
var db = null;

class {{object.attributes.pascal_name}}Model {

	static control{{object.attributes.pascal_name}}Object({{object.attributes.camel_name}}, controlId = true){
		if (typeof({{object.attributes.camel_name}}) !== 'object')
			throw new Error('Invalid <{{object.attributes.camel_name}}> argument');
		if (controlId) {
			if ({{object.attributes.camel_name}}.id === undefined)
				throw new Error('{{object.attributes.pascal_name}} ID is undefined');
			if ({{object.attributes.camel_name}}.id === null)
				throw new Error('{{object.attributes.pascal_name}} ID is null');
			if (typeof({{object.attributes.camel_name}}.id) !== '{{object.attributes.camel_name}}')
				throw new Error('{{object.attributes.pascal_name}} is not an number');
		}
		// control title
		const propertyList = [ 
			{name: 'name', type:'string'},
		];
		if (controlId)
			propertyList.push({ name: 'creationTimeStamp', type: 'string'});
		for (let prop of propertyList){
			if ({{object.attributes.camel_name}}[prop.name] === undefined)
				throw new Error(`Property <${prop.name}> of {{object.attributes.camel_name}} is undefined`);
			if (typeof({{object.attributes.camel_name}}[prop.name]) !== prop.type)
				throw new Error(`Property <${prop.name}> of {{object.attributes.camel_name}} is not as ${prop.type}`);
		}
	}


	static {{object.attributes.camel_name}}FromDb(record) {
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

	static async get{{object.attributes.pascal_name}}List() {
		let sql = 'SELECT * FROM {{object.attributes.table_name}};'
		// TODO order by
		// TODO field selection 
		const result = await db.query(sql);
		if (result.code) 
			throw new Error(result.code);
		const {{object.attributes.camel_name}}List = [];
		for (let {{object.attributes.camel_name}}Record of result) 
			{{object.attributes.camel_name}}List.push( this.{{object.attributes.camel_name }}FromDb({{object.attributes.camel_name}}Record) );
		return {{object.attributes.camel_name}}List;
	}

	static async create{{object.attributes.pascal_name}}({{object.attributes.camel_name}}) {
		this.control{{object.attributes.pascal_name}}Object({{object.attributes.camel_name}}, false);
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
			const value = {{object.attributes.camel_name}}[fieldName];
			if (value === undefined)
				throw new Error(`Property <${fieldName}> not defined in {{object.name}}`);
			sqlParams.push(value);
		}
		//console.log("SQL request", sqlRequest);
		//console.log("SQL params ", sqlParams);
		const result = await db.query(sqlRequest, sqlParams);
		if (result.code)
			throw new Error(result.code);
		{{object.attributes.camel_name}}.id = result.insertId;
		return {{object.attributes.camel_name}};
	}

}

module.exports = (_db) => {
	db = _db;
	return {{object.attributes.pascal_name}}Model;
}

