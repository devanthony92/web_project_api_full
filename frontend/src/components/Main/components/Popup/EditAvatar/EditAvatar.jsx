import { useContext } from "react";
import { CurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import useValidatedInput from "../../../../../hooks/useValidatedInput.js";
import useFormSubmit from "../../../../../hooks/useFormSubmit.js";

export default function EditAvatar({ props }) {
	const handleClosePopup = props;
	const userContext = useContext(CurrentUserContext);
	const { currentUser, handleUpdateAvatar } = userContext;
	const avatar = useValidatedInput(currentUser.avatar);
	const isFormValid = !avatar.error && avatar.value;
	const { submit, submitError, isSubmitting } = useFormSubmit();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!isFormValid) {
			return;
		}
		submit(() => handleUpdateAvatar({ avatar: avatar.value }), handleClosePopup);
	};

	return (
		<form
			name="edit-avatar-form"
			className="popup__form"
			id="edit-avatar-form"
			noValidate
			onSubmit={handleSubmit}
		>
			<label>
				<input
					name="edit-avatar"
					id="edit-avatar"
					type="url"
					className={`popup__input popup__input-photolink ${avatar.error ? "popup__input--error" : ""}`}
					placeholder="Link para la foto de perfil"
					required
					value={avatar.value}
					onChange={avatar.handleChange}
					onBlur={avatar.handleBlur}
				/>
				<span id="edit-avatar-error" className={`field-error ${avatar.error ? "field-error--visible" : ""}`}>
					{avatar.error}
				</span>
			</label>

			<button
				type="submit"
				id="save-edit-avatar"
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
