import React, { useState, useEffect } from "react";
import { api } from "../../service/service";
import {
  Alert,
  Card,
  Container,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyToken } from "../../service/VerifyToken";
import { format, isPast } from "date-fns";
import {
  FaPlane,
  FaBed,
  FaMapMarkerAlt,
  FaPen,
  FaTrash,
  FaPlusCircle,
} from "react-icons/fa";
import "./DetalheViagemComponent.css";

function DetalheViagemComponent() {
  const history = useNavigate();
  const location = useLocation();

  const [viagem, setViagem] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [show, setShow] = useState(false);
  const token = localStorage.getItem("token");
  const idViagem = location.state.idViagem;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    const getViagem = async () => {
      try {
        const res = await api.get("viagem/" + idViagem, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          const viagemData = res.data.Viagem;
          const atividades = [
            ...viagemData.passagems.map((passagem) => ({
              tipo: "Passagem",
              sortValor: passagem.dataHorario,
              tipoPassagem: passagem.tipo,
              origem: passagem.origem,
              destino: passagem.destino,
              dataHora: passagem.dataHorario,
              idPassagem: passagem.idPassagem,
            })),
            ...viagemData.hospedagems.map((hospedagem) => ({
              tipo: "Hospedagem",
              sortValor: hospedagem.checkIn,
              nome: hospedagem.nomeLocal,
              checkIn: hospedagem.checkIn,
              checkOut: hospedagem.checkOut,
              endereco: `${hospedagem.endereco.logradouro}, ${hospedagem.endereco.cidade} - ${hospedagem.endereco.uf}, ${hospedagem.endereco.cep}`,
              idHospedagem: hospedagem.idHospedagem,
            })),
            ...viagemData.roteiros.map((roteiro) => ({
              tipo: "Roteiro",
              sortValor: roteiro.dataHora,
              dia: roteiro.dia,
              local: roteiro.local,
              dataHora: roteiro.dataHora,
              idRoteiro: roteiro.idRoteiro,
            })),
          ];
          atividades.sort(
            (a, b) =>
              new Date(a.sortValor).getTime() - new Date(b.sortValor).getTime()
          );
          setViagem({ ...viagemData, atividades });
        }
      } catch (error) {
        setErrorMessage("Erro ao carregar informações da viagem.");
      }
    };
    getViagem();
  }, []);

  function handleAddActivity(tipo) {
    if (tipo === "Roteiro") {
      history("/cadastroRoteiro", { state: { idViagem } });
    }
    if (tipo === "Passagem") {
      history("/cadastroPassagem", { state: { idViagem } });
    }
    if (tipo === "Hospedagem") {
      history("/cadastroHospedagem", { state: { idViagem } });
    }
  }

  async function deletarPassagem(id) {
    try {
      const res = await api.delete("passagem/deletar/" + id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setViagem({ ...viagem });
        handleClose();
        setMessage("Passagem excluída com sucesso!");
      }
    } catch (err) {
      if (err.response && err.response.status === 204) {
        setErrorMessage("Erro ao excluir passagem.");
      } else {
        setErrorMessage(
          "Erro interno do servidor. Contate o Administrador da página"
        );
      }
    }
  }

  async function deletarRoteiro(id) {
    try {
      const res = await api.delete("roteiro/deletar/" + id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        handleClose();
        setMessage("Roteiro excluído com sucesso!");
      }
    } catch (err) {
      if (err.response && err.response.status === 204) {
        setErrorMessage("Erro ao excluir passagem.");
      } else {
        setErrorMessage(
          "Erro interno do servidor. Contate o Administrador da página"
        );
      }
    }
  }

  async function deletarHospedagem(id) {
    try {
      const res = await api.delete("hospedagem/deletar/" + id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        handleClose();
        setViagem({ ...viagem });
        setMessage("Hospedagem excluída com sucesso!");
      }
    } catch (err) {
      if (err.response && err.response.status === 204) {
        setErrorMessage("Erro ao excluir passagem.");
      } else {
        setErrorMessage(
          "Erro interno do servidor. Contate o Administrador da página"
        );
      }
    }
  }

  return (
    <Container fluid>
      <h2 className="my-4">Detalhe da Viagem</h2>
      {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
      {message && <Alert variant={"success"}>{message}</Alert>}
      {viagem && (
        <Col sm={12} md={8} lg={6} className="mx-auto">
          <Card className="activity-card">
            <Card.Body>
              <h5 className="activity-title">{viagem.destino}</h5>

              <div>
                <p className="mb-1">
                  <strong>Início:</strong>{" "}
                  {format(new Date(viagem.dteInicio), "dd/MM/yyyy")}
                </p>
                <p className="mb-1">
                  <strong>Fim:</strong>{" "}
                  {format(new Date(viagem.dteFim), "dd/MM/yyyy")}
                </p>
                <p className="mb-1">
                  <FaPen />
                </p>
              </div>
            </Card.Body>
          </Card>
          <br />
        </Col>
      )}

      {!viagem?.passagems.length && (
        <Col sm={12} md={8} lg={6} className="mx-auto">
          <Card className="activity-card">
            <Card.Body>
              <h5 className="activity-title">Passagem</h5>
              <div>
                <p className="mb-1">
                  <FaPlusCircle
                    size={16}
                    onClick={() => handleAddActivity("Passagem")}
                  />
                </p>
              </div>
            </Card.Body>
          </Card>
          <br />
        </Col>
      )}
      {!viagem?.hospedagems.length && (
        <Col sm={12} md={8} lg={6} className="mx-auto">
          <Card className="activity-card">
            <Card.Body>
              <h5 className="activity-title">Hospedagem</h5>
              <div>
                <p className="mb-1">
                  <FaPlusCircle
                    size={16}
                    onClick={() => handleAddActivity("Hospedagem")}
                  />
                </p>
              </div>
            </Card.Body>
          </Card>
          <br />
        </Col>
      )}
      {!viagem?.roteiros.length && (
        <Col sm={12} md={8} lg={6} className="mx-auto">
          <Card className="activity-card">
            <Card.Body>
              <h5 className="activity-title">Roteiro</h5>
              <div>
                <p className="mb-1">
                  <FaPlusCircle
                    size={16}
                    onClick={() => handleAddActivity("Roteiro")}
                  />
                </p>
              </div>
            </Card.Body>
          </Card>
          <br />
        </Col>
      )}

      {viagem &&
        viagem.atividades.map((atividade, index) => (
          <Row
            key={index}
            className={`mb-4 ${
              (atividade.tipo === "Passagem" &&
                isPast(new Date(atividade.sortValor))) ||
              (atividade.tipo === "Hospedagem" &&
                isPast(new Date(atividade.checkOut))) ||
              (atividade.tipo === "Roteiro" &&
                isPast(new Date(atividade.sortValor)))
                ? "card-past"
                : ""
            }`}
          >
            <Col sm={12} md={8} lg={6} className="mx-auto">
              <Card className="activity-card">
                <Card.Body>
                  <h5 className="activity-title">{atividade.tipo}</h5>
                  {atividade.tipo === "Passagem" && (
                    <div>
                      <FaPlane className="icon" />
                      <p className="mb-1">
                        <strong>Tipo:</strong> {atividade.tipoPassagem}
                      </p>
                      <p className="mb-1">
                        <strong>Origem:</strong> {atividade.origem}
                      </p>
                      <p className="mb-1">
                        <strong>Destino:</strong> {atividade.destino}
                      </p>
                      <p className="mb-0">
                        <strong>Data:</strong>{" "}
                        {format(
                          new Date(atividade.dataHora),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </p>
                      <p className="mb-1">
                        <FaPen /> <FaTrash color="red" onClick={handleShow} />
                      </p>
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
                          Você tem certeza que deseja excluir a passagem para{" "}
                          <b>{atividade.destino}</b>? Esta ação não pode ser
                          desfeita!
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              deletarPassagem(atividade.idPassagem)
                            }
                          >
                            Deletar
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <p className="mb-1">
                        <FaPlusCircle
                          size={16}
                          onClick={() => handleAddActivity("Passagem")}
                        />
                      </p>
                    </div>
                  )}
                  {atividade.tipo === "Hospedagem" && (
                    <div>
                      <FaBed className="icon" />
                      <p className="mb-1">
                        <strong>Nome:</strong> {atividade.nome}
                      </p>
                      <p className="mb-1">
                        <strong>Check-in:</strong>{" "}
                        {format(
                          new Date(atividade.checkIn),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </p>
                      <p className="mb-1">
                        <strong>Check-out:</strong>{" "}
                        {format(
                          new Date(atividade.checkOut),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </p>
                      <p className="mb-0">
                        <strong>Endereço:</strong> {atividade.endereco}
                      </p>
                      <p className="mb-1">
                        <FaPen />{" "}
                        <FaTrash color="red" onClick={() => handleShow} />
                      </p>
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
                          Você tem certeza que deseja excluir a hospedagem{" "}
                          <b>{atividade.nome}</b>? Esta ação não pode ser
                          desfeita!
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              deletarHospedagem(atividade.idHospedagem)
                            }
                          >
                            Deletar
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <p className="mb-1">
                        <FaPlusCircle
                          size={16}
                          onClick={() => handleAddActivity("Hospedagem")}
                        />
                      </p>
                    </div>
                  )}
                  {atividade.tipo === "Roteiro" && (
                    <div>
                      <FaMapMarkerAlt className="icon" />
                      <p className="mb-1">
                        <strong>Dia:</strong> {atividade.dia}
                      </p>
                      <p className="mb-1">
                        <strong>Local:</strong> {atividade.local}
                      </p>
                      <p className="mb-0">
                        <strong>Data:</strong>{" "}
                        {format(
                          new Date(atividade.dataHora),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </p>
                      <p className="mb-1">
                        <FaPen /> <FaTrash color="red" onClick={handleShow} />
                      </p>
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
                          Você tem certeza que deseja excluir o roteiro para{" "}
                          <b>{atividade.local}</b>? Esta ação não pode ser
                          desfeita!
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => deletarRoteiro(atividade.idRoteiro)}
                          >
                            Deletar
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <p className="mb-1">
                        <FaPlusCircle
                          size={16}
                          onClick={() => handleAddActivity("Roteiro")}
                        />
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))}
    </Container>
  );
}

export default DetalheViagemComponent;
