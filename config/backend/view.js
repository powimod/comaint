'use strict'

var param = null;

class View {
	static sendJsonResult(response, data) {
		response.json({ ok : true, data: data })
	}
	static sendJsonError(response, error) {
		if (error === undefined) error = 'Unknown error'
		const message = (error.message) ? error.message : error
		response.json({ ok : false, error: message})
	}
}

module.exports = (_param) => {
	param = _param
	return View
};
