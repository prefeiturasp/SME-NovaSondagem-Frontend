import React, { useState } from "react";
import ListaDinamicaRelatorio from "../listaDinamicaRelatorio/listaDinamicaRelatorio";
import type { DadosTabelaDinamicaRelatorio } from "../../../core/dto/typesRelatorio";
import mockDados from "../../../mocks/MockDadosTabelaDinamica3.json";
import { Button, Card, Spin } from "antd";
import "./conteudoRelatorio.css";
import FiltroRelatorio from "../filtroRelatorio/filtroRelatorio";
import styled from "styled-components";
export const Icon = styled.i``;

const ConteudoRelatorio: React.FC = () => {
  const dados = mockDados as DadosTabelaDinamicaRelatorio;
  const [loading] = useState(false);
  const [loadingGerar] = useState<boolean>(false);

  const GerarDados = async () => {
    // Geradados do relatorio, fica habilitado so quando tem dados na tabela.
  };

  const CancelarCadastroSondagem = async () => {
    // limpa o filtro?
  };

  const voltarSondagem = () => {
    globalThis.location.href = "/";
  };

  return (
    <>
      <div className="linhaTituloBotao">
        <div className="tituloSondagem">Sondagem por turma</div>
        <div>
          <Button
            id="sondagem-button-voltar"
            className="sondagemBotaoEstilo"
            onClick={() => {
              voltarSondagem();
            }}
            icon={<Icon className={`fa fa-arrow-left iconBotaoVoltar`} />}
          ></Button>

          <Button
            id="sondagem-button-cancelar"
            className="sondagemBotaoEstilo"
            onClick={() => {
              CancelarCadastroSondagem();
            }}
          >
            Cancelar
          </Button>

          <Button
            id="sondagem-button-gerar"
            className="sondagemBotaoEstilo"
            onClick={() => {
              GerarDados();
            }}
            loading={loadingGerar}
            icon={<Icon className="fa fa-print iconBotaoGerar" />}
          >
            Gerar
          </Button>
        </div>
      </div>
      <Card className="CardSondagemEfeitosRelatorio">
        <FiltroRelatorio />
        <Spin spinning={loading} tip="Carregando dados...">
          <ListaDinamicaRelatorio dados={dados} />
        </Spin>
      </Card>
    </>
  );
};

export default ConteudoRelatorio;
