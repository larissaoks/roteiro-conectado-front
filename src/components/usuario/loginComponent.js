import React, { useState, useEffect } from "react";
import { api } from "../../service/service";
import { Button, Form, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LoginComponent() {
  const history = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      history("/home");
    }
  }, [history]);

  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangeSenha = (e) => setSenha(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "oauth2/token",
        {},
        {
          headers: {
            Authorization: "Basic " + btoa(email + ":" + senha),
          },
        }
      );
      if (res.status === 200) {
        localStorage.setItem("token", res.data.Token);
        setTimeout(() => {
          history("/home");
        }, 800);
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setErrorMessage("Email/Senha incorretos ou não existem");
      } else if (err.response && err.response.status === 400) {
        setErrorMessage("Preencha o(s) campo(s) vazio(s)!");
      } else {
        setErrorMessage(
          "Erro interno do servidor. Contate o Administrador da página"
        );
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        className="activity-card"
        style={{ marginTop: "5%", width: "30%", height: "50%" }}
      >
        <Card.Title style={{ marginTop: "0.5%" }}>
          <h2>Login</h2>
        </Card.Title>
        <Card.Body>
          <Form
            onSubmit={handleSubmit}
            //style={{ width: "30%", height: "50%", marginTop: "5%" }}
          >
            {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                onChange={onChangeEmail}
                type="email"
                placeholder="email@example.com"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                value={senha}
                onChange={onChangeSenha}
                type="password"
                placeholder="Senha"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
            <br /> <br />
          </Form>
        </Card.Body>
      </Card>
      <br />
    </div>
  );
}
export default LoginComponent;
