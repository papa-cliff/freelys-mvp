import React, { Component } from "react";
import { withRouter } from "../with-router";

import SourceService from "../services/source.service"

class SourcesPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: []
        }
    }
    
    editSource(id){
        this.props.router.navigate("/sources/edit/"+id);
    }

    getData() {
        SourceService.getSources().then(result => {
            this.setState({data: result.data.data})
        });
    }

    componentDidMount(){
        this.getData();
    }

    render () {
        return(
            <div id="sources-wrapper">
                <h2>Источники Данных</h2>
                <div id="source-controls">
                    <a href="/sources/add">+</a>       
                </div>
                <table>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Название</td>
                            <td>WEB-адрес</td>
                            <td>Расписание<br />(cron)</td>
                            <td>Создан</td>
                            <td>Последняя обработка</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.data.map((item) => (
                        <tr id={item.id} key={item.id} onClick={() => {this.editSource(item.id)}}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.url}</td>
                            <td>{item.cron}</td>
                            <td>{item.created}</td>
                            <td>{item.last_run}</td>
                        </tr>
                        )
                    )}
                    </tbody>
                </table>
                <div id="source-pager"></div>
            </div>
        );
    };
}

export default withRouter(SourcesPage)