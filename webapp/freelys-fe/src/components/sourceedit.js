import React, { Component } from "react";
import { withRouter } from "../with-router";

import AuthSerivce from "../services/auth.serivce";
import SourceService from "../services/source.service";

class SourceEditPage extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.submitSource = this.submitSource.bind(this);
        this.sourceDelete = this.sourceDelete.bind(this);
        this.id = this.props.router.params.id;
        //this.sourceItem = SourceService.getSource(this.id)
        this.state = {
            data: {
                id: '',
                name: '',
                url: '',
                cron: '',
                created: '',
                last_run: ''
            },
            action: props.action, //new || edit || delete
            loading: false
        }
    }

    getData(id) { 
        SourceService.getSource(id).then(result => {
            this.setState({data: result.data})
        });
    }

    componentDidMount(){
        this.getData(this.id);
    }

    handleChange(e){
        const value = e.target.value;
        let data = {...this.state.data}
        data[e.target.name] = value
        this.setState({data})
    }

    submitSource(e){
        e.preventDefault();

        this.setState({loading: true})

        if (this.state.action === 'new'){
            SourceService.createSource(this.state.data)
                .then( result => {
                    this.props.router.navigate("/sources/edit/" + result.data.id);
                    window.location.reload();
                }
                )
        } else if (this.state.action === 'edit') {
            SourceService.updateSource(this.state.data.id, 
                this.state.data).then( () => {
                    this.props.router.navigate("/sources");
                    window.location.reload();
                }
                )
        } 
    }

    sourceDelete(e){
        e.preventDefault();

        SourceService.deleteSource(this.state.data.id).then(() => {
            this.props.router.navigate("/sources");
            window.location.reload();
        })
    }

    render () {
        return(
            <div id="source-edit-wrapper">
                <form onSubmit={this.submitSource}>
                    <div className="form-group">
                        <label>ID</label>
                        <input name="id"
                            className="form-control"
                            defaultValue={this.state.data.id}
                            readOnly={true}
                        />
                    </div>
                    <div className="form-group">
                        <label>Название</label>
                        <input name="name"
                            className="form-control"
                            defaultValue={this.state.data.name}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>WEB-адрес</label>
                        <input name="url"
                            className="form-control"
                            defaultValue={this.state.data.url}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Расписание</label>
                        <input name="cron"
                            className="form-control"
                            defaultValue={this.state.data.cron}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Создан</label>
                        <input name="created"
                            className="form-control"
                            defaultValue={this.state.data.created}
                            readOnly={true}
                        />
                    </div>
                    <div className="form-group">
                        <label>Последняя обработка</label>
                        <input name="last_run"
                            className="form-control"
                            defaultValue={this.state.data.last_run}
                            readOnly={true}
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
                            <span>Сохранить</span>
                        </button>
                        {this.state.action === 'edit' && (  
                        <button
                            className="btn btn-danger btn-block"
                            onClick={this.sourceDelete}
                        >
                            <span>Удалить</span>
                        </button>
                        )}
                    </div>
                </form>
            </div>
        )
    };
}

export default withRouter(SourceEditPage)