import React, { useState, useEffect } from "react";

import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/BookingList";

import AuthContext from "../context/auth-context";

function BookingsPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [bookings, setBookings] = useState([]);

	const Auth = React.useContext(AuthContext);

	const fetchBookings = () => {
		setIsLoading(true);
		/** GraphQL */
		const requestBody = {
			query: `
				query {
						bookings
						{
								_id
								createdAt
								event {
									_id
									title
									date
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
				setBookings(data.data.bookings);
				setIsLoading(false);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const onDelete = bookingId => {
		setIsLoading(true);
		/** GraphQL */
		const requestBody = {
			query: `
				mutation CancelBooking($id: ID!) {
					cancelBooking(bookingId: $id)
						{
							_id
							title
						}
				}
				`,
			variables: {
				id: bookingId
			}
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
			.then(() => {
				setBookings(bookings.filter(f => f._id !== bookingId));
				setIsLoading(false);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	};

	useEffect(() => {
		fetchBookings();
	}, []);

	return (
		<React.Fragment>
			{isLoading && <Spinner />}
			{!isLoading && <BookingList bookings={bookings} onDelete={onDelete} />}
		</React.Fragment>
	);
}

export default BookingsPage;
