import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import "../index.css";
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";
import Popup from "./Main/components/Popup/Popup.jsx";
import SignOutConfirm from "./SignOutConfirm/SignOutConfirm.jsx";
import api from "../utils/Api.js";
import * as auth from "../utils/auth.js";
import { getUserMessage } from "../utils/errors.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useState({});
	const [cards, setCards] = useState([]);
	const [loggedIn, setLoggedIn] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const [isCheckingToken, setIsCheckingToken] = useState(true);
	const [tooltip, setTooltip] = useState({
		isOpen: false,
		isSuccess: false,
		message: "",
	});
	const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);

	const closeTooltip = () =>
		setTooltip({ isOpen: false, isSuccess: false, message: "" });

	const showError = useCallback((error) => {
		console.error(error);
		setTooltip({ isOpen: true, isSuccess: false, message: getUserMessage(error) });
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("jwt");
		if (!token) {
			setIsCheckingToken(false);
			return;
		}
		auth
			.checkToken(token)
			.then((res) => {
				api.setToken(token);
				setLoggedIn(true);
				setUserEmail(res.email);
			})
			.catch((error) => {
				console.error("Error validando el token: ", error);
				localStorage.removeItem("jwt");
			})
			.finally(() => setIsCheckingToken(false));
	}, []);

	useEffect(() => {
		if (!loggedIn) {
			return;
		}
		const fetchUser = async () => {
			try {
				const userData = await api.getUserInfo();
				setCurrentUser(userData);
			} catch (error) {
				showError(error);
			}
		};
		fetchUser();
	}, [loggedIn, showError]);

	useEffect(() => {
		if (!loggedIn) {
			return;
		}
		const fetchCards = async () => {
			try {
				const initialCards = await api.getInitialCards();
				setCards(initialCards);
			} catch (error) {
				showError(error);
			}
		};
		fetchCards();
	}, [loggedIn, showError]);

	const handleRegister = useCallback(
		(email, password) => {
			auth
				.register(email, password)
				.then(() => {
					setTooltip({ isOpen: true, isSuccess: true, message: "" });
					navigate("/signin");
				})
				.catch(showError);
		},
		[navigate, showError]
	);

	const handleLogin = useCallback(
		(email, password) => {
			auth
				.login(email, password)
				.then((res) => {
					localStorage.setItem("jwt", res.token);
					api.setToken(res.token);
					setLoggedIn(true);
					setUserEmail(email);
					navigate("/");
				})
				.catch(showError);
		},
		[navigate, showError]
	);

	const handleSignOut = useCallback(() => {
		localStorage.removeItem("jwt");
		api.setToken("");
		setLoggedIn(false);
		setUserEmail("");
		setCurrentUser({});
		setCards([]);
		navigate("/signin");
	}, [navigate]);

	useEffect(() => {
		api.setUnauthorizedHandler(handleSignOut);
	}, [handleSignOut]);

	const openSignOutConfirm = () => setIsSignOutConfirmOpen(true);
	const closeSignOutConfirm = () => setIsSignOutConfirmOpen(false);
	const confirmSignOut = () => {
		setIsSignOutConfirmOpen(false);
		handleSignOut();
	};

	// Estas acciones no capturan errores: cada formulario decide cómo mostrarlos
	const handleUpdateUser = async (data) => {
		const updatedUser = await api.setUserInfo(data);
		setCurrentUser(updatedUser);
	};

	const handleUpdateAvatar = async (data) => {
		const updatedUser = await api.setUserAvatar(data);
		setCurrentUser(updatedUser);
	};

	const handleAddPlaceSubmit = async ({ name, link }) => {
		const newCard = await api.createNewCard({ name, link });
		setCards((prev) => [newCard, ...prev]);
	};

	const handleUpdateCard = async (id, data) => {
		const updatedCard = await api.updateCard(id, data);
		setCards((prev) => prev.map((card) => (card._id === id ? updatedCard : card)));
	};

	const handleDeletePopup = (id) => {
		api
			.deleteCard(id)
			.then(() => setCards((prev) => prev.filter((card) => card._id !== id)))
			.catch(showError);
	};

	if (isCheckingToken) {
		return null;
	}

	return (
		<div className="page">
			<div className="page__content">
				<CurrentUserContext.Provider
					value={{
						currentUser,
						handleUpdateUser,
						handleUpdateAvatar,
						handleAddPlaceSubmit,
						handleUpdateCard,
						handleDeletePopup,
						showError,
					}}
				>
					<Routes>
						<Route
							path="/signup"
							element={
								loggedIn ? (
									<Navigate to="/" replace />
								) : (
									<>
										<Header authLinkTo="/signin" authLinkText="Iniciar sesión" />
										<Register onRegister={handleRegister} />
									</>
								)
							}
						/>
						<Route
							path="/signin"
							element={
								loggedIn ? (
									<Navigate to="/" replace />
								) : (
									<>
										<Header authLinkTo="/signup" authLinkText="Regístrate" />
										<Login onLogin={handleLogin} />
									</>
								)
							}
						/>
						<Route
							path="/"
							element={
								<ProtectedRoute loggedIn={loggedIn}>
									<Header
										loggedIn={loggedIn}
										userEmail={userEmail}
										onSignOut={openSignOutConfirm}
									/>
									<Main cards={cards} />
									<Footer />
								</ProtectedRoute>
							}
						/>
						<Route
							path="*"
							element={<Navigate to={loggedIn ? "/" : "/signin"} replace />}
						/>
					</Routes>
					<InfoTooltip
						isOpen={tooltip.isOpen}
						isSuccess={tooltip.isSuccess}
						message={tooltip.message}
						onClose={closeTooltip}
					/>
					{isSignOutConfirmOpen && (
						<Popup title="¿Quieres cerrar sesión?" onClose={closeSignOutConfirm}>
							<SignOutConfirm
								onConfirm={confirmSignOut}
								onCancel={closeSignOutConfirm}
							/>
						</Popup>
					)}
				</CurrentUserContext.Provider>
			</div>
		</div>
	);
}

export default App;
