
var logger = require('winston');

module.exports = Server;

function Server() {}

Server.prototype.getProduct = function(productFetcher) {
	return function(req, res) {
		var pid = req.query.product_id;
		var shop = req.query.shop;

		productFetcher.getProduct(shop, pid, function(error, price) {
			if (error) {
				logger.verbose("Could not get product "+shop+" "+pid, error);
				res.status(404).json({error: error});
			} else {
				var response = {};
				response[pid] = price;
				res.status(200).json(response);
			}
		});
	};
};

Server.prototype.getRefresh = function(productFetcher) {
	return function(req, res) {
		productFetcher.refresh(function(error) {
			if (error) {
				logger.warn("Could not refresh", error);
				res.status(500).json({error: error});
			} else {
				res.status(200).json({});
			}
		});
	};
};
