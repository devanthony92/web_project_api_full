import closeIcon from "../../../../assets/images/Close_Icon.png";

import { useEffect, useRef } from "react";

export default function Popup(props) {
	const { onClose, title, children } = props;
	const modalRef = useRef(null);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				onClose?.(); // Ejecuta el callback si existe
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		// Limpieza al desmontar
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				onClose?.(); // Ejecuta el callback si el clic fue fuera
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClose]);

	return (
		<div className="popup" id="editFormPopup">
			<div
				className={`popup__content ${!title ? "popup__content--image" : ""}`}
				ref={modalRef}
			>
				{title && <h3 className="popup__title">{title}</h3>}
				<button
					aria-label="Close modal"
					className="popup__close"
					type="button"
					onClick={onClose}
				>
					<img src={closeIcon} alt="" />
				</button>
				{children}
			</div>
		</div>
	);
}
