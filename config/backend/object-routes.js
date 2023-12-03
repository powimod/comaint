'use script';

module.exports = (app, {{object.attributes.pascal_name}}Model, View) => {

	app.get('/api/{{project.attributes.api_version}}/{{object.attributes.snake_name}}/list', async (request, response) => {
		//try { TODO à réactiver
			const {{object.attributes.camel_name}}List = await {{object.attributes.pascal_name}}Model.get{{object.attributes.pascal_name}}List();
			View.sendJsonResult(response, { {{object.attributes.camel_name}}List: {{object.attributes.camel_name}}List } );
		//}
		//catch (error) {
		//	View.sendJsonError(response, error);
		//}
	});

}

