import React, { Component } from "react";
import { withRouter } from "../with-router";

import AuthSerivce from "../services/auth.serivce";

class Menu extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: ''
        }
    }

    componentDidMount(){
        const user = AuthSerivce.getCurrentUser();
        this.setState({user: user})
    }

    render() {
        return(
            <div id="menu">
                <span>Здравствуйте, {this.state.user}</span>
                <a href="/">Поиск</a>
                <a href="/sources">Источники</a>
                <a href="/logout" >Выйти</a>
            </div>
        )
    }
}

export default withRouter(Menu)