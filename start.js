
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var yaml = require('js-yaml');
var morgan = require('morgan');
var assert = require('assert');
var logger = require('winston');
var request = require('request');
var express = require('express');
var csvParser = require('csv-parse');

var defaultCustomConfig = "./local-config.yaml";

var argv = require('yargs').
	option('config', { describe: "Custom config", default: defaultCustomConfig, alias: "c" }).
	option('loglevel', { describe: "Log level", default: "silly", alias: "l", choices: _.keys(logger.levels) }).
	wrap(120).strict().argv;

logger.level = argv.loglevel;

var lib = require('./lib');

var config = yaml.safeLoad(fs.readFileSync('./config.yaml'));

if (fs.existsSync(argv.config)) {
	var localConfig = yaml.safeLoad(fs.readFileSync(argv.config));
	_.merge(config, localConfig);
} else if (argv.config != defaultCustomConfig) {
	logger.error("Custom config path: " + argv.config + " provided, but file is missing");
}

assert(config.shops.length > 0, "Can't work with no shop definitions");

var browser = request.defaults({
	timeout: config.timeout * 1000,
	headers: {
		'User-Agent': config.ua
	}
});

var shopClients = _.indexBy(config.shops, 'shopname');

shopClients = _.mapValues(shopClients, function(shopConfig) {
	var parser = new lib.Parser(csvParser, _.pick(shopConfig, ['product_id_column', 'price_column', 'delimiter']));
	return new lib.ShopClient(browser, parser, _.pick(shopConfig, 'url'));
});

var productFetcher = new lib.ProductFetcher(shopClients);

var app = express();

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :remote-addr'));

var server = new lib.Server();
app.get('/', server.getProduct(productFetcher));
app.get('/refresh', server.getRefresh(productFetcher));

async.series([
	productFetcher.refresh.bind(productFetcher),
	app.listen.bind(app, config.port, config.host)
], function(err) {
	if (err) throw err;

	logger.verbose("Server started at", config.host, ":", config.port);
});

