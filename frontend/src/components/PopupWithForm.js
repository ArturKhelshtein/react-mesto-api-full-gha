import React from 'react';
import usePopupClose from '../hooks/usePopupClose';

function PopupWithForm({
  name,
  title,
  buttonName,
  isOpen,
  onClose,
  children,
  onSubmit,
}) {
  usePopupClose(isOpen, onClose);

  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`} id={name}>
      <div className="popup__container">
        <button
          className="popup__button-close"
          type="button"
          aria-label="Закрыть попап"
          onClick={onClose}
        />
        <h3 className="popup__heading">{title}</h3>
        <form
          className="popup__form"
          name={`popoup-${name}-input-form`}
          onSubmit={onSubmit}
          //noValidate
        >
          {children}
          <button
            className="popup__button-save popup__button-save_state_disable"
            type="submit"
            aria-label="Сохранить изменения"
          >
            {buttonName}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
