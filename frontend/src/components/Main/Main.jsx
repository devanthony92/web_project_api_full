import { useState, useContext } from "react";
import ProfileAddButton from "./Profile/ProfileAddButton";
import ProfilePhoto from "./Profile/ProfilePhoto";
import ProfileInfo from "./Profile/ProfileInfo";
import Popup from "./components/Popup/Popup";
import NewCard from "../../components/Main/components/Popup/NewCard/NewCard";
import EditAvatar from "../../components/Main/components/Popup/EditAvatar/EditAvatar";
import EditProfile from "../../components/Main/components/Popup/EditProfile/EditProfile";
import Card from "../Main/components/Card/Card";
import ImagePopup from "./components/Popup/ImagePopup/ImagePopup";
import RemoveCard from "./components/Popup/RemoveCard/RemoveCard";
import EditCard from "./components/Popup/EditCard/EditCard";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

export default function Main({ cards }) {
	const [popup, setPopup] = useState(null);
	const { currentUser, handleDeletePopup } = useContext(CurrentUserContext);

	const newCardPopup = {
		title: "Nuevo Lugar",
		children: <NewCard props={handleClosePopup} />,
	};
	const user = {
		title: "Editar Perfil",
		children: <EditProfile props={handleClosePopup} />,
	};
	const avatar = {
		title: "Cambiar foto de perfil",
		children: <EditAvatar props={handleClosePopup} />,
	};

	function handleOpenPopup(popup) {
		setPopup(popup);
	}
	function handleClosePopup() {
		setPopup(null);
	}

	function openEditCard(card) {
		setPopup({
			title: "Editar lugar",
			children: <EditCard card={card} props={handleClosePopup} />,
		});
	}

	function confirmDelete(id) {
		const removeCard = {
			title: "¿Realmente desea eliminar?",
			children: <RemoveCard confirmDelete={() => handleDelete(id)} />,
			id: id,
		};
		setPopup(removeCard);
	}

	function handleDelete(id) {
		handleDeletePopup(id);
		setPopup(null);
	}
	return (
		<main className="main">
			<div className="main__container">
				<ProfilePhoto
					onOpen={() => handleOpenPopup(avatar)}
					avatar={currentUser.avatar}
				/>
				<ProfileInfo onOpen={() => handleOpenPopup(user)} user={currentUser} />
				<ProfileAddButton onOpen={() => handleOpenPopup(newCardPopup)} />
				{popup && (
					<Popup onClose={handleClosePopup} title={popup.title}>
						{popup.children}
					</Popup>
				)}
			</div>
			<ul className="cards__list">
				{cards.map((card) => (
					<Card
						key={card._id}
						card={card}
						onOpen={() =>
							handleOpenPopup({
								children: <ImagePopup props={card} />,
							})
						}
						onEdit={() => openEditCard(card)}
						onDelete={() => confirmDelete(card._id)}
					/>
				))}
			</ul>
		</main>
	);
}
