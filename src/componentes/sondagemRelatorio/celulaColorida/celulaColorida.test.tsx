import { render, screen } from "@testing-library/react";
import CelulaColorida from "./celulaColorida";

describe("CelulaColorida", () => {
	const opcoesResposta = [
		{
			id: 1,
			ordem: 1,
			descricaoOpcaoResposta: "Adequada",
			corFundo: "#7ED957",
			corTexto: "#363636",
			legenda: "Resposta adequada",
		},
		{
			id: 2,
			ordem: 2,
			descricaoOpcaoResposta: "Inadequada",
			corFundo: "#FFDE59",
			corTexto: "#111111",
			legenda: "Resposta inadequada",
		},
	];

	it("deve renderizar texto, cores e legenda quando encontrar opção pela resposta", () => {
		render(
			<CelulaColorida
				opcaoResposta={opcoesResposta}
				resposta={{ id: 10, opcaoRespostaId: 1 }}
			/>,
		);

		const celula = screen.getByText("Adequada");
		expect(celula).toBeInTheDocument();
		expect(celula).toHaveStyle({
			backgroundColor: "#7ED957",
			color: "#363636",
		});
		expect(celula).toHaveAttribute("title", "Resposta adequada");
	});

	it("deve considerar o primeiro item quando resposta for array", () => {
		render(
			<CelulaColorida
				opcaoResposta={opcoesResposta}
				resposta={[
					{ id: 20, opcaoRespostaId: 2 },
					{ id: 21, opcaoRespostaId: 1 },
				]}
			/>,
		);

		const celula = screen.getByText("Inadequada");
		expect(celula).toBeInTheDocument();
		expect(celula).toHaveAttribute("title", "Resposta inadequada");
	});

	it("deve renderizar estado padrão quando opcaoRespostaId for null", () => {
		render(
			<CelulaColorida
				opcaoResposta={opcoesResposta}
				resposta={{ id: 30, opcaoRespostaId: null }}
			/>,
		);

		const celula = screen.getByText("Vazio");
		expect(celula).toBeInTheDocument();
		expect(celula).toHaveStyle({
			backgroundColor: "#FFFFFF",
			color: "#BFBFC2",
		});
		expect(celula).toHaveAttribute("title", "");
	});

	it("deve renderizar estado padrão quando não encontrar opção para o id da resposta", () => {
		render(
			<CelulaColorida
				opcaoResposta={opcoesResposta}
				resposta={{ id: 40, opcaoRespostaId: 999 }}
			/>,
		);

		const celula = screen.getByText("Vazio");
		expect(celula).toBeInTheDocument();
		expect(celula).toHaveAttribute("title", "");
	});
});
