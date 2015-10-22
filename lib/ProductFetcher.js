
var _ = require('lodash');
var async = require('async');
var logger = require('winston');

module.exports = ProductFetcher;

function ProductFetcher(shopClients) {
	this.shopClients = shopClients;
	this.cache = {};
}

ProductFetcher.prototype.getProduct = function(shopCode, productId, cb) {
	if (! (shopCode in this.cache)) {
		return cb("Unknown shop code. Available: " + _.keys(this.shopClients).join(", "));
	}

	var cache = this.cache[shopCode];

	if (! (productId in cache)) {
		return cb("Unknown product id");
	}

	return cb(null, cache[productId]);
};

ProductFetcher.prototype.refresh = function(cb) {
	async.each(Object.keys(this.shopClients), this._refreshData.bind(this), cb)
};

ProductFetcher.prototype._refreshData = function(shopCode, cb) {
	var client = this.shopClients[shopCode];

	var start = Date.now();

	client.fetch(function(err, data) {
		if (err) {
			return cb("Could not refresh data from: " + shopCode + ": " + err);
		}

		logger.verbose("Fetched " + _.size(data) + " rows from " + shopCode + " in " + (Date.now() - start) + " ms");

		this.cache[shopCode] = data;

		cb();
	}.bind(this));
};
