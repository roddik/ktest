var util = require('./util');
var lib = require('../lib');

describe('Parser', function() {
	var csvParser, config, parser, body, cb;

	var makeRow = function(id, price, junk) {
		return {id: id, price: price, junk: junk};
	};

	beforeEach(function() {
		this.addMatchers(util.matchers);

		body = "testbody";
		cb = jasmine.createSpy();
		csvParser = jasmine.createSpy();
		config = {
			delimiter: "CCCC",
			product_id_column: 'id',
			price_column: 'price'
		};

		parser = new lib.Parser(csvParser, config);
	});

	it('returns parse error', function() {
		parser.parse(body, cb);

		expect(csvParser).lastArgsToBe(body, {
			delimiter: config.delimiter,
			columns: true,
			quote: ''
		}, ANY);

		csvParser.mostRecentCall.args[2]("BAD PARSE");

		expect(cb).lastArgsToBe("BAD PARSE");
	});

	it('parses', function() {
		parser.parse(body, cb);

		csvParser.mostRecentCall.args[2](null, [
			makeRow('123', '333'),
			makeRow('9999', '666')
		]);

		expect(cb).lastArgsToBe(null, {
			123: '333',
			9999: '666'
		});
	});
});

