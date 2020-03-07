import React, {useState, useEffect} from 'react';
import Field from "../components/forms/Field";
import Select from "../components/forms/select";
import {Link} from "react-router-dom";
import CustomersAPI from "../services/customersAPI";
import axios from "axios";
import InvoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({history, match}) => {
    const { id = "new" } = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT",
    });

    const [errors , setErrors] = useState({
        amount: "",
        customer: "",
        status: "",
    });

    // Récupération des clients
    const fetchCustomers = async() => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);

            if(!invoice.customer && !id) setInvoice({...invoice, customer: data[0].id });
        } catch (error) {
            history.replace("/invoices");
            // TODO flash notification erreur
        }
    };

    const [customers, setCustomers] = useState([]);

    const [editing, setEditing] = useState(false);

    // Récupération d'une facture
    const fetchInvoice = async id => {
        try {
            const {amount,status,customer} = await InvoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
        } catch (error) {
            // TODO flash notification erreur
            history.replace("/invoices");
        }
    };

    // Récupération de la liste des clients
    useEffect(() => {
        fetchCustomers();
    }, []);

    // récupération de la bonne facture quand l'id de l'url change
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    // Gestion des changements des input dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]: value});
    };

    // Gestion soumission du fomulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if(editing) {
                await InvoicesAPI.update(id, invoice);
                // TODO flash notification succès
                console.log(response);
            } else {
                await InvoicesAPI.create(invoice);
                // TODO flash notification succès
                history.replace("/invoices");
            }
        } catch ({response}) {
            const {violations} = response.data;
            if(violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);

                // TODO flash notifications d'erreurs

            }
        }
    };

    return (
        <>
            {(editing && <h1>Création d'une facture</h1>) || (<h1>Création d'une facture</h1>)}
            <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />
                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleChange}
                >
                    {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option> )}
                </Select>
                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/invoices" className="btn btn-link">
                        Retour aux factures
                    </Link>
                </div>
            </form>
        </>
    );
};

export default InvoicePage;