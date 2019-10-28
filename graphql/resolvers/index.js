const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });

    return events.map(event => ({ ...event._doc, creator: user.bind(this, event._doc.creator) }));
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);

    return { ...user._doc, password: null, createdEvents: events.bind(this, user._doc.createdEvents) };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map(event => ({
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator)
      }));
    } catch (err) {
      throw err;
    }
  },
  createEvent: async args => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "5db70c82d090f1d0a054cc94"
      });

      const result = event.save();

      const createdEvent = {
        ...result._doc,
        date: new Date(result._doc.date).toISOString(),
        creator: creator.bind(this, result._doc.creator)
      };
      const creator = await User.findById("5db70c82d090f1d0a054cc94");
      if (!creator) {
        throw new Error("User doesn't exists.");
      }

      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });

      if (existingUser) {
        throw new Error("User exists already.");
      }

      const hashedPassword = bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const userSaveResult = await user.save();

      return { ...userSaveResult._doc, password: null };
    } catch (err) {
      throw err;
    }
  }
};