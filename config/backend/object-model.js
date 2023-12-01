'use strict'
var db = null;

class {{object.attributes.pascal_name}}Model {

}

module.exports = (_db) => {
	db = _db;
	return {{object.attributes.pascal_name}}Model;
}

