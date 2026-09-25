import { useState } from "react";
import { Link } from "react-router-dom";
import PasswordInput from "../PasswordInput/PasswordInput.jsx";
import useValidatedInput from "../../hooks/useValidatedInput.js";

export default function Register({ onRegister }) {
	const email = useValidatedInput("");
	const password = useValidatedInput("");
	const confirmPassword = useValidatedInput("");
	const [isConfirmTouched, setIsConfirmTouched] = useState(false);

	const passwordsMismatch =
		Boolean(confirmPassword.value) && confirmPassword.value !== password.value;
	const showMismatch =
		passwordsMismatch &&
		(isConfirmTouched || confirmPassword.value.length >= password.value.length);
	const confirmError =
		confirmPassword.error || (showMismatch ? "Las contraseñas no coinciden" : "");

	const isFormValid =
		!email.error &&
		!password.error &&
		!confirmPassword.error &&
		email.value &&
		password.value &&
		confirmPassword.value &&
		!passwordsMismatch;

	function handleConfirmBlur(e) {
		setIsConfirmTouched(true);
		confirmPassword.handleBlur(e);
	}

	function handleSubmit(e) {
		e.preventDefault();
		onRegister(email.value, password.value);
	}

	return (
		<section className="auth">
			<h2 className="auth__title">Regístrate</h2>
			<form
				name="register"
				className="auth__form"
				noValidate
				onSubmit={handleSubmit}
			>
				<label className="auth__label">
					<input
						name="email"
						type="email"
						className={`auth__input ${email.error ? "auth__input--error" : ""}`}
						placeholder="Correo electrónico"
						required
						value={email.value}
						onChange={email.handleChange}
						onBlur={email.handleBlur}
					/>
					<span className={`field-error ${email.error ? "field-error--visible" : ""}`}>
						{email.error}
					</span>
				</label>
				<label className="auth__label">
					<PasswordInput
						value={password.value}
						onChange={password.handleChange}
						onBlur={password.handleBlur}
						hasError={Boolean(password.error)}
					/>
					<span className={`field-error ${password.error ? "field-error--visible" : ""}`}>
						{password.error}
					</span>
				</label>
				<label className="auth__label">
					<PasswordInput
						name="confirmPassword"
						placeholder="Confirmar contraseña"
						value={confirmPassword.value}
						onChange={confirmPassword.handleChange}
						onBlur={handleConfirmBlur}
						hasError={Boolean(confirmError)}
					/>
					<span className={`field-error ${confirmError ? "field-error--visible" : ""}`}>
						{confirmError}
					</span>
				</label>
				<button
					type="submit"
					className={`auth__submit ${!isFormValid ? "auth__submit--disabled" : ""}`}
					disabled={!isFormValid}
				>
					Regístrate
				</button>
			</form>
			<p className="auth__toggle-text">
				¿Ya eres miembro?{" "}
				<Link className="auth__toggle-link" to="/signin">
					Inicia sesión aquí
				</Link>
			</p>
		</section>
	);
}
