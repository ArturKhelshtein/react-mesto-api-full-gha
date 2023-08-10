import React from 'react';
import usePopupClose from '../hooks/usePopupClose';
import iconSuccess from '../images/CloseIcon-Success .svg';
import iconFail from '../images/CloseIcon-Fail.svg';

function InfoTooltip({ isSucessed, isOpen, onClose }) {
  usePopupClose(isOpen, onClose);

  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container popup__container_type_info-tooltip">
        <button
          className="popup__button-close"
          type="button"
          aria-label="Закрыть попап"
          onClick={onClose}
        />
        <img
          className="popup__icon"
          src={isSucessed ? iconSuccess : iconFail}
          alt={`иконка ${
            isSucessed ? 'успешной' : 'неудачной'
          } регистрации на сайте`}
        />
        <h3 className="popup__heading popup__heading_type_info-tooltip">
          {isSucessed
            ? `Вы успешно зарегистрировались!`
            : `Что-то пошло не так!
Попробуйте ещё раз.`}
        </h3>
      </div>
    </div>
  );
}

export default InfoTooltip;
