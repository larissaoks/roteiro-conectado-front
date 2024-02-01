import React, { useState, useEffect } from "react";
import api from "../../service/service";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../VerifyToken";

function CadastroViagemComponent() {
  const history = useNavigate();

  const [destino, setDestino] = useState("");
  const [dteInicio, setDteInicio] = useState("");
  const [dteFim, setDteFim] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);

  const onChangeDestino = (e) => setDestino(e.target.value);
  const onChangeDteInicio = (e) => setDteInicio(e.target.value);
  const onChangeDteFim = (e) => setDteFim(e.target.value);

  useEffect(() => {
    const auth = async () => {
      const result = await verifyToken();
      if (!result) {
        localStorage.removeItem("token");
        history("/unauthorized");
      }
    };
    auth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await api.post(
        "viagem/criar",
        {
          token,
          destino,
          dteInicio,
          dteFim,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        setMessage("Viagem cadastrada com sucesso!");
        setTimeout(() => {
          history("/home");
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
        <h2>Cadastrar Viagem</h2>
        {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
        {message && <Alert variant={"success"}>{message}</Alert>}
        <Form.Group controlId="formBasicDestino">
          <Form.Label>Destino</Form.Label>
          <Form.Control
            type="text"
            value={destino}
            onChange={onChangeDestino}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Data de Início</Form.Label>
          <Form.Control
            value={dteInicio}
            onChange={onChangeDteInicio}
            type="date"
            placeholder="YYYY-MM-DD"
            min={new Date().toLocaleDateString()}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Data de Fim</Form.Label>
          <Form.Control
            value={dteFim}
            onChange={onChangeDteFim}
            type="date"
            placeholder="YYYY-MM-DD"
            min={new Date().toLocaleDateString()}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Cadastrar
        </Button>
        <br />
        <br />

        <Button variant="light" onClick={() => history("/home")}>
          Voltar
        </Button>
      </Form>
    </div>
  );
}
export default CadastroViagemComponent;
