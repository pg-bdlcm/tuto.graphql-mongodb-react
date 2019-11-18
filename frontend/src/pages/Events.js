import React, { Fragment, useState } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

import "./Events.css";

function EventsPage() {
	const [creating, setCreating] = useState(false);

	return (
		<Fragment>
			{creating && (
				<Fragment>
					<Backdrop />
					<Modal
						canCancel
						canConfirm
						onCancel={e => setCreating(false)}
						onConfirm={() => console.log("confirm")}
						title="Add Event"
					>
						<p>Modal Content</p>
					</Modal>
				</Fragment>
			)}
			<div className="events-control">
				<p>Share your own Events !</p>
				<button className="btn" onClick={e => setCreating(true)}>
					Create Event
				</button>
			</div>
		</Fragment>
	);
}

export default EventsPage;
