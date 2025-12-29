import React from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import "./main.css";
import AppRoutes from "./AppRoutes";
import { createMockStore } from "./mocks/mockStore";

const mockStore = createMockStore();

const App: React.FC = () => (
  <Provider store={mockStore}>
    <ConfigProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ConfigProvider>
  </Provider>
);

export default App;

