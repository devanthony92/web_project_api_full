import { useContext } from "react";
import { CurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import useValidatedInput from "../../../../../hooks/useValidatedInput.js";
import useFormSubmit from "../../../../../hooks/useFormSubmit.js";

export default function EditProfile({ props }) {
	const handleClosePopup = props;
	const userContext = useContext(CurrentUserContext);
	const { currentUser, handleUpdateUser } = userContext;
	const name = useValidatedInput(currentUser.name);
	const about = useValidatedInput(currentUser.about);
	const isFormValid = !name.error && !about.error && name.value && about.value;
	const { submit, submitError, isSubmitting } = useFormSubmit();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!isFormValid) {
			return;
		}
		submit(() => handleUpdateUser({ name: name.value, about: about.value }), handleClosePopup);
	};

	return (
		<form
			name="edit-form"
			className="popup__form"
			id="edit-form"
			noValidate
			onSubmit={handleSubmit}
		>
			<label>
				<input
					name="edit-name"
					id="edit-name"
					type="text"
					className={`popup__input popup__input-name ${name.error ? "popup__input--error" : ""}`}
					placeholder="Nombre"
					required
					minLength="2"
					maxLength="40"
					value={name.value}
					onChange={name.handleChange}
					onBlur={name.handleBlur}
				/>
				<span id="edit-name-error" className={`field-error ${name.error ? "field-error--visible" : ""}`}>
					{name.error}
				</span>
			</label>

			<label>
				<input
					name="edit-about"
					id="edit-about"
					className={`popup__input popup__input-about ${about.error ? "popup__input--error" : ""}`}
					placeholder="Descripción"
					required
					type="text"
					minLength="2"
					maxLength="100"
					value={about.value}
					onChange={about.handleChange}
					onBlur={about.handleBlur}
				/>
				<span id="edit-about-error" className={`field-error ${about.error ? "field-error--visible" : ""}`}>
					{about.error}
				</span>
			</label>
			<button
				type="submit"
				className={`button ${!isFormValid ? "button--disabled" : ""}`}
				id="formEditButtonSave"
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
