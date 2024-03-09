import React, { useEffect, useState } from "react";
import api from "../../service/service";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../service/VerifyToken";
import { Trash, Search } from "react-bootstrap-icons";

function ListaViagemComponent() {
  const history = useNavigate();
  const [listaViagem, setListaViagem] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
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
      }
    };
    getViagens();
  }, []);

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
      <div className="row">
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
                  <Trash
                    size={24}
                    color="red"
                    onClick={() => deletarViagem(list.idViagem)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaViagemComponent;
