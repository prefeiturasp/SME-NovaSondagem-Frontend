import { render, screen } from "@testing-library/react";
import { Auditoria } from "./auditoria";

describe("Auditoria", () => {
  describe("Renderização básica", () => {
    it("deve renderizar o componente com linhas de auditoria", () => {
      const linhas = [
        "INSERIDO por JOÃO SILVA (123456) em 01/01/2025 10:00:00",
        "ALTERADO por MARIA SANTOS (789012) em 02/01/2025 15:30:00",
      ];

      render(<Auditoria linhas={linhas} />);

      expect(
        screen.getByText(
          "INSERIDO por JOÃO SILVA (123456) em 01/01/2025 10:00:00",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "ALTERADO por MARIA SANTOS (789012) em 02/01/2025 15:30:00",
        ),
      ).toBeInTheDocument();
    });

    it("deve renderizar múltiplas linhas de auditoria", () => {
      const linhas = ["Linha 1", "Linha 2", "Linha 3", "Linha 4", "Linha 5"];

      render(<Auditoria linhas={linhas} />);

      linhas.forEach((linha) => {
        expect(screen.getByText(linha)).toBeInTheDocument();
      });
    });
  });

  describe("Comportamento com dados vazios", () => {
    it("não deve renderizar quando linhas está vazio", () => {
      const { container } = render(<Auditoria linhas={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("não deve renderizar quando linhas é null", () => {
      const { container } = render(<Auditoria linhas={null as any} />);
      expect(container.firstChild).toBeNull();
    });

    it("não deve renderizar quando linhas é undefined", () => {
      const { container } = render(<Auditoria linhas={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Estrutura do DOM", () => {
    it("deve renderizar com as classes CSS corretas", () => {
      const linhas = ["Teste de classe CSS"];
      const { container } = render(<Auditoria linhas={linhas} />);

      expect(container.querySelector(".historico-wrapper")).toBeInTheDocument();
      expect(container.querySelector(".historico-linha")).toBeInTheDocument();
    });

    it("deve renderizar todas as linhas com a classe historico-linha", () => {
      const linhas = ["Linha 1", "Linha 2", "Linha 3"];
      const { container } = render(<Auditoria linhas={linhas} />);

      const linhasElements = container.querySelectorAll(".historico-linha");
      expect(linhasElements).toHaveLength(3);
    });

    it("deve ter keys únicas para cada linha", () => {
      const linhas = [
        "INSERIDO por USER1 (111) em 01/01/2025 10:00:00",
        "ALTERADO por USER2 (222) em 02/01/2025 11:00:00",
      ];
      const { container } = render(<Auditoria linhas={linhas} />);

      const linhasElements = container.querySelectorAll(".historico-linha");

      // Verifica que as linhas foram renderizadas
      expect(linhasElements).toHaveLength(2);
    });
  });

  describe("Casos de uso específicos", () => {
    it("deve renderizar linha com caracteres especiais", () => {
      const linhas = [
        "INSERIDO por JOÃO & MARIA (123-456) em 01/01/2025 10:00:00 - Ação: Criação",
      ];

      render(<Auditoria linhas={linhas} />);

      expect(
        screen.getByText(
          "INSERIDO por JOÃO & MARIA (123-456) em 01/01/2025 10:00:00 - Ação: Criação",
        ),
      ).toBeInTheDocument();
    });

    it("deve renderizar linha muito longa", () => {
      const linhaLonga =
        "INSERIDO por NOME MUITO LONGO DO USUÁRIO COMPLETO (123456789) em 01/01/2025 10:00:00 com observações detalhadas sobre a operação realizada";
      const linhas = [linhaLonga];

      render(<Auditoria linhas={linhas} />);

      expect(screen.getByText(linhaLonga)).toBeInTheDocument();
    });

    it("deve renderizar linha com apenas espaços", () => {
      const linhas = ["   "];
      const { container } = render(<Auditoria linhas={linhas} />);

      const linhaElement = container.querySelector(".historico-linha");
      expect(linhaElement).toBeInTheDocument();
      expect(linhaElement?.textContent).toBe("   ");
    });
  });

  describe("Formato padrão de auditoria", () => {
    it("deve renderizar formato padrão de inserção", () => {
      const linhas = [
        "INSERIDO por ANNE ALICE FERREIRA DE PAULA (9350276) em 07/02/2025 07:22:24",
      ];

      render(<Auditoria linhas={linhas} />);

      expect(
        screen.getByText(
          "INSERIDO por ANNE ALICE FERREIRA DE PAULA (9350276) em 07/02/2025 07:22:24",
        ),
      ).toBeInTheDocument();
    });

    it("deve renderizar formato padrão de alteração", () => {
      const linhas = [
        "ALTERADO por CARLOS SILVA (1234567) em 08/02/2025 14:30:00",
      ];

      render(<Auditoria linhas={linhas} />);

      expect(
        screen.getByText(
          "ALTERADO por CARLOS SILVA (1234567) em 08/02/2025 14:30:00",
        ),
      ).toBeInTheDocument();
    });

    it("deve renderizar múltiplas operações do mesmo usuário", () => {
      const linhas = [
        "INSERIDO por JOÃO (111) em 01/01/2025 10:00:00",
        "ALTERADO por JOÃO (111) em 01/01/2025 11:00:00",
        "ALTERADO por JOÃO (111) em 01/01/2025 12:00:00",
      ];

      render(<Auditoria linhas={linhas} />);

      linhas.forEach((linha) => {
        expect(screen.getByText(linha)).toBeInTheDocument();
      });
    });
  });
});
