import React from 'react';

export default function usePopupClose(isOpen, closePopup) {
	React.useEffect(() => {
		if (!isOpen) return;

		const handleOverlay = (event) => {
			if (event.target.classList.contains('popup_opened')) {
				closePopup();
			}
		};

		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				closePopup();
			}
		};

		document.addEventListener('keydown', handleEscape);
		document.addEventListener('mousedown', handleOverlay);

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.removeEventListener('mousedown', handleOverlay);
		};
	}, [isOpen, closePopup]);
}
