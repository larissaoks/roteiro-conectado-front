import React, { useState, useEffect } from "react";
import { api } from "../../service/service";
import { Button, Spinner, Modal } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

function AtivaContaComponent() {
  const history = useNavigate();
  const location = useLocation();
  const token = location.pathname.slice(12);

  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    handleShow();
    const handleSubmit = async () => {
      try {
        const res = await api.get("usuario/validaConta/" + token, {});
        if (res.status === 200) {
          setLoading(true);
          setShow(true);
          setTimeout(() => {
            history("/");
          }, 3000);
        }
      } catch (err) {
        setLoading(false);
        setShow(true);
        if (err.response && err.response.status === 401) {
          setErrorMessage("Token inválido");
        } else {
          setErrorMessage(
            "Erro interno do servidor. Contate o Administrador da página"
          );
        }
      }
    };
    handleSubmit();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {errorMessage ? (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Error!</Modal.Title>
              <FaTimesCircle color="red" size={16} />
            </Modal.Header>
            <Modal.Body>{errorMessage}</Modal.Body>
          </Modal>
        </>
      ) : (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Ativando Conta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Spinner animation="border" role="status" />
              <br /> <br />
              Sua conta está sendo ativada, quando finalizar você será
              redirecionado para tela de Login!
            </Modal.Body>
          </Modal>
        </>
      )}

      <br />
    </div>
  );
}
export default AtivaContaComponent;
