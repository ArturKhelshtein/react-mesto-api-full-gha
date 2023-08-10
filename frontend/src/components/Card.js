import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete, isLikedCard }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwner = card.owner._id === currentUser._id;
  const isLiked = isLikedCard(card);

  function handleClick() {
    onCardClick(card);
  }

  function handleClickLike() {
    onCardLike(card);
  }

  function handleClickDelete() {
    onCardDelete(card);
  }

  return (
    <article className="card__container">
      {isOwner ? (
        <button
          className="card__trash-bin"
          type="button"
          aria-label="Удалить фото"
          onClick={handleClickDelete}
        ></button>
      ) : (
        ''
      ) }
      <img
        className="card__img"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      <h2 className="card__name">{card.name}</h2>
      <div className="card__like-container">
        <button
          className={`card__like-button ${
            isLiked ? 'card__like-button_active' : ''
          }`}
          onClick={handleClickLike}
          type="button"
          aria-label="Добавить в избранное"
        ></button>
        <div className="card__liked">{card.likes.length}</div>
      </div>
    </article>
  );
}
export default Card;
