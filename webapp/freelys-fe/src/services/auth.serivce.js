import axios from "axios";
import authHeader from "./auth-header";

//TODO: move to config
const API_URL = "https://gitlab.nwam-7.org/api/auth/"

class AuthService {

    login(username, password) {
        return axios
            .post(API_URL + "login",{
                username,
                password
            })
            .then(response => {
                if (response.data.access_token){
                    localStorage.setItem("auth", JSON.stringify(response.data))
                }
            })
            .catch(error => {
                //display Error
                //console.log(error.response)
                let msg = error.response.data.msg
                console.log(msg);
                if (error.response.status === 401){
                    this.logout()
                }
            });

    };

    async verify() {
        if (!this.getCurrentUser()){
            return
        }

        await axios
            .post(API_URL + "verify", {}, {headers:authHeader()})
            .then(response => {
                //console.log(response.data);
            })
            .catch(error => {
                //display Error
                let msg = error.response.data.msg
                console.log(msg)
                if (error.response.status === 401){
                    this.logout();
                }
            })

        return true;
    }

    logout() {
        localStorage.removeItem("auth");
        window.location.reload();
    }

    getCurrentUser() {
        const authData = JSON.parse(localStorage.getItem("auth"));
        if (authData && authData.hasOwnProperty('user')){
            return authData.user;
        } else {
            return;
        }
    }
}

export default new AuthService();