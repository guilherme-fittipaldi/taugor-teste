import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch (error) {
      console.log(error.code);
      switch (error.code) {
        case "auth/wrong-password":
          setError("Senha incorreta");
          break;
        case "auth/user-not-found":
          setError("Usuário não foi encontrado");
          break;
        default:
          setError(`Falha ao logar`);
      }
    }

    setLoading(false);
  }

  return (
    <>
      <main>
        <h2>Login</h2>
        {error && <p variant="danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div id="email">
            <label>Email</label>
            <input type="email" ref={emailRef} required />
          </div>
          <div id="password">
            <label>Senha</label>
            <input type="password" ref={passwordRef} required />
          </div>
          <button disabled={loading} type="submit">
            Login
          </button>
        </form>

        <sub>
          Não tem conta? <Link to="/signup">Registre-se</Link>
        </sub>
      </main>
    </>
  );
}
