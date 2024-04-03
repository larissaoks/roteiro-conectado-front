import React, { useState } from "react";
import { Nav, Navbar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../service/VerifyToken";
import { getToken } from "../util/getTokenFromLocalStorage";

function NavigationBar() {
  const history = useNavigate();
  const auth = async () => {
    const result = await verifyToken();
    if (!result) {
      localStorage.removeItem("token");
      history("/");
    }
  };

  function verificaTokenVazio() {
    const token = getToken();
    if (token === null || token === undefined) {
      return true;
    } else {
      auth();
      return false;
    }
  }

  function deslogar() {
    localStorage.removeItem("token");
    history("/");
  }

  return (
    <div>
      <Navbar bg="light" variant="light">
        {verificaTokenVazio() ? (
          <>
            <Navbar.Brand style={{ marginLeft: "1%" }}>
              Roteiro Conectado
            </Navbar.Brand>
            <Navbar.Collapse
              style={{ marginRight: "0.3%" }}
              className="justify-content-end"
            >
              <Nav.Link>
                <Button variant="light" onClick={() => history("/cadastro")}>
                  Cadastre-se
                </Button>
              </Nav.Link>
            </Navbar.Collapse>
          </>
        ) : (
          <>
            <Navbar.Brand href="/home" style={{ marginLeft: "1%" }}>
              Roteiro Conectado
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="home">Início</Nav.Link>
              <Nav.Link href="cadastroViagem">Cadastrar Viagem</Nav.Link>
            </Nav>
            <Navbar.Toggle />

            <Navbar.Collapse
              style={{ marginRight: "0.3%" }}
              className="justify-content-end"
            >
              <Navbar.Text style={{ marginRight: "1%" }}>Bem vindo</Navbar.Text>
              <Navbar.Brand href="detalhePerfil">
                <img
                  src="perfil.png"
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="perfil"
                />
              </Navbar.Brand>
              <Nav.Link onClick={() => deslogar()}>Deslogar</Nav.Link>
            </Navbar.Collapse>
          </>
        )}
      </Navbar>
    </div>
  );
}
export default NavigationBar;
