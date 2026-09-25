import { useState, useContext } from "react";
import api from "../../../../utils/Api.js";
import { CurrentUserContext } from "../../../../contexts/CurrentUserContext";

export default function Card(props) {
	const { onOpen, onEdit, onDelete } = props;
	const { _id, name, link, likes, owner } = props.card;
	const { currentUser, showError } = useContext(CurrentUserContext);
	const isOwn = owner === currentUser?._id;
	const isLikedByUser = likes?.includes(currentUser?._id);
	const [liked, setLiked] = useState(isLikedByUser);

	async function handleCardLike() {
		try {
			await api.isLiked(_id, liked);
			setLiked(!liked);
		} catch (error) {
			showError?.(error);
		}
	}

	return (
		<li className="card">
			<img className="card__img" src={link} alt={name} onClick={onOpen} />
			{isOwn && (
				<div className="card__actions">
					<button
						aria-label="Edit card"
						type="button"
						className="card__edit"
						onClick={onEdit}
					/>
					<button
						aria-label="Delete card"
						type="button"
						className="card__delete"
						onClick={onDelete}
					/>
				</div>
			)}
			<div className="card__description">
				<h3 className="card__name">{name}</h3>
				<button
					aria-label="Like card"
					type="button"
					className={`card__like ${liked ? "card__like--active" : ""}`}
					onClick={handleCardLike}
				/>
			</div>
		</li>
	);
}
