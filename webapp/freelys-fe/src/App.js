import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import AuthService from "./services/auth.serivce";
import AppRouter from "./routes";
import Menu from "./components/menu"

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div id="main-wrapper">
          <Menu />
          <AppRouter />
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
