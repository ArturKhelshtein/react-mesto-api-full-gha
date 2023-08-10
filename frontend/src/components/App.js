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
  const [isSucessedRegistration, setIsSucessedRegistration] =
    React.useState(false);

  /*состояния открыия попапов*/
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);

  const [isLoggedIn, setLoggedIn] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isSelectedCard, setSelectedCard] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) {
      api
        .getAppInfo()
        .then((result) => {
          const [currentUser, card] = result;
          setCurrentUser(currentUser.data);
          setCards(card.data.reverse());
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
  function isLikedCard(card) {
    return card.likes.some((like) => like._id === currentUser._id);
  }

  function handleCardLike(card) {
    api
      .changeLikeCardStatus({ id: card._id, isLiked: isLikedCard(card) })
      .then((newCard) =>
        setCards((state) =>
          state.map((everyCard) =>
            everyCard._id === card._id ? newCard.data : everyCard
          )
        )
      )
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
  function handleUpdateUser(data) {
    function makeRequest() {
      return api
        .updateUserInfo({ name: data.name, about: data.about })
        .then((updateUser) => setCurrentUser(updateUser.data));
    }
    handleSubmit(makeRequest);
  }
  function handleUpdateAvatar(avatar) {
    function makeRequest() {
      return api
        .updateUserAvatar(avatar.link)
        .then((updateUser) => setCurrentUser(updateUser.data));
    }
    handleSubmit(makeRequest);
  }
  function handleCreateCard({ name, link }) {
    function makeRequest() {
      return api.addCard({ name, link }).then((newCard) => {
        return setCards([newCard.data, ...cards]);
      });
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
    apiAuth
      .authorize({ email, password })
      .then((data) => {
        apiAuth.getContent(data.user).then((data) => setCurrentUser(data));
        navigate('/', { replace: true });
        setLoggedIn(true);
      })
      .catch((error) => {
        setIsTooltipOpen(true);
        setIsSucessedRegistration(false);
        console.error(`Ошибка при входе пользователя: ${error}`);
      });
  }
  function handleLogoutSubmit() {
    apiAuth
      .logout()
      .then(() => {
        navigate('/signin', { replace: true });
        setLoggedIn(false);
      })
      .catch((error) => {
        setIsTooltipOpen(true);
        console.error(`Ошибка при выходе пользователя: ${error}`);
      });
  }

  const checkToken = () => {
    apiAuth
      .getContent()
      .then((data) => {
        if (!data) {
          return;
        }
        setCurrentUser(data);
        setLoggedIn(true);
        navigate('/');
      })
      .catch((error) => {
        setLoggedIn(false);
        setCurrentUser({});
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
            <Header
              userEmail={currentUser?.email}
              handleLogoutSubmit={handleLogoutSubmit}
            />
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
                    isLikedCard={isLikedCard}
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
              onSubmit={handleCreateCard}
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
