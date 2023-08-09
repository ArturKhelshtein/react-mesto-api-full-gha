import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { AppContext } from '../contexts/AppContext';
import useForm from '../hooks/useForm';

function EditProfilePopup({ isOpen, onSubmit }) {
	const currentUser = React.useContext(CurrentUserContext);
	const {isLoading, closeAllPopups: onClose} = React.useContext(AppContext)
	
	const { values, handleChange, setValues } = useForm({});

	React.useEffect(() => {
		setValues(currentUser);
	}, [currentUser, isOpen]);

	function handleSubmit(event) {
		event.preventDefault();

		onSubmit(values);
	}

	return (
		<PopupWithForm
			name="user"
			title="Редактировать профиль"
			buttonName={isLoading ? 'Сохранение...' : 'Сохранить'}
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={handleSubmit}
		>
			<div className="popup__input-container">
				``
				<input
					className="popup__input popup__input_value_user-name"
					type="text"
					name="name"
					placeholder="Имя"
					minLength="2"
					maxLength="40"
					value={values.name || ''}
					onChange={handleChange}
					required
				/>
				<span className="popup__error popup__error_type_name"> </span>
			</div>
			<div className="popup__input-container">
				<input
					className="popup__input popup__input_value_user-about"
					type="text"
					name="about"
					placeholder="Описание"
					minLength="2"
					maxLength="200"
					value={values.about || ''}
					onChange={handleChange}
					required
				/>
				<span className="popup__error popup__error_type_about"> </span>
			</div>
		</PopupWithForm>
	);
}

export default EditProfilePopup;
