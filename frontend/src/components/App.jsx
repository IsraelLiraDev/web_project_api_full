import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import InfoTooltip from "./InfoTooltip.jsx";

import CurrentUserContext from "../contexts/CurrentUserContext.js";
import api from "../utils/api.js";
import * as auth from "../utils/auth.js";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [popup, setPopup] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("jwt") || "");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");

    if (!storedToken) {
      setIsCheckingAuth(false);
      return;
    }

    auth
      .getUserInfo(storedToken)
      .then((res) => {
        setUserEmail(res.email);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        setToken("");
        setIsLoggedIn(false);
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setCurrentUser({});
      setCards([]);
      return;
    }

    api.setToken(token);

    api
      .getAppInfo()
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch((err) => console.error("Erro ao carregar os dados:", err));
  }, [isLoggedIn, token]);

  function handleOpenPopup(popupData) {
    setPopup(popupData);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  function handleUpdateUser(data) {
    api
      .editUserInfo({ name: data.name, about: data.about })
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((err) => console.error(err));
  }

  function handleUpdateAvatar(data) {
    api
      .updateAvatar({ avatar: data.avatar })
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((err) => console.error(err));
  }

  async function handleCardLike(cardId, isLiked) {
    try {
      const newCard = await api.changeLikeCardStatus(cardId, isLiked);
      setCards((state) =>
        state.map((card) => (card._id === cardId ? newCard : card))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCardDelete(cardId) {
    try {
      await api.deleteCard(cardId);
      setCards((state) => state.filter((card) => card._id !== cardId));
      handleClosePopup();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddPlaceSubmit(data) {
    try {
      const newCard = await api.addCard({
        name: data.name,
        link: data.link,
      });
      setCards((state) => [newCard, ...state]);
      handleClosePopup();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogin({ email, password }) {
    try {
      const data = await auth.login(email, password);

      if (!data.token) {
        throw new Error("A API não retornou o token de autenticação.");
      }

      localStorage.setItem("jwt", data.token);
      setToken(data.token);
      setUserEmail(email);
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      console.error("Erro no login:", err);
      setIsRegistrationSuccess(false);
      setIsTooltipOpen(true);
    }
  }

  async function handleRegister({ email, password }) {
    try {
      await auth.register(email, password);
      setIsRegistrationSuccess(true);
      setIsTooltipOpen(true);
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setIsRegistrationSuccess(false);
      setIsTooltipOpen(true);
    }
  }

  function handleSignOut() {
    localStorage.removeItem("jwt");
    setToken("");
    setIsLoggedIn(false);
    setUserEmail("");
    navigate("/signin");
  }

  if (isCheckingAuth) {
    return <p className="auth-loading">Verificando sessão...</p>;
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
      }}
    >
      <Routes>
        <Route
          path="/signin"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Register onRegister={handleRegister} />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="page__content">
                <Header email={userEmail} onSignOut={handleSignOut} />
                <Main
                  popup={popup}
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={handleClosePopup}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                />
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <InfoTooltip
        isOpen={isTooltipOpen}
        isSuccess={isRegistrationSuccess}
        onClose={() => {
          setIsTooltipOpen(false);

          if (isRegistrationSuccess) {
            navigate("/signin");
          }
        }}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
