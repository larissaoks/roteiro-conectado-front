import React, { useEffect, useState } from "react";
import api from "../../service/service";
//import { Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../VerifyToken";

function ListaViagemComponent() {
  const history = useNavigate();
  const [listaViagem, setListaViagem] = useState([]);
  /*const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);*/

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
    const getViagens = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("viagem/retornaViagens", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setListaViagem(res.data.Viagens);
      }
    };
    getViagens();
  }, []);

  return (
    <div>
      <h1>Minhas Viagens</h1>
      <br></br>
      <div className="row">
        {/* {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
        {message && <Alert variant={"success"}>{message}</Alert>} */}
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th> Serviço</th>
              <th> Profissional</th>
              <th> Data</th>
              <th> Hora</th>
              <th> Valor</th>
            </tr>
          </thead>
          <tbody>{listaViagem.map((list) => console.log(list))}</tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaViagemComponent;
