import React from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import logo from '../images/logo/logo__Mesto_white.svg';

function Header({ userEmail }) {
	const [isWrapped, setIsWrapped] = React.useState(false);
	const navigate = useNavigate();

	function signOut() {
		localStorage.removeItem('token');
		navigate('/signin');
		setIsWrapped(false);
	}

	function handleWrappedBurger() {
		return isWrapped === false ? setIsWrapped(true) : setIsWrapped(false);
	}

	return (
		<>
			<Routes>
				<Route
					exact
					path="/"
					element={
						<div
							className={`navbar__container_type_mobile ${
								isWrapped ? 'navbar__container_type_mobile-unwrapped' : ''
							}`}
						>
							<p className="navbar__user-email">{userEmail}</p>
							<button
								className="navbar__button navbar__button_shadow"
								onClick={signOut}
							>
								Выйти
							</button>
						</div>
					}
				></Route>
			</Routes>
			<header className="header">
				<Link to="/" className="header__logo-container">
					<img src={logo} alt="лого" className="header__logo-img" />
				</Link>

				<div className="navbar">
					<Routes>
						<Route
							exact
							path="/"
							element={
								<>
									<div className="navbar__container_type_desktop">
										<p className="navbar__user-email">{userEmail}</p>
										<button
											className="navbar__button navbar__button_shadow"
											onClick={signOut}
										>
											Выйти
										</button>
									</div>
									<input
										type="checkbox"
										id="navbar__toggle"
										className="navbar__toggle"
										onChange={handleWrappedBurger}
										checked={isWrapped}
									></input>
									<label
										htmlFor="navbar__toggle"
										className="navbar__burger"
									></label>
								</>
							}
						/>
						<Route
							path="/signup"
							element={
								<Link to="/signin" className="navbar__button">
									Войти
								</Link>
							}
						/>
						<Route
							path="/signin"
							element={
								<Link to="/signup" className="navbar__button">
									Регистрация
								</Link>
							}
						></Route>
					</Routes>
				</div>
			</header>
		</>
	);
}

export default Header;

/*вариант через const location = useLocation()*/
// <div className='navbar'>
// 	{location.pathname === "/" && <p className='navbar__user-email'>{userEmail}</p>}
// 	{location.pathname === "/" && <button className='navbar__button navbar__button_shadow' onClick={signOut}>Выйти</button> }
// 	{location.pathname === "/signup" && <Link to="/signin" className='navbar__button'>Войти</Link> }
// 	{location.pathname === "/signin" && <Link to="/signup" className='navbar__button'>Регистрация</Link> }
// </div>
