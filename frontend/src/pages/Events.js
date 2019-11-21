import React, { Fragment, useState, useEffect } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

import AuthContext from "../context/auth-context";

import "./Events.css";

function EventsPage() {
	const [creating, setCreating] = useState(false);
	const [events, setEvents] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState();

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

		if (
			title.trim().length === 0 ||
			price <= 0 ||
			date.trim().length === 0 ||
			description.trim().length === 0
		)
			return;

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
				if (response.status !== 200 && response.status !== 201)
					throw new Error("Failed");

				return response.json();
			})
			.then(data => {
				setEvents([...events, data.data.createEvent]);
			})
			.catch(err => console.log(err));
	};

	const fetchEvents = () => {
		setIsLoading(true);
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
				if (response.status !== 200 && response.status !== 201)
					throw new Error("Failed");

				return response.json();
			})
			.then(data => {
				const events = data.data.events;
				setEvents(events);
				setIsLoading(false);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const showDetailHandler = eventId => {
		setSelectedEvent(events.find(f => f._id === eventId));
	};

	const bookEventHandler = () => {
		if (!Auth.token) {
			setSelectedEvent(null);
			return;
		}
		setIsLoading(true);
		/** GraphQL */
		const requestBody = {
			query: `
				mutation {
						bookEvent(eventId: "${selectedEvent._id}")
						{
								_id
								createdAt
								updatedAt
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
				if (response.status !== 200 && response.status !== 201)
					throw new Error("Failed");

				return response.json();
			})
			.then(data => {
				setSelectedEvent(null);
				setIsLoading(false);
				console.log(data);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
		setSelectedEvent(null);
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	return (
		<Fragment>
			{creating && (
				<Fragment>
					<Backdrop />
					<Modal
						confirmText="Create"
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
			{selectedEvent && (
				<Fragment>
					<Backdrop />
					<Modal
						confirmText={Auth.token ? "Book" : "Confirm"}
						canCancel
						canConfirm
						onCancel={e => setSelectedEvent(null)}
						onConfirm={bookEventHandler}
						title={selectedEvent.title}
					>
						<h1>{selectedEvent.title}</h1>
						<h2>
							${selectedEvent.price} -{" "}
							{new Date(selectedEvent.date).toLocaleDateString()}
						</h2>
						<p>{selectedEvent.description}</p>
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
			{isLoading && <Spinner />}
			{!isLoading && (
				<EventList events={events} onViewDetail={showDetailHandler} />
			)}
		</Fragment>
	);
}

export default EventsPage;
