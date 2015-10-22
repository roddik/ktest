var util = require('./util');
var lib = require('../lib');

describe('Parser', function() {
	var pf, shopClients, cb, sc1, sc2;

	beforeEach(function() {
		this.addMatchers(util.matchers);

		cb = jasmine.createSpy();

		sc1 = util.mock(lib.ShopClient);
		sc2 = util.mock(lib.ShopClient);

		shopClients = {
			one: sc1,
			two: sc2
		};

		pf = new lib.ProductFetcher(shopClients);
	});

	it('refreshes data - err', function() {
		pf.refresh(cb);

		expect(sc1.fetch).toHaveBeenCalled();
		expect(sc2.fetch).toHaveBeenCalled();

		expect(cb).not.toHaveBeenCalled();

		sc1.fetch.mostRecentCall.args[0]('err');

		expect(cb).toHaveBeenCalledWith('Could not refresh data from: one: err');
	});

	it('refreshes data, gives results', function() {
		pf.refresh(cb);

		sc1.fetch.mostRecentCall.args[0](null, {
			'one1': 'zzzz',
			'one2': 'vvvv'
		});

		sc2.fetch.mostRecentCall.args[0](null, {
			'two1': 'jjjj',
			'two2': ',,,,'
		});

		expect(cb).toHaveBeenCalledWith(null);

		pf.getProduct('weird', '123', cb);
		expect(cb).toHaveBeenCalledWith('Unknown shop code. Available: one, two');

		pf.getProduct('one', 'weird', cb);
		expect(cb).toHaveBeenCalledWith('Unknown product id');

		pf.getProduct('two', 'two1', cb);
		expect(cb).toHaveBeenCalledWith(null, 'jjjj');
	});
});
