import React from 'react';
import PopupWithForm from './PopupWithForm';
import { AppContext } from '../contexts/AppContext';

function EditAvatarPopup({ isOpen, onSubmit }) {
  const { isLoading, closeAllPopups: onClose } = React.useContext(AppContext);
  const avatarLink = React.useRef();

  React.useEffect(() => {
    avatarLink.current.value = '';
  }, [isOpen]);

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      link: avatarLink.current.value,
    });
  }

  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      buttonName={isLoading ? 'Сохранение...' : 'Сохранить'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="popup__input-container">
        <input
          className="popup__input popup__input_value_avatar-img-url"
          type="url"
          name="link"
          placeholder="Ссылка на картинку"
          ref={avatarLink || ''}
          required
        />
        <span className="popup__error popup__error_type_link"> </span>
      </div>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
