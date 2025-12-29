import type {
  OpcaoResposta,
  Resposta,
  Coluna,
  Estudante,
  DadosTabelaDinamica,
} from "./types";

describe("Types - Interfaces", () => {
  describe("OpcaoResposta", () => {
    it("deve criar uma OpcaoResposta válida", () => {
      const opcaoResposta: OpcaoResposta = {
        id: 1,
        orden: 1,
        descricaoOpcao: "Sim",
        corFundo: "#00BF63",
        corTexto: "#FFFFFF",
      };

      expect(opcaoResposta).toBeDefined();
      expect(opcaoResposta.id).toBe(1);
      expect(opcaoResposta.orden).toBe(1);
      expect(opcaoResposta.descricaoOpcao).toBe("Sim");
    });

    it("deve ter todas as propriedades obrigatórias", () => {
      const opcaoResposta: OpcaoResposta = {
        id: 2,
        orden: 2,
        descricaoOpcao: "Não",
        corFundo: "#FF3131",
        corTexto: "#FFFFFF",
      };

      expect(opcaoResposta).toHaveProperty("id");
      expect(opcaoResposta).toHaveProperty("orden");
      expect(opcaoResposta).toHaveProperty("descricaoOpcao");
      expect(opcaoResposta).toHaveProperty("corFundo");
      expect(opcaoResposta).toHaveProperty("corTexto");
    });

    it("deve aceitar diferentes valores numéricos", () => {
      const opcaoResposta: OpcaoResposta = {
        id: 999,
        orden: 0,
        descricaoOpcao: "Descrição longa com vários caracteres",
        corFundo: "#5170FF",
        corTexto: "#FFFFFF",
      };

      expect(opcaoResposta.id).toBe(999);
      expect(opcaoResposta.orden).toBe(0);
      expect(typeof opcaoResposta.descricaoOpcao).toBe("string");
    });
  });

  describe("Resposta", () => {
    it("deve criar uma Resposta válida", () => {
      const resposta: Resposta = {
        id: 1,
        opcaoRespostaId: 5,
      };

      expect(resposta).toBeDefined();
      expect(resposta.id).toBe(1);
      expect(resposta.opcaoRespostaId).toBe(5);
    });

    it("deve ter todas as propriedades obrigatórias", () => {
      const resposta: Resposta = {
        id: 10,
        opcaoRespostaId: 20,
      };

      expect(resposta).toHaveProperty("id");
      expect(resposta).toHaveProperty("opcaoRespostaId");
    });

    it("deve aceitar valores numéricos diferentes", () => {
      const resposta: Resposta = {
        id: 0,
        opcaoRespostaId: 0,
      };

      expect(typeof resposta.id).toBe("number");
      expect(typeof resposta.opcaoRespostaId).toBe("number");
    });
  });

  describe("Coluna", () => {
    it("deve criar uma Coluna válida", () => {
      const coluna: Coluna = {
        descricaoColuna: "Leitura",
        PeriodoBimestreAtivo: true,
        opcaoResposta: [],
        resposta: [],
      };

      expect(coluna).toBeDefined();
      expect(coluna.descricaoColuna).toBe("Leitura");
      expect(coluna.PeriodoBimestreAtivo).toBe(true);
      expect(Array.isArray(coluna.opcaoResposta)).toBe(true);
      expect(Array.isArray(coluna.resposta)).toBe(true);
    });

    it("deve ter todas as propriedades obrigatórias", () => {
      const coluna: Coluna = {
        descricaoColuna: "Escrita",
        PeriodoBimestreAtivo: false,
        opcaoResposta: [],
        resposta: [],
      };

      expect(coluna).toHaveProperty("descricaoColuna");
      expect(coluna).toHaveProperty("PeriodoBimestreAtivo");
      expect(coluna).toHaveProperty("opcaoResposta");
      expect(coluna).toHaveProperty("resposta");
    });

    it("deve aceitar arrays com opções de resposta", () => {
      const coluna: Coluna = {
        descricaoColuna: "Matemática",
        PeriodoBimestreAtivo: true,
        opcaoResposta: [
          {
            id: 1,
            orden: 1,
            descricaoOpcao: "Sim",
            corFundo: "#00BF63",
            corTexto: "#FFFFFF",
          },
          {
            id: 2,
            orden: 2,
            descricaoOpcao: "Não",
            corFundo: "#FF3131",
            corTexto: "#FFFFFF",
          },
        ],
        resposta: [],
      };

      expect(coluna.opcaoResposta).toHaveLength(2);
      expect(coluna.opcaoResposta[0].descricaoOpcao).toBe("Sim");
      expect(coluna.opcaoResposta[1].descricaoOpcao).toBe("Não");
    });

    it("deve aceitar arrays com respostas", () => {
      const coluna: Coluna = {
        descricaoColuna: "Ciências",
        PeriodoBimestreAtivo: false,
        opcaoResposta: [],
        resposta: [
          { id: 1, opcaoRespostaId: 1 },
          { id: 2, opcaoRespostaId: 2 },
        ],
      };

      expect(coluna.resposta).toHaveLength(2);
      expect(coluna.resposta[0].id).toBe(1);
      expect(coluna.resposta[1].opcaoRespostaId).toBe(2);
    });
  });

  describe("Estudante", () => {
    it("deve criar um Estudante válido", () => {
      const estudante: Estudante = {
        lp: true,
        numero: 1,
        nome: "João Silva",
        pap: false,
        aee: false,
        acessibilidade: false,
        coluna: [],
      };

      expect(estudante).toBeDefined();
      expect(estudante.lp).toBe(true);
      expect(estudante.numero).toBe(1);
      expect(estudante.nome).toBe("João Silva");
      expect(estudante.pap).toBe(false);
      expect(estudante.aee).toBe(false);
      expect(estudante.acessibilidade).toBe(false);
      expect(Array.isArray(estudante.coluna)).toBe(true);
    });

    it("deve ter todas as propriedades obrigatórias", () => {
      const estudante: Estudante = {
        lp: false,
        numero: 2,
        nome: "Maria Santos",
        pap: true,
        aee: true,
        acessibilidade: true,
        coluna: [],
      };

      expect(estudante).toHaveProperty("lp");
      expect(estudante).toHaveProperty("numero");
      expect(estudante).toHaveProperty("nome");
      expect(estudante).toHaveProperty("pap");
      expect(estudante).toHaveProperty("aee");
      expect(estudante).toHaveProperty("acessibilidade");
      expect(estudante).toHaveProperty("coluna");
    });

    it("deve aceitar múltiplas colunas", () => {
      const estudante: Estudante = {
        lp: true,
        numero: 3,
        nome: "Pedro Oliveira",
        pap: false,
        aee: false,
        acessibilidade: false,
        coluna: [
          {
            descricaoColuna: "Leitura",
            PeriodoBimestreAtivo: true,
            opcaoResposta: [
              {
                id: 1,
                orden: 1,
                descricaoOpcao: "Sim",
                corFundo: "#00BF63",
                corTexto: "#FFFFFF",
              },
            ],
            resposta: [{ id: 1, opcaoRespostaId: 1 }],
          },
          {
            descricaoColuna: "Escrita",
            PeriodoBimestreAtivo: false,
            opcaoResposta: [
              {
                id: 2,
                orden: 2,
                descricaoOpcao: "Não",
                corFundo: "#FF3131",
                corTexto: "#FFFFFF",
              },
            ],
            resposta: [],
          },
        ],
      };

      expect(estudante.coluna).toHaveLength(2);
      expect(estudante.coluna[0].descricaoColuna).toBe("Leitura");
      expect(estudante.coluna[1].descricaoColuna).toBe("Escrita");
    });

    it("deve validar tipos booleanos corretamente", () => {
      const estudante: Estudante = {
        lp: true,
        numero: 4,
        nome: "Ana Costa",
        pap: true,
        aee: true,
        acessibilidade: true,
        coluna: [],
      };

      expect(typeof estudante.lp).toBe("boolean");
      expect(typeof estudante.pap).toBe("boolean");
      expect(typeof estudante.aee).toBe("boolean");
      expect(typeof estudante.acessibilidade).toBe("boolean");
    });
  });

  describe("DadosTabelaDinamica", () => {
    it("deve criar DadosTabelaDinamica válidos", () => {
      const dados: DadosTabelaDinamica = {
        questao: "Qual é a questão?",
        estudantes: [],
      };

      expect(dados).toBeDefined();
      expect(dados.questao).toBe("Qual é a questão?");
      expect(Array.isArray(dados.estudantes)).toBe(true);
    });

    it("deve ter todas as propriedades obrigatórias", () => {
      const dados: DadosTabelaDinamica = {
        questao: "Questão teste",
        estudantes: [],
      };

      expect(dados).toHaveProperty("questao");
      expect(dados).toHaveProperty("estudantes");
    });

    it("deve aceitar lista de estudantes", () => {
      const dados: DadosTabelaDinamica = {
        questao: "Avaliação de leitura",
        estudantes: [
          {
            lp: true,
            numero: 1,
            nome: "João Silva",
            pap: false,
            aee: false,
            acessibilidade: false,
            coluna: [],
          },
          {
            lp: false,
            numero: 2,
            nome: "Maria Santos",
            pap: true,
            aee: false,
            acessibilidade: false,
            coluna: [],
          },
        ],
      };

      expect(dados.estudantes).toHaveLength(2);
      expect(dados.estudantes[0].nome).toBe("João Silva");
      expect(dados.estudantes[1].nome).toBe("Maria Santos");
    });

    it("deve criar estrutura completa com todos os níveis", () => {
      const dados: DadosTabelaDinamica = {
        questao: "Sondagem completa",
        estudantes: [
          {
            lp: true,
            numero: 1,
            nome: "Carlos Eduardo",
            pap: false,
            aee: false,
            acessibilidade: true,
            coluna: [
              {
                descricaoColuna: "Leitura",
                PeriodoBimestreAtivo: true,
                opcaoResposta: [
                  {
                    id: 1,
                    orden: 1,
                    descricaoOpcao: "Pré-silábico",
                    corFundo: "#FF3131",
                    corTexto: "#FFFFFF",
                  },
                  {
                    id: 2,
                    orden: 2,
                    descricaoOpcao: "Silábico",
                    corFundo: "#FFDE59",
                    corTexto: "#42474A",
                  },
                  {
                    id: 3,
                    orden: 3,
                    descricaoOpcao: "Alfabético",
                    corFundo: "#00BF63",
                    corTexto: "#FFFFFF",
                  },
                ],
                resposta: [{ id: 1, opcaoRespostaId: 3 }],
              },
            ],
          },
        ],
      };

      expect(dados).toBeDefined();
      expect(dados.questao).toBe("Sondagem completa");
      expect(dados.estudantes).toHaveLength(1);
      expect(dados.estudantes[0].coluna).toHaveLength(1);
      expect(dados.estudantes[0].coluna[0].opcaoResposta).toHaveLength(3);
      expect(dados.estudantes[0].coluna[0].resposta).toHaveLength(1);
      expect(
        dados.estudantes[0].coluna[0].opcaoResposta[2].descricaoOpcao
      ).toBe("Alfabético");
    });

    it("deve validar estrutura vazia", () => {
      const dados: DadosTabelaDinamica = {
        questao: "",
        estudantes: [],
      };

      expect(dados.questao).toBe("");
      expect(dados.estudantes).toHaveLength(0);
    });
  });

  describe("Integração entre interfaces", () => {
    it("deve criar estrutura completa integrada", () => {
      const opcao1: OpcaoResposta = {
        id: 1,
        orden: 1,
        descricaoOpcao: "Sim",
        corFundo: "#00BF63",
        corTexto: "#FFFFFF",
      };

      const resposta1: Resposta = {
        id: 1,
        opcaoRespostaId: opcao1.id,
      };

      const coluna1: Coluna = {
        descricaoColuna: "Avaliação",
        PeriodoBimestreAtivo: true,
        opcaoResposta: [opcao1],
        resposta: [resposta1],
      };

      const estudante1: Estudante = {
        lp: true,
        numero: 1,
        nome: "Teste Integração",
        pap: false,
        aee: false,
        acessibilidade: false,
        coluna: [coluna1],
      };

      const dados: DadosTabelaDinamica = {
        questao: "Teste de integração",
        estudantes: [estudante1],
      };

      expect(dados.estudantes[0].coluna[0].opcaoResposta[0].id).toBe(
        dados.estudantes[0].coluna[0].resposta[0].opcaoRespostaId
      );
    });

    it("deve manter referências corretas entre resposta e opção", () => {
      const opcoes: OpcaoResposta[] = [
        {
          id: 1,
          orden: 1,
          descricaoOpcao: "Opção 1",
          corFundo: "#FF3131",
          corTexto: "#FFFFFF",
        },
        {
          id: 2,
          orden: 2,
          descricaoOpcao: "Opção 2",
          corFundo: "#FFDE59",
          corTexto: "#42474A",
        },
        {
          id: 3,
          orden: 3,
          descricaoOpcao: "Opção 3",
          corFundo: "#00BF63",
          corTexto: "#FFFFFF",
        },
      ];

      const respostas: Resposta[] = [
        { id: 1, opcaoRespostaId: 2 },
        { id: 2, opcaoRespostaId: 3 },
      ];

      expect(respostas[0].opcaoRespostaId).toBe(opcoes[1].id);
      expect(respostas[1].opcaoRespostaId).toBe(opcoes[2].id);
    });
  });
});
