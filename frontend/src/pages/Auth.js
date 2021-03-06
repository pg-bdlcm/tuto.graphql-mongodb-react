import React, { useState } from "react";

import AuthContext from "../context/auth-context";

import "./Auth.css";

function AuthPage() {
	const [isLogin, setisLogin] = useState(true);

	const Auth = React.useContext(AuthContext);

	const emailRef = React.createRef();
	const passwordRef = React.createRef();

	const submitHandler = event => {
		event.preventDefault();

		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		if (email.trim().length === 0 || password.trim().length === 0) return;

		/**  */
		let requestBody = {
			query: `
            query Login($email: String!, $password: String!) {
                login(email: $email, password: $password){
                    userId
                    token
                    tokenExpiration
                }
            }
            `,
			variables: {
				password,
				email
			}
		};

		if (!isLogin)
			requestBody = {
				query: `
            mutation CreateUser($email: String!, $password: String!) {
                createUser(userInput: {
                    email: $email
                    password: $password
                }){
                    _id
                    email
                }
            }
			`,
				variables: {
					password,
					email
				}
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
				if (data.data.login.token) {
					Auth.login(
						data.data.login.token,
						data.data.login.userId,
						data.data.login.tokenExpiration
					);
				}
			})
			.catch(err => console.log(err));
	};

	return (
		<form className="auth-form" onSubmit={submitHandler}>
			<div className="form-control">
				<label htmlFor="emailRef">E-Mail</label>
				<input type="email" id="emailRef" ref={emailRef}></input>
			</div>
			<div className="form-control">
				<label htmlFor="passwordRef">passwordRef</label>
				<input type="password" id="passwordRef" ref={passwordRef}></input>
			</div>
			<div className="form-actions">
				<button type="button" onClick={() => setisLogin(!isLogin)}>
					Switch to {isLogin ? "SignUp" : "Login"}
				</button>
				<button type="submit">Submit</button>
			</div>
		</form>
	);
}

export default AuthPage;
