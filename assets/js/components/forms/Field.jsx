import React from 'react';

// Par défaut on donne à type la valeur text,à error une chaine vide et
// placeholder aussi pour qu'il prenne la valeur par défaut du label
const Field = ({
                   name,
                   label,
                   value,
                   onChange,
                   placeholder= "",
                   type = "text",
                   error = ""}) => (
        <>
            <div className="form-group ">
                <label htmlFor={name}>{label}</label>
                <input
                    value={value}
                    onChange={onChange}
                    name={name}
                    id={name}
                    type={type}
                    placeholder={placeholder || label}
                    className={"form-control" + (error && " is-invalid")}
                />
                {error && <p className="invalid-feedback d-table">{error}</p>}
            </div>
        </>
);


export default Field;