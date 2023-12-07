'use script';

module.exports = (app, {{object.name | pascalCase}}Model, View) => {

	app.get('/api/{{project.attributes.api_version}}/{{object.name | snakeCase}}/list', async (request, response) => {
		try {
			const {{object.name | camelCase}}List = await {{object.name | pascalCase}}Model.get{{object.name | pascalCase}}List();
			View.sendJsonResult(response, { {{object.name | camelCase}}List: {{object.name | camelCase}}List } );
		}
		catch (error) {
			View.sendJsonError(response, error);
		}
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

