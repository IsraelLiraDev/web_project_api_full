import logo from "../../images/logo.svg";

function Header({ email, onSignOut }) {
  return (
    <header className="header page__section">
      <img src={logo} alt="Around the U.S." className="logo header__logo" />

      <div className="header__info">
        <p className="header__email">{email}</p>
        <button className="header__logout" type="button" onClick={onSignOut}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
