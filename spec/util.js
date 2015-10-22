var _ = require('lodash');

require('winston').level = 'warn';

global.ANY = {};

module.exports = {
	matchers: {
		lastArgsToBe: function() {
			var args = _.toArray(arguments);
			expect(this.actual).toHaveBeenCalled();

			var mrca = this.actual.mostRecentCall.args;

			expect(args.length).toEqual(mrca.length, "Wrong number of args");

			for (var i = 0; i < args.length; i++) {
				var value = args[i];
				if (value === ANY) continue;
				expect(value).toEqual(mrca[i]);
			}

			return true;
		}
	},

	mock: function(klass) {
		var Base = new Function;

		Base.prototype = klass.prototype;

		var mock = new Base;

		var proto = klass.prototype;
		
		for (var name in proto) {
			var value = proto[name];

			// skip private methods / variables
			if (_.startsWith(name, '_')) {
				continue;
			}

			// want to only mock functions
			if (typeof value !== 'function') {
				continue;
			}

			mock[name] = jasmine.createSpy(name);
		}

		return mock;
	}
};
