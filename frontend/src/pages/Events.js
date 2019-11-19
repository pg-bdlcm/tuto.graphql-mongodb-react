import React, { Fragment, useState, useEffect } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

import AuthContext from "../context/auth-context";

import "./Events.css";

function EventsPage() {
	const [creating, setCreating] = useState(false);
	const [events, setEvents] = useState([]);

	const Auth = React.useContext(AuthContext);

	const titleElRef = React.createRef();
	const priceElRef = React.createRef();
	const dateElRef = React.createRef();
	const descriptionElRef = React.createRef();

	const modalConfirmHandler = () => {
		setCreating(false);

		const title = titleElRef.current.value;
		const price = +priceElRef.current.value;
		const date = dateElRef.current.value;
		const description = descriptionElRef.current.value;

		if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) return;

		const event = { title, price, date, description };
		console.log(event);

		/** GraphQL */
		const requestBody = {
			query: `
            mutation{
								createEvent(eventInput: { title: "${title}",price: ${price},date: "${date}",description: "${description}"})
								{
                    _id
										title
										description
										price
										date
										creator {
											_id
											email
										}
                }
            }
            `
		};

		fetch("http://localhost:4000/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${Auth.token}`
			}
		})
			.then(response => {
				if (response.status !== 200 && response.status !== 201) throw new Error("Failed");

				return response.json();
			})
			.then(data => {
				console.log(data);
				fetchEvents();
			})
			.catch(err => console.log(err));
	};

	const fetchEvents = () => {
		/** GraphQL */
		const requestBody = {
			query: `
				query {
						events
						{
								_id
								title
								description
								price
								date
								creator {
									_id
									email
								}
						}
				}
				`
		};

		fetch("http://localhost:4000/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (response.status !== 200 && response.status !== 201) throw new Error("Failed");

				return response.json();
			})
			.then(data => {
				const events = data.data.events;
				setEvents(events);
			})
			.catch(err => console.log(err));
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	const eventList = events.map((elt, key) => (
		<li key={key} className="events__list-item">
			{elt.title}
		</li>
	));

	return (
		<Fragment>
			{creating && (
				<Fragment>
					<Backdrop />
					<Modal
						canCancel
						canConfirm
						onCancel={e => setCreating(false)}
						onConfirm={modalConfirmHandler}
						title="Add Event"
					>
						<form>
							<div className="form-control">
								<label htmlFor="title">Title</label>
								<input type="text" id="title" ref={titleElRef} />
							</div>
							<div className="form-control">
								<label htmlFor="price">Price</label>
								<input type="number" id="price" ref={priceElRef} />
							</div>
							<div className="form-control">
								<label htmlFor="date">Date</label>
								<input type="datetime-local" id="date" ref={dateElRef} />
							</div>
							<div className="form-control">
								<label htmlFor="description">Description</label>
								<textarea id="description" rows="4" ref={descriptionElRef} />
							</div>
						</form>
					</Modal>
				</Fragment>
			)}
			{Auth.token && (
				<div className="events-control">
					<p>Share your own Events !</p>
					<button className="btn" onClick={e => setCreating(true)}>
						Create Event
					</button>
				</div>
			)}
			<section className="events__list">{eventList}</section>
		</Fragment>
	);
}

export default EventsPage;
