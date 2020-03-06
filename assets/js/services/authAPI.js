import axios from "axios";
import jwtDecode from "jwt-decode";

function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

function authenticate(credentials) {
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            // Je stocke le token dans mon localStorage
            window.localStorage.setItem("authToken", token);
            // On prévient axios qu'on a un header sur toutes nos futures requetes HTTP
            setAxiosToken(token);

            return true;
        });

}

function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function setup() {
    // Voir si on a un token
    const token = window.localStorage.getItem("authToken");
    // Si le token est encore valide
    if(token) {
        const {exp: expiration} = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token)
        }
    }
}

function isAuthenticated() {
    // Voir si on a un token
    const token = window.localStorage.getItem("authToken");
    // Si le token est encore valide
    if(token) {
        const {exp: expiration} = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};