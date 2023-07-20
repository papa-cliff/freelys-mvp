import React, { Component } from "react";
// import Form from "react-validation/build/form";
// import Input from "react-validation/build/input";
// import CheckButton from "react-validation/build/button";

import AuthSerivce from "../services/auth.serivce";

import { withRouter } from "../with-router";


class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.state = {
            username: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    onChangeUsername(e) {
        this.setState({
          username: e.target.value
        });
      }
    
    onChangePassword(e) {
    this.setState({
        password: e.target.value
    });
    }

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        AuthSerivce.login(this.state.username,
            this.state.password).then(
                () => {
                    this.props.router.navigate("/sources");
                    window.location.reload();
                }, error => {
                    const resMessage =
                      (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                      error.message ||
                      error.toString();
          
                    this.setState({
                      loading: false,
                      message: resMessage
                    });
                }
            );
    }

    render() {
        // const user = AuthSerivce.getCurrentUser();

        return (
            <div id="login-wrapper">
                <form onSubmit={this.handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Пользователь</label>
                        <input name="username" 
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input name="password" 
                            type="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                        />
                    </div>
                    <div className="form-group">
                        <button
                            className="btn btn-primary btn-block"
                            disabled={this.state.loading}
                        >
                            {this.state.loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Login</span>
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(LoginPage)