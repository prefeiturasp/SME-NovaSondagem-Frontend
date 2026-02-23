import React, { useState } from "react";
import ListaDinamicaRelatorio from "../listaDinamicaRelatorio/listaDinamicaRelatorio";
import type { DadosTabelaDinamicaRelatorio } from "../../../core/dto/typesRelatorio";
import { Button, Card, Spin, Form } from "antd";
import "./conteudoRelatorio.css";
import FiltroRelatorio from "../filtroRelatorio/filtroRelatorio";
import styled from "styled-components";
export const Icon = styled.i``;

const ConteudoRelatorio: React.FC = () => {
  const [formFiltro] = Form.useForm();
  const [dados, setDados] = useState<DadosTabelaDinamicaRelatorio | null>(null);

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
        <div className="textoSondagemEstilo">
          <p>
            Preencha os campos para conferir as informações das turmas e
            estudantes da Unidade Educacional selecionada.
          </p>
        </div>
        <FiltroRelatorio form={formFiltro} onDadosCarregados={setDados} />
        <Spin spinning={loading} tip="Carregando dados...">
          <ListaDinamicaRelatorio dados={dados} />
        </Spin>
      </Card>
    </>
  );
};

export default ConteudoRelatorio;
