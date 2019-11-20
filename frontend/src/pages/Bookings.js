import React, { useState, useEffect } from "react";

import Spinner from "../components/Spinner/Spinner";

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
				const bookings = data.data.bookings;
				setBookings(bookings);
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
			{!isLoading && (
				<ul>
					{bookings.map((booking, key) => (
						<div>
							{booking.event.title} -{" "}
							{new Date(booking.createdAt).toLocaleDateString()}
						</div>
					))}
				</ul>
			)}
		</React.Fragment>
	);
}

export default BookingsPage;
