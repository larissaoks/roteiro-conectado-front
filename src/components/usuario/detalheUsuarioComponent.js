import React, { useState, useEffect } from "react";
import { api } from "../../service/service";
import { Button, Form, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../service/VerifyToken";
import { getToken } from "../../util/getTokenFromLocalStorage";

function DetalheUsuarioComponent() {
  const history = useNavigate();

  const [senhaAntiga, setSenhaAntiga] = useState(null);
  const [senhaAtual, setSenhaAtual] = useState(null);
  const [senhaNova, setSenhaNova] = useState(null);
  const [confirmaSenhaNova, setConfirmaSenhaNova] = useState(null);
  const [nome, setNome] = useState(null);
  const [id, setId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageModal, setMessageModal] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
    setMessageModal(
      "Você tem certeza que deseja excluir a sua conta? " +
        "Esta ação não pode ser desfeita e apagará todas as informações salvas."
    );
  };

  const token = getToken();

  const onChangeNome = (e) => setNome(e.target.value);
  const onChangeSenhaAtual = (e) => setSenhaAtual(e.target.value);
  const onChangeSenhaNova = (e) => setSenhaNova(e.target.value);
  const onChangeConfirmaSenhaNova = (e) => setConfirmaSenhaNova(e.target.value);

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
    const retornaUsuario = async () => {
      try {
        const res = await api.get("usuario/retornaUsuario", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setSenhaAntiga(res.data.Usuario.senha);
          setNome(res.data.Usuario.nome);
          setId(res.data.Usuario.idUsuario);
        }
      } catch (err) {
        console.log(err);
      }
    };
    retornaUsuario();
  }, [token]);

  const deletarUsuario = async () => {
    try {
      const res = await api.delete("usuario/deletar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        console.log(res);
        setMessageModal("Conta excluída com sucesso!");
        setTimeout(() => {
          localStorage.removeItem("token");
          history("/");
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 204) {
        setErrorMessage("Erro ao excluir conta.");
      } else {
        setErrorMessage(
          "Erro interno do servidor. Contate o Administrador da página"
        );
      }
    }
  };

  const comparaSenhaAntigaComSenhaDigitada = () => {
    if (senhaAtual) {
      return senhaAntiga === senhaAtual;
    }
  };

  const comparaSenhaNovaComConfirmacao = () => {
    if (senhaNova && confirmaSenhaNova) {
      return senhaNova === confirmaSenhaNova;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    comparaSenhaAntigaComSenhaDigitada()
      ? setErrorMessage("Senha não confere com a senha digitada")
      : setErrorMessage("");
    comparaSenhaNovaComConfirmacao()
      ? setErrorMessage("Senhas não conferem!")
      : setErrorMessage("");

    try {
      const res = await api.put(
        "usuario/alterar",
        {
          nome,
          senha: senhaNova ? senhaNova : senhaAntiga,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        console.log(res);
        setMessage("Alterações feitas com sucesso!");
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
        <h2>Perfil</h2>
        <img
          src="perfil.png"
          width="70"
          height="70"
          className="d-inline-block align-top"
          alt="perfil"
        />
        <br />

        <br />
        {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
        {message && <Alert variant={"success"}>{message}</Alert>}
        <Form.Group controlId="formBasicDia">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="string" value={nome} onChange={onChangeNome} />
        </Form.Group>
        <br />
        <br />
        <Form.Group controlId="formBasicDia">
          <Form.Label>Senha Atual</Form.Label>
          <Form.Control type="password" onChange={onChangeSenhaAtual} />
        </Form.Group>
        <br />
        <br />
        <Form.Group className="mb-3" controlId="formBasicDataHora">
          <Form.Label>Nova Senha</Form.Label>
          <Form.Control
            value={senhaNova}
            onChange={onChangeSenhaNova}
            type="password"
          />
        </Form.Group>
        <br />
        <br />
        <Form.Group className="mb-3" controlId="formBasicDataHora">
          <Form.Label>Confirma a nova senha</Form.Label>
          <Form.Control
            value={confirmaSenhaNova}
            onChange={onChangeConfirmaSenhaNova}
            type="password"
          />
        </Form.Group>
        <br />
        <br />
        <Button variant="primary" type="submit">
          Atualizar
        </Button>
        <br />
        <br />
        <Button variant="danger" onClick={handleShow}>
          Apagar Conta
        </Button>
        <br />
      </Form>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Deletar Conta</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageModal}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => deletarUsuario()}>
            Deletar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default DetalheUsuarioComponent;
