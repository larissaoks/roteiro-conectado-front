// CadastroViagemComponent.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import CadastroViagemComponent from "../src/components/viagem/cadastroViagemComponent";
import { fireEvent } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("CadastroViagemComponent", () => {
  it("deve renderizar o formulário de cadastro de viagem", () => {
    render(
      <BrowserRouter>
        <CadastroViagemComponent />
      </BrowserRouter>
    );

    expect(screen.getByText("Cadastrar Viagem")).toBeInTheDocument();
    expect(screen.getByLabelText("Destino")).toBeInTheDocument();
    expect(screen.getByLabelText("Data de Início")).toBeInTheDocument();
    expect(screen.getByLabelText("Data de Fim")).toBeInTheDocument();
  });

  it("deve exibir uma mensagem de erro se a data final for anterior à data de início", async () => {
    render(
      <BrowserRouter>
        <CadastroViagemComponent />
      </BrowserRouter>
    );

    const destinoInput = screen.getByLabelText("Destino");
    const dtInicioInput = screen.getByLabelText("Data de Início");
    const dtFimInput = screen.getByLabelText("Data de Fim");
    const submitButton = screen.getByText("Cadastrar");

    fireEvent.change(destinoInput, { target: { value: "Paris" } });
    fireEvent.change(dtInicioInput, { target: { value: "2023-01-01" } });
    fireEvent.change(dtFimInput, { target: { value: "2022-12-31" } });

    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(
      "A data final deve ser posterior à data de início"
    );
    expect(errorMessage).toBeInTheDocument();
  });  
});


