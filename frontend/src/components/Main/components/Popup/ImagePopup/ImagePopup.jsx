export default function ImagePopup({ props }) {
	const { link, name } = props;

	return (
		<>
			<img className="popup__image--full" src={link} alt="" />
			<h3 className="popup__name-image">{name}</h3>
		</>
	);
}
