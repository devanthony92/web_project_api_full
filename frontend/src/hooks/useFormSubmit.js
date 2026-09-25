import { useContext, useEffect, useRef, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { getUserMessage } from "../utils/errors.js";

// Envía un formulario esperando la respuesta del servidor. Si falla, el error se
// muestra en el formulario; si el formulario ya se cerró, en el aviso global.
export default function useFormSubmit() {
	const { showError } = useContext(CurrentUserContext);
	const [submitError, setSubmitError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isMounted = useRef(true);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	async function submit(action, onSuccess) {
		if (isSubmitting) {
			return;
		}
		setIsSubmitting(true);
		setSubmitError("");
		try {
			await action();
			if (isMounted.current) {
				onSuccess();
			}
		} catch (error) {
			if (isMounted.current) {
				setSubmitError(getUserMessage(error));
				setIsSubmitting(false);
			} else {
				showError?.(error);
			}
		}
	}

	return { submit, submitError, isSubmitting };
}
