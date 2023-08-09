import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { AppContext } from '../contexts/AppContext';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ProtectedRoute from './ProtectedRoute';
import apiAuth from '../utils/apiAuth';
import InfoTooltip from './InfoTooltip';
import Register from './Register';
import Login from './Login';

function App() {
	/*состояние регистрации*/
	const [isLoggedIn, setLoggedIn] = React.useState(null);
	const [userData, setUserData] = React.useState(null);
	const [isSucessedRegistration, setIsSucessedRegistration] =
		React.useState(false);

	/*состояния открыия попапов*/
	const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
	const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
		React.useState(false);
	const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
	const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);

	const [isSelectedCard, setSelectedCard] = React.useState({});
	const [currentUser, setCurrentUser] = React.useState({});
	const [cards, setCards] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(false);

	const navigate = useNavigate();

	React.useEffect(() => {
		if (isLoggedIn) {
		api
			.getAppInfo()
			.then((result) => {
				const [currentUserData, cardData] = result;
				setCurrentUser(currentUserData);
				setCards(cardData);
			})
			.catch((error) =>
				console.error(
					`Ошибка при получении данных пользователя/начального списка карточек: ${error}`
				)
			);
		}
	}, [isLoggedIn]);

	function handleEditAvatarClick() {
		setEditAvatarPopupOpen(true);
	}
	function handleEditProfileClick() {
		setEditProfilePopupOpen(true);
	}
	function handleAddPlaceClick() {
		setAddPlacePopupOpen(true);
	}
	function closeAllPopups() {
		setEditAvatarPopupOpen(false);
		setEditProfilePopupOpen(false);
		setAddPlacePopupOpen(false);
		setIsTooltipOpen(false);
		setSelectedCard({});
	}
	function handleCardClick(card) {
		setSelectedCard(card);
	}
	function handleCardLike(card) {
		const isLiked = card.likes.some((like) => like._id === currentUser._id);

		api
			.changeLikeCardStatus(card._id, !isLiked)
			.then((newCard) => {
				setCards((state) =>
					state.map((c) => (c._id === card._id ? newCard : c))
				);
			})
			.catch((error) =>
				console.error(`Ошибка при установки/снятии лайка: ${error}`)
			);
	}
	function handleCardDelete(card) {
		api
			.deleteCard(card._id)
			.then(() => {
				setCards((state) => state.filter((c) => c._id !== card._id));
			})
			.catch((error) =>
				console.error(`Ошибка при удалении карточки: ${error}`)
			);
	}
	function handleSubmit(request) {
		setIsLoading(true);
		request()
			.then(closeAllPopups)
			.catch(console.error)
			.finally(() => setIsLoading(false));
	}
	function handleUpdateUser(name, about) {
		function makeRequest() {
			return api
				.updateUserInfo(name, about)
				.then((data) => setCurrentUser(data));
		}
		handleSubmit(makeRequest);
	}
	function handleUpdateAvatar(avatar) {
		function makeRequest() {
			return api
				.updateUserAvatar(avatar.link)
				.then((avatar) => setCurrentUser(avatar));
		}
		handleSubmit(makeRequest);
	}
	function handleAddPlace({ name, link }) {
		function makeRequest() {
			return api
				.addCard({ name, link })
				.then((newCard) => setCards([newCard, ...cards]));
		}
		handleSubmit(makeRequest);
	}
	function handleRegisterSubmit({ email, password }) {
		apiAuth
			.register({ email, password })
			.then(() => {
				navigate('/signin', { replace: true });
				setIsSucessedRegistration(true);
			})
			.catch((error) => {
				setIsSucessedRegistration(false);
				console.error(`Ошибка при регистрации пользователя: ${error}`);
			})
			.finally(() => setIsTooltipOpen(true));
	}
	function handleLoginSubmit({ email, password }) {
		setLoggedIn(true);

		apiAuth
			.authorize({ email, password })
			.then((data) => {
				localStorage.setItem('token', data.token);
				apiAuth.getContent(data.token).then((data) => setUserData(data));
				navigate('/', { replace: true });
			})
			.catch((error) => {
				setIsTooltipOpen(true);
				setIsSucessedRegistration(false);
				console.error(`Ошибка при входе пользователя: ${error}`);
			});
	}

	const checkToken = () => {
		const token = localStorage.getItem('token');
		apiAuth
			.getContent(token)
			.then((data) => {
				if (!data) {
					return;
				}
				setUserData(data);
				setLoggedIn(true);
				navigate('/');
			})
			.catch((error) => {
				setLoggedIn(false);
				setUserData(null);
				console.error(`Ошибка при проверке токена пользователя: ${error}`);
			});
	};

	React.useEffect(() => {
		checkToken();
		// eslint-disable-next-line
	}, []);

	return (
		<AppContext.Provider value={{ isLoading, closeAllPopups }}>
			<CurrentUserContext.Provider value={currentUser}>
				<div className="root">
					<div className="page">
						<Header userEmail={userData?.data.email} isLoggedIn={isLoggedIn} />
						<InfoTooltip />
						<Routes>
							<Route
								path="/signup"
								element={
									<Register
										onSubmit={handleRegisterSubmit}
										title="Регистрация"
										buttonName="Зарегистрироваться"
										linkText="Уже зарегестрированы? Войти"
										linkTo="/signin"
									/>
								}
							/>
							<Route
								path="/signin"
								element={
									<Login
										onSubmit={handleLoginSubmit}
										title="Вход"
										buttonName="Войти"
									/>
								}
							/>
							<Route
								path="*"
								element={
									<ProtectedRoute
										isLoggedIn={isLoggedIn}
										element={Main}
										onEditAvatar={handleEditAvatarClick}
										onEditProfile={handleEditProfileClick}
										onAddPlace={handleAddPlaceClick}
										onCardClick={handleCardClick}
										onCardLike={handleCardLike}
										onCardDelete={handleCardDelete}
										cards={cards}
									/>
								}
							/>
						</Routes>
						<Footer />

						<EditAvatarPopup
							isOpen={isEditAvatarPopupOpen}
							onSubmit={handleUpdateAvatar}
						/>

						<EditProfilePopup
							isOpen={isEditProfilePopupOpen}
							onSubmit={handleUpdateUser}
						/>

						<AddPlacePopup
							isOpen={isAddPlacePopupOpen}
							onClose={closeAllPopups}
							onSubmit={handleAddPlace}
							isLoading={isLoading}
						/>

						<InfoTooltip
							isSucessed={isSucessedRegistration}
							isOpen={isTooltipOpen}
							onClose={closeAllPopups}
						/>

						{/* <ConfirmPopup
							name="submit"
							title="Вы уверены?"
							buttonName="Да"
							isOpen={false}
						/> */}

						<ImagePopup card={isSelectedCard} onClose={closeAllPopups} />
					</div>
				</div>
			</CurrentUserContext.Provider>
		</AppContext.Provider>
	);
}

export default App;