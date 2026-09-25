import { useEffect, useRef } from "react";
import successIcon from "../../assets/images/Success_Icon.svg";
import failIcon from "../../assets/images/Fail_Icon.svg";
import closeIcon from "../../assets/images/Close_Icon.png";

export default function InfoTooltip({ isOpen, isSuccess, message, onClose }) {
	const contentRef = useRef(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				onClose?.();
			}
		};
		const handleClickOutside = (event) => {
			if (contentRef.current && !contentRef.current.contains(event.target)) {
				onClose?.();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	return (
		<div className="popup">
			<div
				className="popup__content popup__content--tooltip"
				ref={contentRef}
			>
				<button
					aria-label="Close modal"
					className="popup__close"
					type="button"
					onClick={onClose}
				>
					<img src={closeIcon} alt="" />
				</button>
				<img
					className="popup__tooltip-icon"
					src={isSuccess ? successIcon : failIcon}
					alt={isSuccess ? "Éxito" : "Error"}
				/>
				<p className="popup__tooltip-text">
					{isSuccess
						? "¡Correcto! Ya estás registrado."
						: message || "Uy, algo salió mal. Por favor, inténtalo de nuevo."}
				</p>
			</div>
		</div>
	);
}
