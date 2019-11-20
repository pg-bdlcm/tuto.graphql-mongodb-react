import React from "react";

import EventItem from "./EventItem/EventItem";

import "./EventList.css";

const EventList = props => {
	const events = props.events.map((event, key) => (
		<EventItem
			key={event._id}
			eventId={event._id}
			title={event.title}
			creator={event.creator}
			price={event.price}
			date={event.date}
			onDetail={props.onViewDetail}
		/>
	));

	return <ul className="event__list">{events}</ul>;
};

export default EventList;
