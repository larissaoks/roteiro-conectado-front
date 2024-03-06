import LoginComponent from "../components/usuario/loginComponent";
import CadastroComponent from "../components/usuario/cadastroComponent";
import Unauthorized from "../components/Unauthorized";
import CadastroViagemComponent from "../components/viagem/cadastroViagemComponent";
import DetalheViagemComponent from "../components/viagem/detalheViagemComponent";
import ListaViagemComponent from "../components/viagem/listaViagemComponent";
import CadastroHospedagemComponent from "../components/Hospedagem/cadastroHospedagemComponent";
import { Routes, Route } from "react-router-dom";

function Rotas() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginComponent />} />
      <Route path={"/cadastro"} element={<CadastroComponent />} />
      <Route path={"/home"} element={<ListaViagemComponent />} />
      <Route path={"/cadastroViagem"} element={<CadastroViagemComponent />} />
      <Route path={"/detalheViagem"} element={<DetalheViagemComponent />} />
      <Route
        path={"/cadastroHospedagem"}
        element={<CadastroHospedagemComponent />}
      />
      <Route path={"/unauthorized"} element={<Unauthorized />} />
    </Routes>
  );
}

export default Rotas;
