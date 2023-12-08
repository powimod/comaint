{% render "../../templates/license_header_js.liquid",
		project     : project.attributes.backend_project_name,
  		description : project.attributes.backend_project_description,
		authors     : project.attributes.authors,
		copyright   : project.attributes.copyright,
		filename    : 'view.js'
		%}
'use strict'

class View {
	sendJsonResult(response, data) {
		response.json({ ok : true, data: data })
	}
	sendJsonError(response, error) {
		if (error === undefined) error = 'Unknown error'
		const message = (error.message) ? error.message : error
		response.json({ ok : false, error: message})
	}
}

class ViewSingleton {
	constructor() {
		throw new Error('Can not instanciate singleton object!');
	}
	static getInstance() {
		if (! ViewSingleton.instance)
			ViewSingleton.instance = new View();
		return ViewSingleton.instance;
	}
}

module.exports = ViewSingleton;
