import React from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./redux/store";
import "./main.css";
import AppRoutes from "./AppRoutes";
import GlobalStyle from '~/estilos/global';

const App: React.FC = () => (
  <Provider store={store}>
    <ConfigProvider>
      <Router>
        <GlobalStyle />
        <AppRoutes />
      </Router>
    </ConfigProvider>
  </Provider>
);

export default App;
