const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent } = require("./merge");

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();

			return events.map(event => transformEvent(event));
		} catch (err) {
			throw err;
		}
	},
	createEvent: async (args, req) => {
		try {
			if (!req.isAuth) throw new Error("Unauthentificated");

			const event = new Event({
				title: args.eventInput.title,
				description: args.eventInput.description,
				price: +args.eventInput.price,
				date: new Date(args.eventInput.date),
				creator: req.userId
			});

			const result = await event.save();

			const createdEvent = transformEvent(result);

			const creator = await User.findById(req.userId);
			if (!creator) {
				throw new Error("User doesn't exists.");
			}

			creator.createdEvents.push(event);
			await creator.save();

			return createdEvent;
		} catch (err) {
			throw err;
		}
	}
};
