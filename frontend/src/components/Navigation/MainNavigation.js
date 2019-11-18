import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth-context";

import "./MainNavigation.css";

const mainNavigation = props => (
	<AuthContext.Consumer>
		{context => (
			<header className="main-navigation">
				<div className="main-navigation__logo">
					<h1>EasyEvent</h1>
				</div>
				<div className="main-navigation__items">
					<ul>
						{!context.token && (
							<li>
								<NavLink to="/auth">Authentificate</NavLink>
							</li>
						)}
						<li>
							<NavLink to="/events">Events</NavLink>
						</li>
						{context.token && (
							<Fragment>
								<li>
									<NavLink to="/bookings">Bookings</NavLink>
								</li>
								<li>
									<button onClick={context.logout}>Logout</button>
								</li>
							</Fragment>
						)}
					</ul>
				</div>
			</header>
		)}
	</AuthContext.Consumer>
);

export default mainNavigation;
