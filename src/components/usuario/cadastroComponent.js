import React, { useState } from "react";
import { api } from "../../service/service";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CadastroComponent() {
  const history = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);

  const onChangeNome = (e) => setNome(e.target.value);
  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangeSenha = (e) => setSenha(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("usuario/criar", {
        nome,
        email,
        senha,
      });
      if (res.status === 200) {
        setMessage("Cadastro realizado com sucesso!");
        setTimeout(() => {
          history("/");
        }, 1000);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
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
      <Form
        onSubmit={handleSubmit}
        style={{ width: "30%", height: "50%", marginTop: "5%" }}
      >
        <h2>Cadastro</h2>
        {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
        {message && <Alert variant={"success"}>{message}</Alert>}
        <Form.Group controlId="formBasicName">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" value={nome} onChange={onChangeNome} />
        </Form.Group>
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
          Cadastrar
        </Button>
        <br />
        <br />

        <Button variant="light" onClick={() => history("/")}>
          Voltar
        </Button>
      </Form>
    </div>
  );
}
export default CadastroComponent;
