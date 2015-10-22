var util = require('./util');
var lib = require('../lib');

describe('ShopClient', function() {
	var sc, request, parser, config, cb;

	beforeEach(function() {
		this.addMatchers(util.matchers);

		cb = jasmine.createSpy();
		request = jasmine.createSpy();
		parser = util.mock(lib.Parser);
		config = {
			url: 'fasdfasdf'
		};

		sc = new lib.ShopClient(request, parser, config);
	});

	it('fetches - err', function() {
		sc.fetch(cb);
		
		expect(request).lastArgsToBe(config.url, ANY);

		request.mostRecentCall.args[1]('err');

		expect(cb).toHaveBeenCalledWith('err');
	});

	it('fetches - bad status', function() {
		sc.fetch(cb);

		request.mostRecentCall.args[1](null, {statusCode: 500});

		expect(cb).toHaveBeenCalledWith('Bad status code: 500');
	});

	it('fetches - good', function() {
		sc.fetch(cb);

		var body = 'f32k049f3k49f';

		request.mostRecentCall.args[1](null, {statusCode: 200}, body);

		expect(parser.parse).lastArgsToBe(body, cb);
	});
});
