import React, {useState, useEffect} from "react";
import api from "../../service/service";
import {Alert, Card, Container, Row, Col} from "react-bootstrap";
import {useNavigate, useLocation} from "react-router-dom";
import {verifyToken} from "../../service/VerifyToken";
import {format, isPast} from 'date-fns';
import {FaPlane, FaBed, FaMapMarkerAlt} from "react-icons/fa";
import "./DetalheViagemComponent.css";

function DetalheViagemComponent() {
    const history = useNavigate();
    const location = useLocation();

    const [viagem, setViagem] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
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

    useEffect(() => {
        const id = location.state.idViagem;
        const getViagem = async () => {
            try {
                const res = await api.get("viagem/" + id, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                if (res.status === 200) {
                    const viagemData = res.data.Viagem;
                    // Combina todas as atividades em uma única lista
                    const atividades = [
                        ...viagemData.passagems.map((passagem) => ({
                            tipo: "Passagem",
                            sortValor: passagem.dataHorario,
                            tipoPassagem: passagem.tipo,
                            origem: passagem.origem,
                            destino: passagem.destino,
                            dataHora: passagem.dataHorario
                        })),
                        ...viagemData.hospedagems.map((hospedagem) => ({
                            tipo: "Hospedagem",
                            sortValor: hospedagem.checkIn,
                            nome: hospedagem.nomeLocal,
                            checkIn: hospedagem.checkIn,
                            checkOut: hospedagem.checkOut,
                            endereco: `${hospedagem.endereco.logradouro}, ${hospedagem.endereco.cidade} - ${hospedagem.endereco.uf}, ${hospedagem.endereco.cep}`

                        })),
                        ...viagemData.roteiros.map((roteiro) => ({
                            tipo: "Roteiro",
                            sortValor: roteiro.dataHora,
                            dia: roteiro.dia,
                            local: roteiro.local,
                            dataHora: roteiro.dataHora
                        })),
                    ];
                    // Ordena todas as atividades por data
                    atividades.sort((a, b) => new Date(a.sortValor).getTime() - new Date(b.sortValor).getTime());
                    setViagem({...viagemData, atividades});
                }
            } catch (error) {
                setErrorMessage("Erro ao carregar informações da viagem.");
            }
        };
        getViagem();
    }, []);

    return (
        <Container fluid>
            <h2 className="my-4">Detalhe da Viagem</h2>
            {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
            {viagem &&
                viagem.atividades.map((atividade, index) => (
                    <Row key={index} className={`mb-4 ${
                        (atividade.tipo === 'Passagem' && isPast(new Date(atividade.sortValor))) ||
                        (atividade.tipo === 'Hospedagem' && isPast(new Date(atividade.checkOut))) ||
                        (atividade.tipo === 'Roteiro' && isPast(new Date(atividade.sortValor)))
                            ? 'card-past'
                            : ''
                    }`}>
                        <Col sm={12} md={8} lg={6} className="mx-auto">
                            <Card className="activity-card">
                                <Card.Body>
                                    <h5 className="activity-title">{atividade.tipo}</h5>
                                    {atividade.tipo === "Passagem" && (
                                        <div>
                                            <FaPlane className="icon"/>
                                            <p className="mb-1"><strong>Tipo:</strong> {atividade.tipoPassagem}</p>
                                            <p className="mb-1"><strong>Origem:</strong> {atividade.origem}</p>
                                            <p className="mb-1"><strong>Destino:</strong> {atividade.destino}</p>
                                            <p className="mb-0">
                                                <strong>Data:</strong> {format(new Date(atividade.dataHora), 'dd/MM/yyyy HH:mm')}
                                            </p>
                                        </div>
                                    )}
                                    {atividade.tipo === "Hospedagem" && (
                                        <div>
                                            <FaBed className="icon"/>
                                            <p className="mb-1"><strong>Nome:</strong> {atividade.nome}</p>
                                            <p className="mb-1">
                                                <strong>Check-in:</strong> {format(new Date(atividade.checkIn), 'dd/MM/yyyy HH:mm')}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Check-out:</strong> {format(new Date(atividade.checkOut), 'dd/MM/yyyy HH:mm')}
                                            </p>
                                            <p className="mb-0"><strong>Endereço:</strong> {atividade.endereco}</p>
                                        </div>
                                    )}
                                    {atividade.tipo === "Roteiro" && (
                                        <div>
                                            <FaMapMarkerAlt className="icon"/>
                                            <p className="mb-1"><strong>Dia:</strong> {atividade.dia}</p>
                                            <p className="mb-1"><strong>Local:</strong> {atividade.local}</p>
                                            <p className="mb-0">
                                                <strong>Data:</strong> {format(new Date(atividade.dataHora), 'dd/MM/yyyy HH:mm')}
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
