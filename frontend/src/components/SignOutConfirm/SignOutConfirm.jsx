export default function SignOutConfirm({ onConfirm, onCancel }) {
	return (
		<div className="dialog dialog--confirm">
			<button
				className="button"
				type="button"
				id="signOutConfirmButton"
				onClick={onConfirm}
			>
				Sí, cerrar sesión
			</button>
			<button
				className="button dialog__cancel"
				type="button"
				id="signOutCancelButton"
				onClick={onCancel}
			>
				Cancelar
			</button>
		</div>
	);
}
