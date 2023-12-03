'use strict'
var db = null;

class {{object.attributes.pascal_name}}Model {

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


}

module.exports = (_db) => {
	db = _db;
	return {{object.attributes.pascal_name}}Model;
}

