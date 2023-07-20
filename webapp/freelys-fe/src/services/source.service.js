import axios from "axios";
import AuthService from "./auth.serivce"
import authHeader from "./auth-header";
import { Component } from "react";

//TODO: move to config
const API_URL = "https://gitlab.nwam-7.org/api/source"

class SourceService {
    getSource(id){
        return axios
        .get(API_URL + '/' + id, {headers:authHeader()})
        .catch(error =>{
            let msg = error.response//.data.msg
            console.log(msg);
            if(error.response.status === 401){
                AuthService.logout();
            }
        })
    }

    createSource(data){
        return axios
        .post(API_URL, data, {headers:authHeader()})
        .catch(error =>{
            let msg = error.response//.data.msg
            console.log(msg);
            if(error.response.status === 401){
                AuthService.logout();
            }
        })
    }

    updateSource(id, data){
        return axios
        .patch(API_URL + '/' + id, data, {headers:authHeader()})
        .catch(error =>{
            let msg = error.response//.data.msg
            console.log(msg);
            if(error.response.status === 401){
                AuthService.logout();
            }
        })
    }

    deleteSource(id, data){
        return axios
        .delete(API_URL + '/' + id, {headers:authHeader()})
        .catch(error =>{
            let msg = error.response//.data.msg
            console.log(msg);
            if(error.response.status === 401){
                AuthService.logout();
            }
        })
    }



    getSources(){
        return axios
        .get(API_URL, {headers:authHeader()})
        .catch(error =>{
            let msg = error.response//.data.msg
            console.log(msg);
            if(error.response.status === 401){
                AuthService.logout();
            }
        })
    }
}

export default new SourceService();