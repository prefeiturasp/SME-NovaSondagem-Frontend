import React from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import Home from "./paginas/home/home";
import GlobalStyle from "~/estilos/global";
import { store } from "./core/redux";

/**
 * Versão do App COM Provider (temporariamente adicionado para desenvolvimento).
 * Para Module Federation em produção, o Provider deve vir do host (projeto pai).
 * Este componente é exportado via remoteEntry.js
 */
const AppWithoutProvider: React.FC = () => (
  <Provider store={store}>
    <ConfigProvider>
      <GlobalStyle />
      <Home />
    </ConfigProvider>
  </Provider>
);

export default AppWithoutProvider;
