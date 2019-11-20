import React from "react";

import "./BookingItem.css";

const BookingItem = props => {
	return (
		<li key={props.bookingId} className="bookings__item">
			<div className="bookings__item-data">
				{props.event.title}-{new Date(props.createdAt).toLocaleDateString()}
			</div>
			<div className="bookings__item-actions">
				<button
					className="btn"
					onClick={props.onDelete.bind(this, props.bookingId)}
				>
					Cancel
				</button>
			</div>
		</li>
	);
};

export default BookingItem;
