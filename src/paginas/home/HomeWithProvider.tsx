import React from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { store } from "../../core/redux";
import GlobalStyle from "~/estilos/global";
import Home from "./home";

/**
 * Wrapper do Home com Provider para Module Federation.
 * Este componente garante que o Home tenha acesso ao Redux store
 * quando exposto como módulo remoto.
 */
const HomeWithProvider: React.FC = () => (
  <Provider store={store}>
    <ConfigProvider>
      <GlobalStyle />
      <Home />
    </ConfigProvider>
  </Provider>
);

export default HomeWithProvider;
