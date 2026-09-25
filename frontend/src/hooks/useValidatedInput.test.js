import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useValidatedInput from "./useValidatedInput.js";

function fakeInputEvent(value, validationMessage = "") {
	return { target: { value, validationMessage } };
}

describe("useValidatedInput", () => {
	it("starts with the given initial value and no error", () => {
		const { result } = renderHook(() => useValidatedInput("initial"));
		expect(result.current.value).toBe("initial");
		expect(result.current.error).toBe("");
	});

	it("updates value and error on change", () => {
		const { result } = renderHook(() => useValidatedInput(""));

		act(() => {
			result.current.handleChange(fakeInputEvent("abc", "Too short"));
		});

		expect(result.current.value).toBe("abc");
		expect(result.current.error).toBe("Too short");
	});

	it("updates error on blur without changing the value", () => {
		const { result } = renderHook(() => useValidatedInput("abc"));

		act(() => {
			result.current.handleBlur(fakeInputEvent("abc", "Required"));
		});

		expect(result.current.value).toBe("abc");
		expect(result.current.error).toBe("Required");
	});
});
