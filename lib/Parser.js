var _ = require('lodash');
var assert = require('assert');

module.exports = Parser;

function Parser(csvParser, config) {
	assert('delimiter' in config);
	assert('product_id_column' in config);
	assert('price_column' in config);

	this.csvParser = csvParser;
	this.config = config;
}

Parser.prototype.parse = function(body, cb) {
	var options = {
		delimiter: this.config.delimiter || ";",
		columns: true,
		quote: ''
	};

	this.csvParser(body, options, function(err, rows) {
		if (err) return cb(err);

		rows = _.chain(rows).indexBy(this.config.product_id_column).mapValues(this.config.price_column).value();

		cb(null, rows);
	}.bind(this));
};