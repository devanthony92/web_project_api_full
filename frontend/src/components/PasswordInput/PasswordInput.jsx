import { useState } from "react";

function EyeIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
		</svg>
	);
}

function EyeOffIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.7 19.7 0 0 1 4.22-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a19.66 19.66 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

export default function PasswordInput({
	value,
	onChange,
	onBlur,
	hasError,
	name = "password",
	placeholder = "Contraseña",
}) {
	const [isVisible, setIsVisible] = useState(false);
	const canToggle = Boolean(value);

	return (
		<div className="auth__password-wrapper">
			<input
				name={name}
				type={isVisible && canToggle ? "text" : "password"}
				className={`auth__input auth__input--password ${hasError ? "auth__input--error" : ""}`}
				placeholder={placeholder}
				required
				minLength="8"
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
			{canToggle && (
				<button
					type="button"
					className="auth__password-toggle"
					aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
					aria-pressed={isVisible}
					onClick={() => setIsVisible((prev) => !prev)}
				>
					{isVisible ? <EyeOffIcon /> : <EyeIcon />}
				</button>
			)}
		</div>
	);
}
