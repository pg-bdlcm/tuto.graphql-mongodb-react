import React from "react";

import AuthContext from "../../../../context/auth-context";

import "./EventItem.css";

const EventItem = props => {
	const Auth = React.useContext(AuthContext);

	return (
		<li key={props.eventId} className="events__list-item">
			<div>
				<h1>{props.title}</h1>
				<h2>
					${props.price} - {new Date(props.date).toLocaleDateString()}
				</h2>
			</div>
			<div>
				<button
					className="btn"
					onClick={props.onDetail.bind(this, props.eventId)}
				>
					View Details
				</button>

				{Auth.userId === props.creator._id && (
					<p>Your the ownner of this event</p>
				)}
			</div>
		</li>
	);
};

export default EventItem;
