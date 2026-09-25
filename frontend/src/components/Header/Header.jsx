import { Link } from "react-router-dom";
import Header__logo from "../../assets/images/Header.png";

export default function Header({ loggedIn, userEmail, onSignOut, authLinkTo, authLinkText }) {
	return (
		<header className="header">
			<img
				src={Header__logo}
				className="header__logo"
				alt="Around the US logo"
			/>
			{loggedIn ? (
				<div className="header__user">
					<span className="header__email" title={userEmail}>
						{userEmail}
					</span>
					<button
						type="button"
						className="header__link"
						onClick={onSignOut}
					>
						Cerrar sesión
					</button>
				</div>
			) : (
				authLinkTo && (
					<Link className="header__link" to={authLinkTo}>
						{authLinkText}
					</Link>
				)
			)}
		</header>
	);
}
