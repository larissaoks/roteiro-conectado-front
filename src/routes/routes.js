import LoginComponent from "../components/usuario/loginComponent";
import CadastroComponent from "../components/usuario/cadastroComponent";
import Unauthorized from "../components/Unauthorized";
import { Routes, Route } from "react-router-dom";

function Rotas() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginComponent />} />
      <Route path={"/cadastro"} element={<CadastroComponent />} />
      {/* <Route path={"/home"} element={<ListAgendamentoComponent/>}/>
        <Route path={"/cadastroViagem"} element={<LoginAdminComponent/>}/>*/}
      <Route path={"/unauthorized"} element={<Unauthorized />} />
    </Routes>
  );
}

export default Rotas;
