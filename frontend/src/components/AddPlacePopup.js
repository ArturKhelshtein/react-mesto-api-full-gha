import React from 'react';
import PopupWithForm from './PopupWithForm';
import useForm from '../hooks/useForm';
import { AppContext } from '../contexts/AppContext';

function AddPlacePopup({ isOpen, onSubmit }) {
  const { values, handleChange, setValues } = useForm({});
  const { isLoading, closeAllPopups: onClose } = React.useContext(AppContext);

  React.useEffect(() => {
    setValues({});
  }, [isOpen, setValues]);

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit(values);
  }

  return (
    <PopupWithForm
      name="card-add"
      title="Новое место"
      buttonName={isLoading ? 'Сохранение...' : 'Создать'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="popup__input-container">
        <input
          className="popup__input popup__input_value_card-name"
          type="text"
          name="name"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          value={values.name || ''}
          onChange={handleChange}
          required
        />
        <span className="popup__error popup__error_type_name"> </span>
      </div>
      <div className="popup__input-container">
        <input
          className="popup__input popup__input_value_card-img-url"
          type="url"
          name="link"
          placeholder="Ссылка на картинку"
          value={values.link || ''}
          onChange={handleChange}
          required
        />
        <span className="popup__error popup__error_type_link"> </span>
      </div>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
