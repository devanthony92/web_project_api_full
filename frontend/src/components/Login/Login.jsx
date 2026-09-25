import { Link } from "react-router-dom";
import PasswordInput from "../PasswordInput/PasswordInput.jsx";
import useValidatedInput from "../../hooks/useValidatedInput.js";

export default function Login({ onLogin }) {
	const email = useValidatedInput("");
	const password = useValidatedInput("");
	const isFormValid = !email.error && !password.error && email.value && password.value;

	function handleSubmit(e) {
		e.preventDefault();
		onLogin(email.value, password.value);
	}

	return (
		<section className="auth">
			<h2 className="auth__title">Inicia sesión</h2>
			<form
				name="login"
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
				<button
					type="submit"
					className={`auth__submit ${!isFormValid ? "auth__submit--disabled" : ""}`}
					disabled={!isFormValid}
				>
					Inicia sesión
				</button>
			</form>
			<p className="auth__toggle-text">
				¿Aún no eres miembro?{" "}
				<Link className="auth__toggle-link" to="/signup">
					Regístrate aquí
				</Link>
			</p>
		</section>
	);
}
