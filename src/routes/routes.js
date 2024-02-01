import LoginComponent from "../components/usuario/loginComponent";
import CadastroComponent from "../components/usuario/cadastroComponent";
import Unauthorized from "../components/Unauthorized";
import CadastroViagemComponent from "../components/viagem/cadastroViagemComponent";
import ListaViagemComponent from "../components/viagem/listaViagemComponent";
import { Routes, Route } from "react-router-dom";

function Rotas() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginComponent />} />
      <Route path={"/cadastro"} element={<CadastroComponent />} />
      <Route path={"/home"} element={<ListaViagemComponent />} />
      <Route path={"/cadastroViagem"} element={<CadastroViagemComponent />} />
      <Route path={"/unauthorized"} element={<Unauthorized />} />
    </Routes>
  );
}

export default Rotas;
