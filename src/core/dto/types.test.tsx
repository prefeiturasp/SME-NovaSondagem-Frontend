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
      override?: Partial<OpcaoResposta>,
    ): OpcaoResposta => ({
      id: 1,
      ordem: 1,
      descricaoOpcaoResposta: "Pré-silábico",
      corFundo: "#FF5733",
      corTexto: "#FFFFFF",
      legenda: "Nível inicial",
      ...override,
    });

    it("deve conter todas as propriedades obrigatórias", () => {
      const opcao = criarOpcaoResposta();

      expect(opcao).toMatchObject({
        id: expect.any(Number),
        ordem: expect.any(Number),
        descricaoOpcaoResposta: expect.any(String),
        corFundo: expect.any(String),
        corTexto: expect.any(String),
        legenda: expect.any(String),
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
          descricaoOpcaoResposta: nivel,
        });

        expect(opcao.descricaoOpcaoResposta).toBe(nivel);
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
      idCiclo: 1,
      descricaoColuna: "1º Bimestre",
      periodoBimestreAtivo: true,
      opcaoResposta: [],
      resposta: { id: 0, opcaoRespostaId: 0 },
      questaoSubrespostaId: null,
      ...override,
    });

    it("deve conter todas as propriedades obrigatórias", () => {
      const coluna = criarColuna();

      expect(coluna).toMatchObject({
        idCiclo: expect.any(Number),
        descricaoColuna: expect.any(String),
        periodoBimestreAtivo: expect.any(Boolean),
        opcaoResposta: expect.any(Array),
        resposta: expect.any(Object),
      });
      expect(coluna).toHaveProperty("questaoSubrespostaId");
    });

    it("deve gerenciar bimestre ativo e inativo", () => {
      const colunaAtiva = criarColuna({ periodoBimestreAtivo: true });
      const colunaInativa = criarColuna({ periodoBimestreAtivo: false });

      expect(colunaAtiva.periodoBimestreAtivo).toBe(true);
      expect(colunaInativa.periodoBimestreAtivo).toBe(false);
    });

    it("deve armazenar múltiplas opções de resposta", () => {
      const opcoes: OpcaoResposta[] = [
        {
          id: 1,
          ordem: 1,
          descricaoOpcaoResposta: "Pré-silábico",
          corFundo: "#FF0000",
          corTexto: "#FFFFFF",
          legenda: "Nível inicial",
        },
        {
          id: 2,
          ordem: 2,
          descricaoOpcaoResposta: "Alfabético",
          corFundo: "#00FF00",
          corTexto: "#000000",
          legenda: "Alfabetizado",
        },
      ];

      const coluna = criarColuna({ opcaoResposta: opcoes });

      expect(coluna.opcaoResposta).toHaveLength(2);
      expect(coluna.opcaoResposta[0].descricaoOpcaoResposta).toBe(
        "Pré-silábico",
      );
      expect(coluna.opcaoResposta[1].descricaoOpcaoResposta).toBe("Alfabético");
    });

    it("deve permitir resposta por coluna", () => {
      const resposta: Resposta = { id: 1, opcaoRespostaId: 1 };

      const coluna = criarColuna({ resposta });

      expect(coluna.resposta).toEqual({ id: 1, opcaoRespostaId: 1 });
    });

    it("deve permitir resposta sem opcaoRespostaId (não respondido)", () => {
      const resposta: Resposta = { id: 0, opcaoRespostaId: 0 };

      const coluna = criarColuna({ resposta });

      expect(coluna.resposta.id).toBe(0);
      expect(coluna.resposta.opcaoRespostaId).toBe(0);
    });

    it("deve aceitar questaoSubrespostaId null quando não há subresposta", () => {
      const coluna = criarColuna({ questaoSubrespostaId: null });

      expect(coluna.questaoSubrespostaId).toBeNull();
    });

    it("deve aceitar questaoSubrespostaId com valor quando há subresposta", () => {
      const coluna = criarColuna({ questaoSubrespostaId: 999 });

      expect(coluna.questaoSubrespostaId).toBe(999);
    });

    it("deve priorizar questaoSubrespostaId quando presente", () => {
      const colunaComSubresposta = criarColuna({ questaoSubrespostaId: 100 });
      const colunaSemSubresposta = criarColuna({ questaoSubrespostaId: null });

      const questaoIdUsado1 = colunaComSubresposta.questaoSubrespostaId ?? 50;
      const questaoIdUsado2 = colunaSemSubresposta.questaoSubrespostaId ?? 50;

      expect(questaoIdUsado1).toBe(100);
      expect(questaoIdUsado2).toBe(50);
    });
  });

  describe("Estudante", () => {
    const criarEstudante = (override?: Partial<Estudante>): Estudante => ({
      linguaPortuguesaSegundaLingua: false,
      numeroAlunoChamada: 1,
      nome: "João Silva",
      pap: false,
      aee: false,
      possuiDeficiencia: false,
      coluna: [],
      codigo: 123456,
      ...override,
    });

    it("deve conter todas as propriedades obrigatórias", () => {
      const estudante = criarEstudante();

      expect(estudante).toMatchObject({
        linguaPortuguesaSegundaLingua: expect.any(Boolean),
        numeroAlunoChamada: expect.any(Number),
        nome: expect.any(String),
        pap: expect.any(Boolean),
        aee: expect.any(Boolean),
        possuiDeficiencia: expect.any(Boolean),
        coluna: expect.any(Array),
        codigo: expect.any(Number),
      });
    });

    it("deve identificar estudante com necessidades especiais", () => {
      const estudanteComNecessidades = criarEstudante({
        aee: true,
        possuiDeficiencia: true,
        pap: true,
      });

      expect(estudanteComNecessidades.aee).toBe(true);
      expect(estudanteComNecessidades.possuiDeficiencia).toBe(true);
      expect(estudanteComNecessidades.pap).toBe(true);
    });

    it("deve identificar estudante de língua portuguesa como segunda língua", () => {
      const estudanteLP = criarEstudante({
        linguaPortuguesaSegundaLingua: true,
      });
      const estudanteNativo = criarEstudante({
        linguaPortuguesaSegundaLingua: false,
      });

      expect(estudanteLP.linguaPortuguesaSegundaLingua).toBe(true);
      expect(estudanteNativo.linguaPortuguesaSegundaLingua).toBe(false);
    });

    it("deve armazenar avaliações de múltiplos bimestres", () => {
      const colunas: Coluna[] = [
        {
          idCiclo: 1,
          descricaoColuna: "1º Bimestre",
          periodoBimestreAtivo: false,
          opcaoResposta: [],
          resposta: { id: 1, opcaoRespostaId: 1 },
          questaoSubrespostaId: null,
        },
        {
          idCiclo: 2,
          descricaoColuna: "2º Bimestre",
          periodoBimestreAtivo: true,
          opcaoResposta: [],
          resposta: { id: 2, opcaoRespostaId: 2 },
          questaoSubrespostaId: null,
        },
      ];

      const estudante = criarEstudante({ coluna: colunas });

      expect(estudante.coluna).toHaveLength(2);
      expect(estudante.coluna[0].descricaoColuna).toBe("1º Bimestre");
      expect(estudante.coluna[1].periodoBimestreAtivo).toBe(true);
    });
  });

  describe("DadosTabelaDinamica", () => {
    const criarDadosTabelaDinamica = (
      override?: Partial<DadosTabelaDinamica>,
    ): DadosTabelaDinamica => ({
      sondagemId: 0,
      tituloTabelaRespostas: "Qual hipótese de escrita o estudante apresenta?",
      estudantes: [],
      questaoId: 0,
      ...override,
    });

    it("deve conter todas as propriedades obrigatórias", () => {
      const dados = criarDadosTabelaDinamica();

      expect(dados).toMatchObject({
        sondagemId: expect.any(Number),
        tituloTabelaRespostas: expect.any(String),
        estudantes: expect.any(Array),
        questaoId: expect.any(Number),
      });
    });

    it("deve conter sondagemId válido", () => {
      const dados = criarDadosTabelaDinamica({ sondagemId: 123 });

      expect(dados.sondagemId).toBe(123);
      expect(typeof dados.sondagemId).toBe("number");
    });

    it("deve conter questaoId válido", () => {
      const dados = criarDadosTabelaDinamica({ questaoId: 456 });

      expect(dados.questaoId).toBe(456);
      expect(typeof dados.questaoId).toBe("number");
    });

    it("deve gerenciar lista vazia de estudantes", () => {
      const dados = criarDadosTabelaDinamica({ estudantes: [] });

      expect(dados.estudantes).toHaveLength(0);
      expect(Array.isArray(dados.estudantes)).toBe(true);
    });

    it("deve gerenciar múltiplos estudantes", () => {
      const estudantes: Estudante[] = [
        {
          linguaPortuguesaSegundaLingua: true,
          numeroAlunoChamada: 1,
          nome: "Ana Silva",
          pap: false,
          aee: false,
          possuiDeficiencia: false,
          coluna: [],
          codigo: 100001,
        },
        {
          linguaPortuguesaSegundaLingua: true,
          numeroAlunoChamada: 2,
          nome: "Carlos Souza",
          pap: true,
          aee: false,
          possuiDeficiencia: false,
          coluna: [],
          codigo: 100002,
        },
      ];

      const dados = criarDadosTabelaDinamica({
        sondagemId: 456,
        questaoId: 789,
        estudantes,
      });

      expect(dados.sondagemId).toBe(456);
      expect(dados.questaoId).toBe(789);
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
          descricaoOpcaoResposta: "Pré-silábico",
          corFundo: "#FF6B6B",
          corTexto: "#FFFFFF",
          legenda: "Nível inicial de alfabetização",
        },
        {
          id: 2,
          ordem: 2,
          descricaoOpcaoResposta: "Silábico sem valor",
          corFundo: "#FFD93D",
          corTexto: "#000000",
          legenda: "Escrita silábica sem correspondência sonora",
        },
        {
          id: 3,
          ordem: 3,
          descricaoOpcaoResposta: "Silábico com valor",
          corFundo: "#6BCB77",
          corTexto: "#FFFFFF",
          legenda: "Escrita silábica com correspondência sonora",
        },
        {
          id: 4,
          ordem: 4,
          descricaoOpcaoResposta: "Silábico-alfabético",
          corFundo: "#4D96FF",
          corTexto: "#FFFFFF",
          legenda: "Transição entre hipóteses",
        },
        {
          id: 5,
          ordem: 5,
          descricaoOpcaoResposta: "Alfabético",
          corFundo: "#9B59B6",
          corTexto: "#FFFFFF",
          legenda: "Totalmente alfabetizado",
        },
      ];

      const coluna1Bimestre: Coluna = {
        idCiclo: 1,
        descricaoColuna: "1º Bimestre",
        periodoBimestreAtivo: false,
        opcaoResposta: opcoesResposta,
        resposta: { id: 1, opcaoRespostaId: 1 },
        questaoSubrespostaId: null,
      };

      const coluna2Bimestre: Coluna = {
        idCiclo: 2,
        descricaoColuna: "2º Bimestre",
        periodoBimestreAtivo: true,
        opcaoResposta: opcoesResposta,
        resposta: { id: 2, opcaoRespostaId: 3 },
        questaoSubrespostaId: null,
      };

      const estudante: Estudante = {
        linguaPortuguesaSegundaLingua: true,
        numeroAlunoChamada: 1,
        nome: "Maria Eduarda",
        pap: false,
        aee: false,
        possuiDeficiencia: false,
        coluna: [coluna1Bimestre, coluna2Bimestre],
        codigo: 200001,
      };

      const dados: DadosTabelaDinamica = {
        sondagemId: 789,
        questaoId: 101,
        tituloTabelaRespostas:
          "Qual hipótese de escrita o estudante apresenta?",
        estudantes: [estudante],
      };

      expect(dados.sondagemId).toBe(789);
      expect(dados.questaoId).toBe(101);
      expect(dados.tituloTabelaRespostas).toBe(
        "Qual hipótese de escrita o estudante apresenta?",
      );
      expect(dados.estudantes).toHaveLength(1);
      expect(dados.estudantes[0].nome).toBe("Maria Eduarda");
      expect(dados.estudantes[0].coluna).toHaveLength(2);
      expect(dados.estudantes[0].coluna[0].opcaoResposta).toHaveLength(5);
      expect(dados.estudantes[0].coluna[0].resposta.opcaoRespostaId).toBe(1);
      expect(dados.estudantes[0].coluna[1].resposta.opcaoRespostaId).toBe(3);
      expect(dados.estudantes[0].coluna[1].periodoBimestreAtivo).toBe(true);
    });

    it("deve validar progressão do estudante entre bimestres", () => {
      const resposta1Bim: Resposta = { id: 1, opcaoRespostaId: 1 };
      const resposta2Bim: Resposta = { id: 2, opcaoRespostaId: 3 };
      const resposta3Bim: Resposta = { id: 3, opcaoRespostaId: 5 };

      expect(resposta2Bim.opcaoRespostaId!).toBeGreaterThan(
        resposta1Bim.opcaoRespostaId!,
      );
      expect(resposta3Bim.opcaoRespostaId!).toBeGreaterThan(
        resposta2Bim.opcaoRespostaId!,
      );
    });

    it("deve permitir turma com estudantes diversos", () => {
      const estudantes: Estudante[] = [
        {
          linguaPortuguesaSegundaLingua: true,
          numeroAlunoChamada: 1,
          nome: "João Pedro",
          pap: false,
          aee: false,
          possuiDeficiencia: false,
          coluna: [],
          codigo: 300001,
        },
        {
          linguaPortuguesaSegundaLingua: false,
          numeroAlunoChamada: 2,
          nome: "Yuki Tanaka",
          pap: false,
          aee: false,
          possuiDeficiencia: false,
          coluna: [],
          codigo: 300002,
        },
        {
          linguaPortuguesaSegundaLingua: true,
          numeroAlunoChamada: 3,
          nome: "Lucas Oliveira",
          pap: true,
          aee: true,
          possuiDeficiencia: true,
          coluna: [],
          codigo: 300003,
        },
      ];

      const dados: DadosTabelaDinamica = {
        sondagemId: 999,
        questaoId: 202,
        tituloTabelaRespostas: "Sondagem de leitura",
        estudantes,
      };

      expect(dados.sondagemId).toBe(999);
      expect(dados.questaoId).toBe(202);
      expect(dados.estudantes).toHaveLength(3);
      expect(dados.estudantes[0].linguaPortuguesaSegundaLingua).toBe(true);
      expect(dados.estudantes[1].linguaPortuguesaSegundaLingua).toBe(false);
      expect(dados.estudantes[2].aee).toBe(true);
      expect(dados.estudantes[2].pap).toBe(true);
    });

    it("deve validar relação entre opcaoResposta e resposta", () => {
      const opcoes: OpcaoResposta[] = [
        {
          id: 10,
          ordem: 1,
          descricaoOpcaoResposta: "Nível 1",
          corFundo: "#000000",
          corTexto: "#FFFFFF",
          legenda: "Primeiro nível",
        },
        {
          id: 20,
          ordem: 2,
          descricaoOpcaoResposta: "Nível 2",
          corFundo: "#FFFFFF",
          corTexto: "#000000",
          legenda: "Segundo nível",
        },
      ];

      const resposta: Resposta = { id: 1, opcaoRespostaId: 20 };

      const opcaoSelecionada = opcoes.find(
        (op) => op.id === resposta.opcaoRespostaId,
      );

      expect(opcaoSelecionada).toBeDefined();
      expect(opcaoSelecionada?.descricaoOpcaoResposta).toBe("Nível 2");
      expect(opcaoSelecionada?.ordem).toBe(2);
    });
  });
});
