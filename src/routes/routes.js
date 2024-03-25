import LoginComponent from "../components/usuario/loginComponent";
import CadastroComponent from "../components/usuario/cadastroComponent";
import Unauthorized from "../components/Unauthorized";
import CadastroViagemComponent from "../components/viagem/cadastroViagemComponent";
import DetalheViagemComponent from "../components/viagem/detalheViagemComponent";
import ListaViagemComponent from "../components/viagem/listaViagemComponent";
import CadastroHospedagemComponent from "../components/Hospedagem/cadastroHospedagemComponent";
import { Routes, Route } from "react-router-dom";
import CadastroRoteiroComponent from "../components/Roteiro/cadastroRoteiroComponent";
import CadastroPassagemComponent from "../components/Passagem/cadastroPassagemComponent";
import EditaViagemComponent from "../components/viagem/editaViagemComponent";

function Rotas() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginComponent />} />
      <Route path={"/cadastro"} element={<CadastroComponent />} />
      <Route path={"/home"} element={<ListaViagemComponent />} />
      <Route path={"/cadastroViagem"} element={<CadastroViagemComponent />} />
      <Route path={"/detalheViagem"} element={<DetalheViagemComponent />} />
      <Route path={"/editaViagem"} element={<EditaViagemComponent />} />
      <Route
        path={"/cadastroHospedagem"}
        element={<CadastroHospedagemComponent />}
      />
      <Route path={"/cadastroRoteiro"} element={<CadastroRoteiroComponent />} />
      <Route
        path={"/cadastroPassagem"}
        element={<CadastroPassagemComponent />}
      />
      <Route path={"/unauthorized"} element={<Unauthorized />} />
    </Routes>
  );
}

export default Rotas;
