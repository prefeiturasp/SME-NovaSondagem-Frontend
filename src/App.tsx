import React from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./core/redux";
import "./main.css";
import AppRoutes from "./AppRoutes";

const App: React.FC = () => (
  <Provider store={store}>
    <ConfigProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ConfigProvider>
  </Provider>
);

export default App;
