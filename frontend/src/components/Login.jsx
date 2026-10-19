import { useState } from "react";
import { Link } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onLogin({ email, password });
  }

  return (
    <main className="auth">
      <h1 className="auth__title">Entrar</h1>

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
          Entrar
        </button>
      </form>

      <p className="auth__caption">
        Ainda não é membro? <Link to="/signup">Cadastre-se aqui</Link>
      </p>
    </main>
  );
}

export default Login;
