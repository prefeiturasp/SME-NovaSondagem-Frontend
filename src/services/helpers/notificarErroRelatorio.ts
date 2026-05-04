import { notification } from "antd";

type ApiErrorData = {
  title?: string;
  message?: string;
  errors?: Record<string, unknown>;
};

type ApiError = {
  response?: {
    data?: ApiErrorData;
  };
};

interface NotificarErroRelatorioParams {
  error: unknown;
  mensagemConsole: string;
  tituloNotificacao: string;
  mensagemPadrao: string;
}

const formatarDetalhesErro = (
  errors?: Record<string, unknown>,
): string | null => {
  if (!errors) return null;

  return Object.entries(errors)
    .map(([key, value]) => {
      const valorFormatado = Array.isArray(value)
        ? value.join(", ")
        : String(value);
      return `${key}: ${valorFormatado}`;
    })
    .join("\n");
};

export const notificarErroRelatorio = ({
  error,
  mensagemConsole,
  tituloNotificacao,
  mensagemPadrao,
}: NotificarErroRelatorioParams): void => {
  console.error(mensagemConsole, error);

  const apiError = error as ApiError;
  const dadosErro = apiError.response?.data;

  const mensagemErro = dadosErro?.title ?? dadosErro?.message ?? mensagemPadrao;
  const detalhesErro = formatarDetalhesErro(dadosErro?.errors);

  notification.error({
    message: tituloNotificacao,
    description: detalhesErro ?? mensagemErro,
    duration: 5,
    placement: "topRight",
  });
};
