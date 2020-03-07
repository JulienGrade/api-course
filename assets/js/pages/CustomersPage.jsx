import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    // Nombre d'items par page
    const itemsPerPage = 10;

    // Permet de récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data);
            setLoading(false);
        } catch (error) {
            toast.error("Impossible de charger les clients !");
        }
    };

    // Au chargement du composant on va chercher les customers
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Gestion de la suppression d'un customer
    const handleDelete = async (id) => {

       // Ici on enregistre les customers avant la requete,ensuite on efface et si il y
        // avait une erreur on ré affecte cette valeur a customers
       const originalCustomers = [...customers];
       // L'approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id));

        // Facon utilisant async et await
        try {
            await CustomersAPI.delete(id);
            toast.success("Le client a bien été supprimé");
        } catch (error) {
            setCustomers(originalCustomers);
            toast.error("La suppression du client n'a pas pu être réalisée !")
        }
       // Facon moins optimisée de faire une requete
        /*CustomersAPI.delete(id)
           .then(response => console.log("ok"))
           .catch(error => {
               setCustomers(originalCustomers);
               console.log(error.response);
           });*/
    };

    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);

    // Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    // Filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    // Pagination des données
    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary" >Créer un client</Link>
            </div>

            <div className="form-group">
                <input type="text"
                       onChange={handleSearch}
                       value={search}
                       className="form-control"
                       placeholder="Rechercher..."/>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                {!loading && (<tbody>
                    {paginatedCustomers.map(customer => (<tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <Link to={"/customers/" + customer.id}>
                                {customer.firstName} {customer.lastName}
                            </Link>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center">
                            <span className="badge badge-secondary">{customer.invoices.length}</span>
                        </td>
                        <td className="text-center">{customer.totalAmount.toLocaleString()} &euro;</td>
                        <td>
                            <button
                                onClick={()=> handleDelete(customer.id)}
                                disabled={customer.invoices.length}
                                className="btn btn-sm btn-danger"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>))}

                </tbody>)}
            </table>
            {loading && <TableLoader/>}

            {itemsPerPage < filteredCustomers.length && (
                <Pagination currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        length={filteredCustomers.length}
                        onPageChanged={handlePageChange}
                />
            )}
        </>
    );
};

export default CustomersPage;