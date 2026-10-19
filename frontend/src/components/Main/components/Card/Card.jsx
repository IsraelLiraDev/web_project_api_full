import { useContext } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext.js";
import ImagePopup from "../Popup/components/ImagePopup/ImagePopup.jsx";
import RemoveCard from "../Popup/components/RemoveCard/RemoveCard.jsx";

export default function Card(props) {
  const { card, handleOpenPopup, handleLikeClick, handleCardDelete } = props;
  const { currentUser } = useContext(CurrentUserContext);
  const { _id, name, link, likes = [], owner } = card;

  const isLiked = likes.some((userId) => userId === currentUser._id);
  const isOwn = owner === currentUser._id;

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_active" : ""
  }`;

  const imagePopup = {
    title: null,
    children: <ImagePopup card={card} />,
  };

  const deletePopup = {
    title: "Tem certeza?",
    isConfirmation: true,
    children: <RemoveCard onConfirm={() => handleCardDelete(_id)} />,
  };

  return (
    <li className="card">
      <img
        className="card__image"
        src={link}
        alt={name}
        onClick={() => handleOpenPopup(imagePopup)}
      />
      {isOwn && (
        <button
          aria-label="Excluir cartão"
          className="card__delete-button"
          type="button"
          onClick={() => handleOpenPopup(deletePopup)}
        />
      )}
      <div className="card__description">
        <h2 className="card__title">{name}</h2>
        <button
          aria-label="Curtir cartão"
          type="button"
          className={cardLikeButtonClassName}
          onClick={() => handleLikeClick(_id, isLiked)}
        />
      </div>
    </li>
  );
}
