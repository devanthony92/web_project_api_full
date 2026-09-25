import { useContext } from "react";
import { CurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import useValidatedInput from "../../../../../hooks/useValidatedInput.js";
import useFormSubmit from "../../../../../hooks/useFormSubmit.js";

export default function EditCard({ card, props }) {
	const handleClosePopup = props;
	const { handleUpdateCard } = useContext(CurrentUserContext);
	const cardName = useValidatedInput(card.name);
	const cardLink = useValidatedInput(card.link);
	const { submit, submitError, isSubmitting } = useFormSubmit();
	const isFormValid =
		!cardName.error && !cardLink.error && cardName.value && cardLink.value;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!isFormValid) {
			return;
		}
		submit(
			() => handleUpdateCard(card._id, { name: cardName.value, link: cardLink.value }),
			handleClosePopup
		);
	};

	return (
		<form
			name="edit-card-form"
			className="popup__form"
			id="edit-card-form"
			noValidate
			onSubmit={handleSubmit}
		>
			<label>
				<input
					name="edit-card-name"
					id="edit-card-name"
					type="text"
					className={`popup__input popup__input-name ${cardName.error ? "popup__input--error" : ""}`}
					placeholder="Titulo"
					required
					minLength="2"
					maxLength="30"
					value={cardName.value}
					onChange={cardName.handleChange}
					onBlur={cardName.handleBlur}
				/>
				<span id="edit-card-name-error" className={`field-error ${cardName.error ? "field-error--visible" : ""}`}>
					{cardName.error}
				</span>
			</label>
			<label>
				<input
					name="edit-card-link"
					id="edit-card-link"
					className={`popup__input popup__input-about ${cardLink.error ? "popup__input--error" : ""}`}
					placeholder="Enlace a la imagen"
					required
					type="url"
					value={cardLink.value}
					onChange={cardLink.handleChange}
					onBlur={cardLink.handleBlur}
				/>
				<span id="edit-card-link-error" className={`field-error ${cardLink.error ? "field-error--visible" : ""}`}>
					{cardLink.error}
				</span>
			</label>
			<button
				id="save-edit-card"
				type="submit"
				className={`button ${!isFormValid ? "button--disabled" : ""}`}
				disabled={!isFormValid || isSubmitting}
			>
				Guardar
			</button>
			{submitError && (
				<span className="field-error field-error--visible" role="alert">
					{submitError}
				</span>
			)}
		</form>
	);
}
