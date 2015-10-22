
module.exports = ShopClient;

function ShopClient(request, parser, config) {
	this.request = request;
	this.parser = parser;
	this.config = config;
}

ShopClient.prototype.fetch = function(cb) {
	this.request(this.config.url, function(e, r, body) {
		if (e) return cb(e);
		if (r.statusCode !== 200) return cb("Bad status code: "+ r.statusCode);

		this.parser.parse(body, cb);
	}.bind(this));
};
