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
      <h1 className="auth__title">Iniciar sesión</h1>

      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__input"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          className="auth__input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button className="auth__submit" type="submit">
          Iniciar sesión
        </button>
      </form>

      <p className="auth__caption">
        ¿Aún no eres miembro? <Link to="/signup">Regístrate aquí</Link>
      </p>
    </main>
  );
}

export default Login;
