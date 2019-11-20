import React from "react";

import BookingItem from "./BookingItem/BookingItem";

import "./BookingList.css";

const BookingList = props => {
	const bookings = props.bookings.map((booking, key) => (
		<BookingItem
			key={booking._id}
			bookingId={booking._id}
			event={booking.event}
			createdAt={booking.createdAt}
			onDelete={props.onDelete}
		/>
	));

	return <ul className="booking__list">{bookings}</ul>;
};

export default BookingList;
