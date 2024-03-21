import React, { useState, useEffect } from "react";
import { cepApi } from "../../service/service";
import { Button, Form, Alert, InputGroup, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyToken } from "../../service/VerifyToken";
import { Search } from "react-bootstrap-icons";
import { api } from "../../service/service";

function CadastroHospedagemComponent() {
  const history = useNavigate();
  const location = useLocation();

  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [nomeLocal, setnomeLocal] = useState(null);
  const [cep, setCep] = useState(null);
  const [logradouro, setLogradouro] = useState(null);
  const [cidade, setCidade] = useState(null);
  const [uf, setUf] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [loading, setLoading] = useState(false);
  const idViagem = location.state.idViagem;

  const onChangeNomeLocal = (e) => setnomeLocal(e.target.value);
  const onChangeCheckIn = (e) => setCheckIn(e.target.value);
  const onChangeCheckOut = (e) => setCheckOut(e.target.value);
  const onChangeCep = (e) => setCep(e.target.value);
  const onChangeLogradouro = (e) => setLogradouro(e.target.value);

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
    try {
      setLoading(true);
      const json = await cepApi.get(`${cep}/json`);
      montarEndereco(json.data);
    } catch (err) {
      console.log("erro: ", err);
      setLoading(false);
      setErrorMessage("Erro com API de CEP. Contate o Administrador da página");
    }
  }

  function montarEndereco(json) {
    setLogradouro(json.logradouro);
    setCidade(json.localidade);
    setUf(json.uf);
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMessage(
        "A data de Checkout deve ser posterior à data de Checkin"
      );
      return;
    }
    try {
      const res = await api.post(
        "hospedagem/criar",
        {
          idViagem,
          nomeLocal,
          checkIn,
          checkOut,
          endereco: {
            logradouro,
            cidade,
            uf,
            cep,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        setMessage("Hospedagem cadastrada com sucesso!");
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
        <h2>Cadastrar Hospedagem</h2>
        {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
        {message && <Alert variant={"success"}>{message}</Alert>}

        <Form.Group controlId="formBasicDestino">
          <Form.Label>Nome do Local</Form.Label>
          <Form.Control
            type="text"
            value={nomeLocal}
            onChange={onChangeNomeLocal}
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicDestino">
          <Form.Label>CEP</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              value={cep}
              onChange={onChangeCep}
              required
            />
            <Button variant="light">
              <Search size={16} onClick={() => buscarCEP(cep)} />
            </Button>
          </InputGroup>
          {loading ? <Spinner animation="border" variant="primary" /> : ""}
        </Form.Group>

        <Form.Group controlId="formBasicDestino">
          <Form.Label>Logradouro</Form.Label>
          <Form.Control
            type="text"
            value={logradouro}
            onChange={onChangeLogradouro}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicDestino">
          <Form.Label>UF</Form.Label>
          <Form.Control type="text" value={uf} readOnly />
        </Form.Group>

        <Form.Group controlId="formBasicDestino">
          <Form.Label>Cidade</Form.Label>
          <Form.Control type="text" value={cidade} readOnly />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckIn">
          <Form.Label>Check-In</Form.Label>
          <Form.Control
            value={checkIn}
            onChange={onChangeCheckIn}
            type="datetime-local"
            step="1"
            min={new Date().toLocaleDateString()}
            required
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
            required
          />
        </Form.Group>
        <Button variant="light" onClick={() => detalheViagem(idViagem)}>
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
