import { useState } from "react";

export default function useValidatedInput(initialValue = "") {
	const [value, setValue] = useState(initialValue);
	const [error, setError] = useState("");

	function handleChange(e) {
		setValue(e.target.value);
		setError(e.target.validationMessage);
	}

	function handleBlur(e) {
		setError(e.target.validationMessage);
	}

	return { value, setValue, error, handleChange, handleBlur };
}
