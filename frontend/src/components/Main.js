import React from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  onCardLike,
  onCardDelete,
  cards,
  isLikedCard,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="user">
        <div className="user__container">
          <div className="user__avatar-wrap" onClick={onEditAvatar}>
            <img
              className="user__avatar"
              src={currentUser.avatar}
              alt="фото профиля"
            />
          </div>
          <div className="user__container-name-button">
            <h1 className="user__name">{currentUser.name}</h1>
            <button
              className="user__button-edit"
              type="button"
              aria-label="Редактировать профиль"
              onClick={onEditProfile}
            ></button>
          </div>
          <p className="user__about">{currentUser.about}</p>
        </div>
        <button
          className="user__button-add"
          type="button"
          aria-label="Добавить фото"
          onClick={onAddPlace}
        ></button>
      </section>
      <section className="card">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
            isLikedCard={isLikedCard}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
