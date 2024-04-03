import React, { useState, useEffect } from "react";
import { api } from "../../service/service";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyToken } from "../../service/VerifyToken";
import { getToken } from "../../util/getTokenFromLocalStorage";


function CadastroRoteiroComponent() {
  const history = useNavigate();
  const location = useLocation();

  const [dia, setDia] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [local, setLocal] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const idViagem = location.state.idViagem;

  const onChangeDia = (e) => setDia(e.target.value);
  const onChangeDataHora = (e) => setDataHora(e.target.value);
  const onChangeLocal = (e) => setLocal(e.target.value);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    try {
      const res = await api.post(
        "roteiro/criar",
        {
          idViagem,
          dia,
          dataHora,
          local,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        setMessage("Roteiro cadastrado com sucesso!");
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
        <h2>Cadastrar Roteiro</h2>
        <br />
        {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
        {message && <Alert variant={"success"}>{message}</Alert>}
        <Form.Group controlId="formBasicDia">
          <Form.Label>Dia</Form.Label>
          <Form.Control
            type="number"
            value={dia}
            onChange={onChangeDia}
            required
          />
        </Form.Group>
        <br />
        <br />
        <Form.Group className="mb-3" controlId="formBasicDataHora">
          <Form.Label>Data e Horário</Form.Label>
          <Form.Control
            value={dataHora}
            onChange={onChangeDataHora}
            type="datetime-local"
            step="1"
            min={new Date().toLocaleDateString()}
            required
          />
        </Form.Group>
        <br />
        <br />
        <Form.Group className="mb-3" controlId="formBasicLocal">
          <Form.Label>Local</Form.Label>
          <Form.Control
            value={local}
            onChange={onChangeLocal}
            type="text"
            required
          />
        </Form.Group>
        <br />
        <br />
        <Button variant="primary" type="submit">
          Cadastrar
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
export default CadastroRoteiroComponent;
