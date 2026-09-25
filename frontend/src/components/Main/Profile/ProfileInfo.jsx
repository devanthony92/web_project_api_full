import editButton from "../../../assets/images/edit__button.svg";

export default function ProfileInfo(props) {
	const { onOpen, user } = props;

	return (
		<div className="profile__info">
			<div className="profile__title">
				<h2 className="profile__name" id="profileName" title={user.name}>
					{user.name}
				</h2>
				<button
					aria-label="Edit Profile"
					className="profile__edit"
					id="editButton"
					onClick={onOpen}
				>
					<img src={editButton} alt="edit button" />
				</button>
			</div>
			<h4 className="profile__profession" id="profileProfession" title={user.about}>
				{user.about}
			</h4>
		</div>
	);
}
