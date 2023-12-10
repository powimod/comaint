{%- assign filename = object.name | kebabCase | append: "-routes.js" -%}
{% render "../../templates/license_header_js.liquid",
		project     : project.attributes.backend_project_name,
  		description : project.attributes.backend_project_description,
		authors     : project.attributes.authors,
		copyright   : project.attributes.copyright,
		filename    : filename 
		%}
'use script';
const assert = require('assert');

module.exports = (app, {{object.name | pascalCase}}Model, View) => {

	app.get('/api/{{project.attributes.api_version}}/{{object.name | snakeCase}}/list', async (request, response) => {
		try {
			let resultsPerPage = request.query.resultsPerPage;
			let offset = request.query.offset;
			const {{object.name | camelCase}}List = await {{object.name | pascalCase}}Model.get{{object.name | pascalCase}}List({
				resultsPerPage : resultsPerPage,
				offset : offset
			});
			View.sendJsonResult(response, { {{object.name | camelCase}}List: {{object.name | camelCase}}List } );
		}
		catch (error) {
			View.sendJsonError(response, error);
		}
	});

	app.get('/api/{{project.attributes.api_version}}/{{object.name | snakeCase}}/:id{{object.name | pascalCase}}', async (request, response) => {
		const id{{object.name | pascalCase}} = request.params.id{{object.name | pascalCase}};
		assert (id{{object.name | pascalCase}} !== undefined);
		if (isNaN(id{{object.name | pascalCase}})) {
			View.sendJsonError(response, `{{object.name | pascalCase}} ID <${id{{object.name | pascalCase}}}> is not a number`);
			return;
		}
		// try { // TODO reactivate this
			let resultsPerPage = request.query.resultsPerPage;
			let offset = request.query.offset;
			const {{object.name | camelCase}} = await {{object.name | pascalCase}}Model.get{{object.name | pascalCase}}ById(id{{object.name | pascalCase}});
			View.sendJsonResult(response, { {{object.name | camelCase}}: {{object.name | camelCase}}} );
		//}
		//catch (error) {
		//	View.sendJsonError(response, error);
		//}
	});

	app.post('/api/{{project.attributes.api_version}}/{{object.name | snakeCase}}/create', async (request, response) => {
		try {
			const {{object.name | camelCase}} = request.body.{{object.name | camelCase}};
			if ({{object.name | camelCase}} === undefined)
				throw new Error(`Can't find <{{object.name | camelCase}}> object in request body`);
			let new{{object.name | pascalCase}} = await {{object.name | pascalCase}}Model.create{{object.name | pascalCase}}({{object.name | camelCase}});
			if (new{{object.name | pascalCase}}.id === undefined)
				throw new Error(`Can't find ID of newly created {{object.name | pascalCase}}`);
			response.json({ ok: true, {{object.name | camelCase}} : new{{object.name | pascalCase}} });
		}
		catch (error) {
			const errorMessage = (error.message !== undefined) ? error.message : error;
			response.json({ ok : false, error: errorMessage  });
		}
	});

}

