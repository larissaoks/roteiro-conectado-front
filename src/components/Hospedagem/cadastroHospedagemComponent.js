import React, { useState, useEffect } from "react";
import api from "../../service/service";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../service/VerifyToken";

function CadastroHospedagemComponent() {
  const history = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [nomeLocal, setnomeLocal] = useState(null);
  const [checkIn, setcheckIn] = useState(null);
  const [checkOut, setcheckOut] = useState(null);
  
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

  async function resgatarCEP(cep){

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

        <Button variant="light" onClick={() => history("/home")}>
          Voltar
        </Button>
      </Form>
    </div>
  );
}
export default CadastroHospedagemComponent;
