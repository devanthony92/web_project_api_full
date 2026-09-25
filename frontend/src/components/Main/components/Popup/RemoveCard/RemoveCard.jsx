export default function RemoveCard(props) {
	const { confirmDelete, id } = props;

	return (
		<>
			<div className="dialog dialog--confirm">
				<button
					className="button"
					type="submit"
					id="deleteConfirmationButton"
					onClick={() => {
						confirmDelete(id);
					}}
				>
					Si
				</button>
			</div>
		</>
	);
}
