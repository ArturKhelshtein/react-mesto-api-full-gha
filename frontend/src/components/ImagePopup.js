import React from 'react';
import usePopupClose from '../hooks/usePopupClose';

function ImagePopup(props) {
  usePopupClose(props.card?.link, props.onClose);

  return (
    <div
      className={`popup popup_dark ${props.card.name ? 'popup_opened' : ''}`}
      id="card-large-format"
    >
      <div className="popup__card-large-format">
        <button
          className="popup__button-close"
          type="button"
          aria-label="Закрыть окно изображения"
          onClick={props.onClose}
        ></button>
        <figure className="popup__card-container">
          <img
            className="popup__card-img"
            src={props.card.link}
            alt={props.card.name}
          />
          <figcaption className="popup__card-name">
            {props.card.name}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
export default ImagePopup;
