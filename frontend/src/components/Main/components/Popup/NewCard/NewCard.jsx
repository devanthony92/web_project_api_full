import { useContext } from "react";
import { CurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import useValidatedInput from "../../../../../hooks/useValidatedInput.js";
import useFormSubmit from "../../../../../hooks/useFormSubmit.js";

export default function NewCard({ props }) {
	const handleClosePopup = props;
	const { handleAddPlaceSubmit } = useContext(CurrentUserContext);
	const cardName = useValidatedInput("");
	const cardLink = useValidatedInput("");
	const isFormValid =
		!cardName.error && !cardLink.error && cardName.value && cardLink.value;
	const { submit, submitError, isSubmitting } = useFormSubmit();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!isFormValid) {
			return;
		}
		submit(() => handleAddPlaceSubmit({ name: cardName.value, link: cardLink.value }), handleClosePopup);
	};
	return (
		<form
			name="card-form"
			className="popup__form"
			id="new-card-form"
			noValidate
			onSubmit={handleSubmit}
		>
			<label>
				<input
					name="card-name"
					id="card-name"
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
				<span id="card-name-error" className={`field-error ${cardName.error ? "field-error--visible" : ""}`}>
					{cardName.error}
				</span>
			</label>
			<label>
				<input
					name="link"
					id="card-link"
					className={`popup__input popup__input-about ${cardLink.error ? "popup__input--error" : ""}`}
					placeholder="Enlace a la imagen"
					required
					type="url"
					value={cardLink.value}
					onChange={cardLink.handleChange}
					onBlur={cardLink.handleBlur}
				/>
				<span id="card-link-error" className={`field-error ${cardLink.error ? "field-error--visible" : ""}`}>
					{cardLink.error}
				</span>
			</label>
			<button
				id="save-card-form"
				type="submit"
				className={`button ${!isFormValid ? "button--disabled" : ""}`}
				disabled={!isFormValid || isSubmitting}
			>
				Crear
			</button>
			{submitError && (
				<span className="field-error field-error--visible" role="alert">
					{submitError}
				</span>
			)}
		</form>
	);
}
