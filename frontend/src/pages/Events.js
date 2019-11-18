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
						<form>
							<div className="form-control">
								<label htmlFor="title">Title</label>
								<input type="text" id="title"></input>
							</div>
							<div className="form-control">
								<label htmlFor="price">Price</label>
								<input type="number" id="price"></input>
							</div>
							<div className="form-control">
								<label htmlFor="date">Date</label>
								<input type="date" id="date"></input>
							</div>
							<div className="form-control">
								<label htmlFor="description">Description</label>
								<textarea id="description" rows="4" />
							</div>
						</form>
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
