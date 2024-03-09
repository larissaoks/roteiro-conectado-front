import React, { useState, useEffect } from "react";
import api from "../../service/service";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../VerifyToken";
import { Search } from "react-bootstrap-icons";

function CadastroHospedagemComponent() {
  const history = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [jsonCEP, setJsonCEP] = useState(null);
  const [nomeLocal, setnomeLocal] = useState(null);
  const [cep, setCep] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const onChangeNomeLocal = (e) => setnomeLocal(e.target.value);
  const onChangeCheckIn = (e) => {
    setCheckIn(e.target.value);
    console.log("Data: ", checkIn);
  };

  const onChangeCheckOut = (e) => setCheckOut(e.target.value);
  const onChangeCep = (e) => setCep(e.target.value);

  const token = localStorage.getItem("token");

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

  async function buscarCEP(cep) {
    const json = `https://viacep.com.br/ws/${cep}/json`;
    setJsonCEP(json);
    console.log(json);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <h2>Cadastrar Hospedagem</h2>
        {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
        {message && <Alert variant={"success"}>{message}</Alert>}

        <Form.Group controlId="formBasicDestino">
          <Form.Label>Nome do Local</Form.Label>
          <Form.Control
            type="text"
            value={nomeLocal}
            onChange={onChangeNomeLocal}
          />
        </Form.Group>
        <Form.Group controlId="formBasicDestino">
          <Form.Label>CEP</Form.Label>
          <Form.Control type="text" value={cep} onChange={onChangeCep} />
          <Search size={16} onClick={() => buscarCEP(cep)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckIn">
          <Form.Label>Check-In</Form.Label>
          <Form.Control
            value={checkIn}
            onChange={onChangeCheckIn}
            type="datetime-local"
            step="1"
            min={new Date().toLocaleDateString()}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckOut">
          <Form.Label>Check-out</Form.Label>
          <Form.Control
            value={checkOut}
            onChange={onChangeCheckOut}
            type="datetime-local"
            step="1"
            min={new Date().toLocaleDateString()}
          />
        </Form.Group>
        <Button variant="light" onClick={() => history("/home")}>
          Voltar
        </Button>
        <Button variant="primary" type="submit">
          Cadastrar
        </Button>
      </Form>
    </div>
  );
}
export default CadastroHospedagemComponent;
