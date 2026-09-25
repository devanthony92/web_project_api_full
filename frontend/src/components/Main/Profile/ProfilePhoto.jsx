import perfilPhoto from "../../../assets/images/image.jpg";
import photoEdit from "../../../assets/images/Vector.png";

export default function ProfilePhoto(props) {
	const { onOpen, avatar } = props;

	return (
		<div className="profile__photo-container">
			<img
				id="avatar"
				className="profile__photo"
				src={avatar || perfilPhoto}
				alt="profile photo"
			/>

			<div
				className="profile__photo-edit"
				onClick={onOpen}
				aria-label="Edit Avatar"
			>
				<img
					id="edit-avatar"
					className="profile__photo-edit-icon"
					src={photoEdit}
					alt="edit icon"
				/>
			</div>
		</div>
	);
}
