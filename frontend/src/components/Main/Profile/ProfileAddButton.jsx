import addButton from "../../../assets/images/add__button.svg";

export default function ProfileAddButton(props) {
	const { onOpen } = props;

	return (
		<button
			aria-label="Add Card"
			className="profile__add-button"
			id="addButton"
			onClick={onOpen}
		>
			<img
				className="profile__add-button-icon"
				src={addButton}
				alt="add button"
			/>
		</button>
	);
}
