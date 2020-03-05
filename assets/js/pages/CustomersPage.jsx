import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    // Nombre d'items par page
    const itemsPerPage = 10;

    // Permet de récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data);
        } catch (error) {
            console.log(error.response);
        }
    };

    // Au chargement du composant on va chercher les customers
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Gestion de la suppression d'un customer
    const handleDelete = async (id) => {
       console.log(id);

       // Ici on enregistre les customers avant la requete,ensuite on efface et si il y
        // avait une erreur on ré affecte cette valeur a customers
       const originalCustomers = [...customers];
       // L'approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id));

        // Facon utilisant async et await
        try {
            await CustomersAPI.delete(id)
        } catch (error) {
            setCustomers(originalCustomers);
        }
       // Facon moins optimisée de faire une requete
        CustomersAPI.delete(id)
           .then(response => console.log("ok"))
           .catch(error => {
               setCustomers(originalCustomers);
               console.log(error.response);
           });
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
            <h1>Liste des clients</h1>

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
                <tbody>
                    {paginatedCustomers.map(customer => (<tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <a href="#">{customer.firstName} {customer.lastName}</a>
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

                </tbody>
            </table>

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