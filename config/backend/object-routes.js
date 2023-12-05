'use script';

module.exports = (app, {{object.attributes.pascal_name}}Model, View) => {

	app.get('/api/{{project.attributes.api_version}}/{{object.attributes.snake_name}}/list', async (request, response) => {
		try {
			const {{object.attributes.camel_name}}List = await {{object.attributes.pascal_name}}Model.get{{object.attributes.pascal_name}}List();
			View.sendJsonResult(response, { {{object.attributes.camel_name}}List: {{object.attributes.camel_name}}List } );
		}
		catch (error) {
			View.sendJsonError(response, error);
		}
	});

	app.post('/api/{{project.attributes.api_version}}/{{object.attributes.snake_name}}/create', async (request, response) => {
		try {
			const {{object.attributes.camel_name}} = request.body.{{object.attributes.camel_name}};
			if ({{object.attributes.camel_name}} === undefined)
				throw new Error(`Can't find <{{object.attributes.camel_name}}> object in request body`);
			let new{{object.attributes.pascal_name}} = await {{object.attributes.pascal_name}}Model.createCompany({{object.attributes.camel_name}});
			if (new{{object.attributes.pascal_name}}.id === undefined)
				throw new Error(`Can't find ID of newly created {{object.attributes.pascal_name}}`);
			response.json({ ok: true, {{object.attributes.camel_name}} : new{{object.attributes.pascal_name}} });
		}
		catch (error) {
			const errorMessage = (error.message !== undefined) ? error.message : error;
			response.json({ ok : false, error: errorMessage  });
		}
	});

}

