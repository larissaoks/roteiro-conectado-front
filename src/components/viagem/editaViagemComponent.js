import React, { useState, useEffect } from "react";
import { api } from "../../service/service";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyToken } from "../../service/VerifyToken";
import { getToken } from "../../util/getTokenFromLocalStorage";


function EditaViagemComponent() {
  const history = useNavigate();
  const location = useLocation();

  const [idViagem, setIdViagem] = useState("");
  const [destino, setDestino] = useState("");
  const [dteInicio, setDtInicio] = useState("");
  const [dteFim, setDtFim] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const viagem = location.state;

  const onChangeDestino = (e) => setDestino(e.target.value);
  const onChangeDtInicio = (e) => setDtInicio(e.target.value);
  const onChangeDtFim = (e) => setDtFim(e.target.value);

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

  useEffect(() => {
    const preencherViagem = () => {
      setDestino(viagem.destino);
      setDtInicio(viagem.dteInicio);
      setDtFim(viagem.dteFim);
      setIdViagem(viagem.idViagem);
    };
    preencherViagem();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(dteFim) <= new Date(dteInicio)) {
      setErrorMessage("A data final deve ser posterior à data de início");
      return;
    }
    const token = getToken();
    try {
      const res = await api.put(
        "viagem/alterar",
        {
          idViagem,
          dteInicio,
          dteFim,
          destino,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        setMessage("Viagem atualizada com sucesso!");
        setTimeout(() => {
          history("/detalheViagem", { state: { idViagem } });
        }, 1000);
      }
    } catch (err) {
      console.log(err);
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
        <h2>Atualizar Viagem</h2>
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
        <Form.Group className="mb-3" controlId="formBasicDteInicio">
          <Form.Label>Data de Início</Form.Label>
          <Form.Control
            value={dteInicio}
            onChange={onChangeDtInicio}
            type="date"
            placeholder="YYYY-MM-DD"
            min={new Date().toLocaleDateString()}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicDteFim">
          <Form.Label>Data de Fim</Form.Label>
          <Form.Control
            value={dteFim}
            onChange={onChangeDtFim}
            type="date"
            placeholder="YYYY-MM-DD"
            min={new Date().toLocaleDateString()}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Atualizar
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
export default EditaViagemComponent;
