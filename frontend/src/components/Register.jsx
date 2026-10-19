import { useState } from "react";
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onRegister({ email, password });
  }

  return (
    <main className="auth">
      <h1 className="auth__title">Cadastre-se</h1>

      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__input"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          className="auth__input"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button className="auth__submit" type="submit">
          Cadastre-se
        </button>
      </form>

      <p className="auth__caption">
        Já é membro? <Link to="/signin">Faça login aqui</Link>
      </p>
    </main>
  );
}

export default Register;
