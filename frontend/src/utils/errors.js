const DEFAULT_ERROR_MESSAGE =
	"Uy, algo salió mal. Por favor, inténtalo de nuevo.";
const NETWORK_ERROR_MESSAGE =
	"No se pudo conectar con el servidor. Inténtalo de nuevo.";

// Lee el mensaje que envía el servidor ({ message }) o, si no hay, arma uno con el estado
export function getErrorMessage(res) {
	return Promise.resolve()
		.then(() => res.json())
		.then((body) => body?.message)
		.catch(() => undefined)
		.then((message) => message || `Error ${res.status}`);
}

// Convierte cualquier error en un texto apto para mostrar al usuario
export function getUserMessage(error) {
	if (error instanceof TypeError) {
		return NETWORK_ERROR_MESSAGE;
	}
	return error?.message || DEFAULT_ERROR_MESSAGE;
}
