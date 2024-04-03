import React, { useState, useEffect } from "react";
import { api } from "../../service/service";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyToken } from "../../service/VerifyToken";
import { getToken } from "../../util/getTokenFromLocalStorage";


function EditaPassagemComponent() {
  const history = useNavigate();
  const location = useLocation();

  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [dataHorario, setDataHorario] = useState("");
  const [codigoPassagem, setCodigoPassagem] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const idViagem = location.state.idViagem;
  const passagem = location.state.atividade;
  console.log(passagem);
  const idPassagem = location.state.atividade.idPassagem;

  const onChangeOrigem = (e) => setOrigem(e.target.value);
  const onChangeDestino = (e) => setDestino(e.target.value);
  const onChangeDataHorario = (e) => setDataHorario(e.target.value);
  const onChangeCodigoPassagem = (e) => setCodigoPassagem(e.target.value);

  useEffect(() => {
    const auth = async () => {
      const result = await verifyToken();
      if (!result) {
        localStorage.removeItem("token");
        history("/unauthorized");
      }
    };
    auth();
  }, [history]);

  useEffect(() => {
    const preencherPassagem = () => {
      setOrigem(passagem.origem);
      setDestino(passagem.destino);
      setDataHorario(passagem.dataHora);
      converterPassagem(passagem.codigoPassagem);
    };
    preencherPassagem();
  }, []);

  function converterPassagem(codigoPassagem) {
    switch (codigoPassagem) {
      case "ONIBUS":
        setCodigoPassagem(0);
        break;
      case "TREM":
        setCodigoPassagem(1);
        break;
      case "AVIAO":
        setCodigoPassagem(2);
        break;
      case "NAVIO":
        setCodigoPassagem(3);
        break;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    try {
      const res = await api.put(
        "passagem/alterar",
        {
          viagem: {
            idViagem,
          },
          idPassagem,
          origem,
          destino,
          dataHorario,
          tipo: codigoPassagem,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        setMessage("Passagem atualizada com sucesso!");
        setTimeout(() => {
          detalheViagem(idViagem);
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

  async function detalheViagem(idViagem) {
    history("/detalheViagem", { state: { idViagem } });
  }

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
        <h2>Atualizar Passagem</h2>
        <br />
        {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
        {message && <Alert variant={"success"}>{message}</Alert>}
        <Form.Group controlId="formBasicOrigem">
          <Form.Label>Origem</Form.Label>
          <Form.Control
            type="text"
            value={origem}
            onChange={onChangeOrigem}
            required
          />
        </Form.Group>
        <br />
        <br />
        <Form.Group controlId="formBasicDestino">
          <Form.Label>Destino</Form.Label>
          <Form.Control
            type="text"
            value={destino}
            onChange={onChangeDestino}
            required
          />
        </Form.Group>
        <br />
        <br />
        <Form.Group className="mb-3" controlId="formBasicDataHora">
          <Form.Label>Data e Horário</Form.Label>
          <Form.Control
            value={dataHorario}
            onChange={onChangeDataHorario}
            type="datetime-local"
            step="1"
            required
          />
        </Form.Group>
        <br />
        <br />
        <Form.Group className="mb-3" controlId="formBasicLocal">
          <Form.Label>Tipo de Passagem</Form.Label>
          <Form.Select
            aria-label="Default select example"
            value={codigoPassagem}
            onChange={onChangeCodigoPassagem}
          >
            <option>Selecione uma das opções</option>
            <option value={0}>Ônibus</option>
            <option value={1}>Trem</option>
            <option value={2}>Avião</option>
            <option value={3}>Navio</option>
          </Form.Select>
        </Form.Group>
        <br />
        <br />
        <Button variant="primary" type="submit">
          Atualizar
        </Button>
        <br />
        <p />
        <Button variant="light" onClick={() => detalheViagem(idViagem)}>
          Voltar
        </Button>
      </Form>
    </div>
  );
}
export default EditaPassagemComponent;
