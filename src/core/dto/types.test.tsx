import type {
  OpcaoResposta,
  Resposta,
  Coluna,
  Estudante,
  DadosTabelaDinamica,
} from "./types";

describe("Types - Interfaces de Sondagem", () => {
  describe("OpcaoResposta", () => {
    const criarOpcaoResposta = (
      override?: Partial<OpcaoResposta>
    ): OpcaoResposta => ({
      id: 1,
      ordem: 1,
      descricaoOpcao: "Pré-silábico",
      corFundo: "#FF5733",
      corTexto: "#FFFFFF",
      descricaoLegenda: "Nível inicial",
      ...override,
    });

    it("deve conter todas as propriedades obrigatórias", () => {
      const opcao = criarOpcaoResposta();

      expect(opcao).toMatchObject({
        id: expect.any(Number),
        ordem: expect.any(Number),
        descricaoOpcao: expect.any(String),
        corFundo: expect.any(String),
        corTexto: expect.any(String),
      });
    });

    it("deve criar opção com cores customizadas", () => {
      const opcao = criarOpcaoResposta({
        corFundo: "#00FF00",
        corTexto: "#000000",
      });

      expect(opcao.corFundo).toBe("#00FF00");
      expect(opcao.corTexto).toBe("#000000");
    });

    it("deve aceitar diferentes níveis de alfabetização", () => {
      const niveis = [
        "Pré-silábico",
        "Silábico sem valor",
        "Silábico com valor",
        "Silábico-alfabético",
        "Alfabético",
      ];

      niveis.forEach((nivel, index) => {
        const opcao = criarOpcaoResposta({
          id: index + 1,
          ordem: index + 1,
          descricaoOpcao: nivel,
        });

        expect(opcao.descricaoOpcao).toBe(nivel);
        expect(opcao.ordem).toBe(index + 1);
      });
    });
  });

  describe("Resposta", () => {
    const criarResposta = (override?: Partial<Resposta>): Resposta => ({
      id: 1,
      opcaoRespostaId: 1,
      ...override,
    });

    it("deve conter propriedades obrigatórias", () => {
      const resposta = criarResposta();

      expect(resposta).toMatchObject({
        id: expect.any(Number),
        opcaoRespostaId: expect.any(Number),
      });
    });

    it("deve referenciar corretamente a opção de resposta", () => {
      const opcaoId = 5;
      const resposta = criarResposta({ opcaoRespostaId: opcaoId });

      expect(resposta.opcaoRespostaId).toBe(opcaoId);
    });
  });

  describe("Coluna", () => {
    const criarColuna = (override?: Partial<Coluna>): Coluna => ({
      descricaoColuna: "1º Bimestre",
      PeriodoBimestreAtivo: true,
      opcaoResposta: [],
      resposta: [],
      ...override,
    });

    it("deve conter todas as propriedades obrigatórias", () => {
      const coluna = criarColuna();

      expect(coluna).toMatchObject({
        descricaoColuna: expect.any(String),
        PeriodoBimestreAtivo: expect.any(Boolean),
        opcaoResposta: expect.any(Array),
        resposta: expect.any(Array),
      });
    });

    it("deve gerenciar bimestre ativo e inativo", () => {
      const colunaAtiva = criarColuna({ PeriodoBimestreAtivo: true });
      const colunaInativa = criarColuna({ PeriodoBimestreAtivo: false });

      expect(colunaAtiva.PeriodoBimestreAtivo).toBe(true);
      expect(colunaInativa.PeriodoBimestreAtivo).toBe(false);
    });

    it("deve armazenar múltiplas opções de resposta", () => {
      const opcoes: OpcaoResposta[] = [
        {
          id: 1,
          ordem: 1,
          descricaoOpcao: "Pré-silábico",
          corFundo: "#FF0000",
          corTexto: "#FFFFFF",
          descricaoLegenda: "Nível inicial",
        },
        {
          id: 2,
          ordem: 2,
          descricaoOpcao: "Alfabético",
          corFundo: "#00FF00",
          corTexto: "#000000",
          descricaoLegenda: "Alfabetizado",
        },
      ];

      const coluna = criarColuna({ opcaoResposta: opcoes });

      expect(coluna.opcaoResposta).toHaveLength(2);
      expect(coluna.opcaoResposta[0].descricaoOpcao).toBe("Pré-silábico");
      expect(coluna.opcaoResposta[1].descricaoOpcao).toBe("Alfabético");
    });

    it("deve permitir múltiplas respostas por coluna", () => {
      const respostas: Resposta[] = [
        { id: 1, opcaoRespostaId: 1 },
        { id: 2, opcaoRespostaId: 3 },
      ];

      const coluna = criarColuna({ resposta: respostas });

      expect(coluna.resposta).toHaveLength(2);
    });
  });

  describe("Estudante", () => {
    const criarEstudante = (override?: Partial<Estudante>): Estudante => ({
      lp: false,
      numero: 1,
      nome: "João Silva",
      pap: false,
      aee: false,
      acessibilidade: false,
      coluna: [],
      ...override,
    });

    it("deve conter todas as propriedades obrigatórias", () => {
      const estudante = criarEstudante();

      expect(estudante).toMatchObject({
        lp: expect.any(Boolean),
        numero: expect.any(Number),
        nome: expect.any(String),
        pap: expect.any(Boolean),
        aee: expect.any(Boolean),
        acessibilidade: expect.any(Boolean),
        coluna: expect.any(Array),
      });
    });

    it("deve identificar estudante com necessidades especiais", () => {
      const estudanteComNecessidades = criarEstudante({
        aee: true,
        acessibilidade: true,
        pap: true,
      });

      expect(estudanteComNecessidades.aee).toBe(true);
      expect(estudanteComNecessidades.acessibilidade).toBe(true);
      expect(estudanteComNecessidades.pap).toBe(true);
    });

    it("deve identificar estudante de língua portuguesa", () => {
      const estudanteLP = criarEstudante({ lp: true });
      const estudanteEstrangeiro = criarEstudante({ lp: false });

      expect(estudanteLP.lp).toBe(true);
      expect(estudanteEstrangeiro.lp).toBe(false);
    });

    it("deve armazenar avaliações de múltiplos bimestres", () => {
      const colunas: Coluna[] = [
        {
          descricaoColuna: "1º Bimestre",
          PeriodoBimestreAtivo: false,
          opcaoResposta: [],
          resposta: [{ id: 1, opcaoRespostaId: 1 }],
        },
        {
          descricaoColuna: "2º Bimestre",
          PeriodoBimestreAtivo: true,
          opcaoResposta: [],
          resposta: [{ id: 2, opcaoRespostaId: 2 }],
        },
      ];

      const estudante = criarEstudante({ coluna: colunas });

      expect(estudante.coluna).toHaveLength(2);
      expect(estudante.coluna[0].descricaoColuna).toBe("1º Bimestre");
      expect(estudante.coluna[1].PeriodoBimestreAtivo).toBe(true);
    });
  });

  describe("DadosTabelaDinamica", () => {
    const criarDadosTabelaDinamica = (
      override?: Partial<DadosTabelaDinamica>
    ): DadosTabelaDinamica => ({
      questao: "Qual hipótese de escrita o estudante apresenta?",
      estudantes: [],
      ...override,
    });

    it("deve conter todas as propriedades obrigatórias", () => {
      const dados = criarDadosTabelaDinamica();

      expect(dados).toMatchObject({
        questao: expect.any(String),
        estudantes: expect.any(Array),
      });
    });

    it("deve gerenciar lista vazia de estudantes", () => {
      const dados = criarDadosTabelaDinamica({ estudantes: [] });

      expect(dados.estudantes).toHaveLength(0);
      expect(Array.isArray(dados.estudantes)).toBe(true);
    });

    it("deve gerenciar múltiplos estudantes", () => {
      const estudantes: Estudante[] = [
        {
          lp: true,
          numero: 1,
          nome: "Ana Silva",
          pap: false,
          aee: false,
          acessibilidade: false,
          coluna: [],
        },
        {
          lp: true,
          numero: 2,
          nome: "Carlos Souza",
          pap: true,
          aee: false,
          acessibilidade: false,
          coluna: [],
        },
      ];

      const dados = criarDadosTabelaDinamica({ estudantes });

      expect(dados.estudantes).toHaveLength(2);
      expect(dados.estudantes[0].nome).toBe("Ana Silva");
      expect(dados.estudantes[1].pap).toBe(true);
    });
  });

  describe("Integração - Cenários Completos", () => {
    it("deve representar uma sondagem completa de alfabetização", () => {
      const opcoesResposta: OpcaoResposta[] = [
        {
          id: 1,
          ordem: 1,
          descricaoOpcao: "Pré-silábico",
          corFundo: "#FF6B6B",
          corTexto: "#FFFFFF",
          descricaoLegenda: "Nível inicial de alfabetização",
        },
        {
          id: 2,
          ordem: 2,
          descricaoOpcao: "Silábico sem valor",
          corFundo: "#FFD93D",
          corTexto: "#000000",
          descricaoLegenda: "Escrita silábica sem correspondência sonora",
        },
        {
          id: 3,
          ordem: 3,
          descricaoOpcao: "Silábico com valor",
          corFundo: "#6BCB77",
          corTexto: "#FFFFFF",
          descricaoLegenda: "Escrita silábica com correspondência sonora",
        },
        {
          id: 4,
          ordem: 4,
          descricaoOpcao: "Silábico-alfabético",
          corFundo: "#4D96FF",
          corTexto: "#FFFFFF",
          descricaoLegenda: "Transição entre hipóteses",
        },
        {
          id: 5,
          ordem: 5,
          descricaoOpcao: "Alfabético",
          corFundo: "#9B59B6",
          corTexto: "#FFFFFF",
          descricaoLegenda: "Totalmente alfabetizado",
        },
      ];

      const coluna1Bimestre: Coluna = {
        descricaoColuna: "1º Bimestre",
        PeriodoBimestreAtivo: false,
        opcaoResposta: opcoesResposta,
        resposta: [{ id: 1, opcaoRespostaId: 1 }],
      };

      const coluna2Bimestre: Coluna = {
        descricaoColuna: "2º Bimestre",
        PeriodoBimestreAtivo: true,
        opcaoResposta: opcoesResposta,
        resposta: [{ id: 2, opcaoRespostaId: 3 }],
      };

      const estudante: Estudante = {
        lp: true,
        numero: 1,
        nome: "Maria Eduarda",
        pap: false,
        aee: false,
        acessibilidade: false,
        coluna: [coluna1Bimestre, coluna2Bimestre],
      };

      const dados: DadosTabelaDinamica = {
        questao: "Qual hipótese de escrita o estudante apresenta?",
        estudantes: [estudante],
      };

      expect(dados.questao).toBe(
        "Qual hipótese de escrita o estudante apresenta?"
      );
      expect(dados.estudantes).toHaveLength(1);
      expect(dados.estudantes[0].nome).toBe("Maria Eduarda");
      expect(dados.estudantes[0].coluna).toHaveLength(2);
      expect(dados.estudantes[0].coluna[0].opcaoResposta).toHaveLength(5);
      expect(dados.estudantes[0].coluna[0].resposta[0].opcaoRespostaId).toBe(1);
      expect(dados.estudantes[0].coluna[1].resposta[0].opcaoRespostaId).toBe(3);
      expect(dados.estudantes[0].coluna[1].PeriodoBimestreAtivo).toBe(true);
    });

    it("deve validar progressão do estudante entre bimestres", () => {
      const resposta1Bim: Resposta = { id: 1, opcaoRespostaId: 1 };
      const resposta2Bim: Resposta = { id: 2, opcaoRespostaId: 3 };
      const resposta3Bim: Resposta = { id: 3, opcaoRespostaId: 5 };

      expect(resposta2Bim.opcaoRespostaId).toBeGreaterThan(
        resposta1Bim.opcaoRespostaId
      );
      expect(resposta3Bim.opcaoRespostaId).toBeGreaterThan(
        resposta2Bim.opcaoRespostaId
      );
    });

    it("deve permitir turma com estudantes diversos", () => {
      const estudantes: Estudante[] = [
        {
          lp: true,
          numero: 1,
          nome: "João Pedro",
          pap: false,
          aee: false,
          acessibilidade: false,
          coluna: [],
        },
        {
          lp: false,
          numero: 2,
          nome: "Yuki Tanaka",
          pap: false,
          aee: false,
          acessibilidade: false,
          coluna: [],
        },
        {
          lp: true,
          numero: 3,
          nome: "Lucas Oliveira",
          pap: true,
          aee: true,
          acessibilidade: true,
          coluna: [],
        },
      ];

      const dados: DadosTabelaDinamica = {
        questao: "Sondagem de leitura",
        estudantes,
      };

      expect(dados.estudantes).toHaveLength(3);
      expect(dados.estudantes[0].lp).toBe(true);
      expect(dados.estudantes[1].lp).toBe(false);
      expect(dados.estudantes[2].aee).toBe(true);
      expect(dados.estudantes[2].pap).toBe(true);
    });

    it("deve validar relação entre opcaoResposta e resposta", () => {
      const opcoes: OpcaoResposta[] = [
        {
          id: 10,
          ordem: 1,
          descricaoOpcao: "Nível 1",
          corFundo: "#000000",
          corTexto: "#FFFFFF",
          descricaoLegenda: "Primeiro nível",
        },
        {
          id: 20,
          ordem: 2,
          descricaoOpcao: "Nível 2",
          corFundo: "#FFFFFF",
          corTexto: "#000000",
          descricaoLegenda: "Segundo nível",
        },
      ];

      const resposta: Resposta = { id: 1, opcaoRespostaId: 20 };

      const opcaoSelecionada = opcoes.find(
        (op) => op.id === resposta.opcaoRespostaId
      );

      expect(opcaoSelecionada).toBeDefined();
      expect(opcaoSelecionada?.descricaoOpcao).toBe("Nível 2");
      expect(opcaoSelecionada?.ordem).toBe(2);
    });
  });
});
