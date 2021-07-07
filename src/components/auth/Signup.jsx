import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value)
      return setError("Senhas não coincidem");

    setError("");
    setLoading(true);
    await signup(emailRef.current.value, passwordRef.current.value)
      .then(() => {
        console.log("Signup successful.");
        this.setState({
          response: "Account Created!",
        });
        history.push("/");
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/email-already-in-use":
            setError("Email já existe");
            break;
          case "auth/invalid-email":
            setError("Email inválido");
            break;
          case "auth/weak-password":
            setError("Senha fraca");
            break;
          default:
            console.log(`Falha ao registrar`);
        }
      });
    setLoading(false);
  }

  return (
    <main>
      <div>
        <div>
          <h2>Registre-se</h2>
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
            <div id="password-confirm">
              <label>Confirmar senha</label>
              <input type="password" ref={passwordConfirmRef} required />
            </div>
            <button disabled={loading} type="submit">
              Confirmar
            </button>
          </form>
        </div>
      </div>
      <sub>
        Já tem conta? <Link to="/login">Login</Link>
      </sub>
    </main>
  );
}
