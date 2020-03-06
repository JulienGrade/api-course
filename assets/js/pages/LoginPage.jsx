import React, {useContext, useState} from 'react';
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value});
    };

    // Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();
        
        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch (error) {
            setError("Aucun compte ne possède cette adresse email ou les informations ne correspondent pas");
        }
        console.log(credentials);
    };

    return (
        <>
           <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group ">
                    <label htmlFor="username">Adresse email</label>
                    <input
                        value={credentials.username}
                        onChange={handleChange}
                        name="username"
                        id="username"
                        type="email"
                        placeholder="Adresse email de connexion..."
                        className={"form-control" + (error && " is-invalid")}
                    />
                </div>
                {error && <div className="invalid-feedback d-table">{error}</div>}
                <div className="form-group ">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        value={credentials.password}
                        onChange={handleChange}
                        name="password"
                        id="password"
                        type="paswword"
                        placeholder="Votre mot de passe..."
                        className="form-control" />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Je me connecte
                    </button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;