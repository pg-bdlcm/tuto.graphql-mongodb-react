const EVENTS_RESOLVER = require("./events");
const AUTH_RESOLVER = require("./auth");
const BOOKING_RESOLVER = require("./booking");

const rootResolver = {
	...AUTH_RESOLVER,
	...EVENTS_RESOLVER,
	...BOOKING_RESOLVER
};

module.exports = rootResolver;
