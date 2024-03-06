import React, { useState, useEffect } from "react";
import api from "../../service/service";
import { Button, Form, Alert, Card, CardBody } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyToken } from "../../VerifyToken";

function DetalheViagemComponent() {
  const history = useNavigate();
  const location = useLocation();

  const [viagem, setviagem] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const auth = async () => {
      const result = await verifyToken();
      if (!result) {
        localStorage.removeItem("token");
        history("/unauthorized");
      }
    };
    auth();
  });

  useEffect(() => {
    const id = location.state.idViagem;
    const getViagem = async () => {
      //const token = localStorage.getItem("token");
      const res = await api.get("viagem/" + id);
      if (res.status === 200) {
        setviagem(res.data.Viagem);
      }
    };
    getViagem();
  }, []);

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
        <h2>Detalhe da Viagem</h2>
        {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
        {message && <Alert variant={"success"}>{message}</Alert>}

        <Card>
          <Card.Body>{viagem}</Card.Body>
        </Card>
      </Form>
    </div>
  );
}
export default DetalheViagemComponent;
