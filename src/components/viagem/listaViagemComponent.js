import React, { useEffect, useState } from "react";
import { api } from "../../service/service";
import { Alert, Modal, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../service/VerifyToken";
import { Trash, Search } from "react-bootstrap-icons";

function ListaViagemComponent() {
  const history = useNavigate();

  const [listaViagem, setListaViagem] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
  });

  useEffect(() => {
    const getViagens = async () => {
      const res = await api.get("viagem/retornaViagens", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setListaViagem(res.data.Viagens);
        setLoading(false);
      }
    };
    getViagens();
  });

  async function deletarViagem(idViagem) {
    try {
      const res = await api.delete("viagem/deletar/" + idViagem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setListaViagem([...listaViagem]);
        setMessage("Viagem excluída com sucesso!");
      }
    } catch (err) {
      if (err.response && err.response.status === 204) {
        setErrorMessage("Erro ao excluir viagem.");
      } else {
        setErrorMessage(
          "Erro interno do servidor. Contate o Administrador da página"
        );
      }
    }
  }

  async function detalheViagem(idViagem) {
    history("/detalheViagem", { state: { idViagem } });
  }

  return (
    <div>
      <h1>Minhas Viagens</h1>
      <br></br>
      {loading ? (<Spinner animation="border" variant="primary" />) : (<div className="row">
        {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
        {message && <Alert variant={"success"}>{message}</Alert>}
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Destino</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Detalhe</th>
              <th>Deletar</th>
            </tr>
          </thead>
          <tbody>
            {listaViagem.map((list) => (
              <tr key={list.idViagem}>
                <td>{list.destino}</td>
                <td>{list.dteInicio}</td>
                <td>{list.dteFim}</td>
                <td>
                  <Search
                    size={24}
                    onClick={() => detalheViagem(list.idViagem)}
                  />
                </td>
                <td>
                  <Trash size={24} color="red" onClick={handleShow} />
                  <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Deletar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Você tem certeza que deseja excluir a viagem para{" "}
                      <b>{list.destino}</b>? Esta ação não pode ser desfeita e
                      apagará todo planejamento criado para esta viagem.
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deletarViagem(list.idViagem)}
                      >
                        Deletar
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>)}
      
      
    </div>
  );
}

export default ListaViagemComponent;
