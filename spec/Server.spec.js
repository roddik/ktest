var util = require('./util');
var lib = require('../lib');

describe('Parser', function() {
	var server, pf, req, res, pid = 'PIDPID', shop = 'fsdfd';

	beforeEach(function() {
		this.addMatchers(util.matchers);

		req = {
			query: {
				product_id: pid,
				shop: shop
			}
		};

		res = {};
		res['json'] = jasmine.createSpy();
		res['status'] = jasmine.createSpy().andReturn(res);

		pf = util.mock(lib.ProductFetcher);

		server = new lib.Server();
	});

	it('refresh - err', function() {
		server.getRefresh(pf)(req, res);

		expect(pf.refresh).toHaveBeenCalled();

		pf.refresh.mostRecentCall.args[0]('err');

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error : 'err' });
	});

	it('refresh - ok', function() {
		server.getRefresh(pf)(req, res);

		pf.refresh.mostRecentCall.args[0](false);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({});
	});

	it('product - error', function() {
		server.getProduct(pf)(req, res);

		expect(pf.getProduct).lastArgsToBe(shop, pid, ANY);

		pf.getProduct.mostRecentCall.args[2]('bad shop');

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error : 'bad shop' });
	});

	it('product - error', function() {
		server.getProduct(pf)(req, res);

		expect(pf.getProduct).lastArgsToBe(shop, pid, ANY);

		pf.getProduct.mostRecentCall.args[2](null, '123');

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ PIDPID : '123' });
	});
});
