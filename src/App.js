import React, { useState, useEffect } from "react";
import "./App.css";

function MainComponent() {
  const [clients, setClients] = React.useState([]);
  const [newClient, setNewClient] = React.useState("");
  const [newClientNumber, setNewClientNumber] = React.useState("");
  const [newClientEmail, setNewClientEmail] = React.useState("");
  const [selectedClient, setSelectedClient] = React.useState("");
  const [selectedClientId, setSelectedClientId] = React.useState("");
  const [searchClientId, setSearchClientId] = React.useState("");
  const [searchResult, setSearchResult] = React.useState(null);
  const [selectedClientNumber, setSelectedClientNumber] = React.useState("");
  const [selectedClientEmail, setSelectedClientEmail] = React.useState("");
  const [maintenanceType, setMaintenanceType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [maintenanceOrder, setMaintenanceOrder] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState("accueil");
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [maintenanceOrders, setMaintenanceOrders] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [newProduct, setNewProduct] = React.useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });
  const [cart, setCart] = React.useState([]);
  const handleAddClient = () => {
    if (newClient && newClientNumber && newClientEmail) {
      const newClientData = {
        id: Date.now().toString(),
        name: newClient,
        number: newClientNumber,
        email: newClientEmail,
        date: new Date().toISOString().split("T")[0],
      };
      setClients([...clients, newClientData]);
      setNewClient("");
      setNewClientNumber("");
      setNewClientEmail("");
    }
  };
  const handleCreateMaintenanceOrder = () => {
    if (
      selectedClient &&
      selectedClientId &&
      selectedClientNumber &&
      selectedClientEmail &&
      maintenanceType &&
      description
    ) {
      const order = {
        id: Date.now().toString(),
        clientId: selectedClientId,
        client: selectedClient,
        clientNumber: selectedClientNumber,
        clientEmail: selectedClientEmail,
        type: maintenanceType,
        description: description,
        date: new Date().toLocaleDateString(),
        status: "En cours",
      };
      setMaintenanceOrder(order);
      setMaintenanceOrders([...maintenanceOrders, order]);
    } else {
      alert("Veuillez remplir tous les champs");
    }
  };
  const handlePrintOrder = () => {
    window.print();
  };
  const handleSelectClient = (client) => {
    setSelectedClient(client);
  };
  const handleEmailOrder = () => {
    alert("Fonctionnalité d'envoi par email à implémenter");
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const getClientsForDate = (date) => {
    return clients.filter(
      (client) => client.date === date.toISOString().split("T")[0]
    );
  };
  const handleSearchClient = () => {
    const foundOrder = maintenanceOrders.find(
      (order) =>
        order.id === searchClientId || order.clientId === searchClientId
    );
    if (foundOrder) {
      setSearchResult({
        id: foundOrder.id,
        client: foundOrder.client,
        status: foundOrder.status,
      });
    } else {
      const foundClient = clients.find(
        (client) => client.id === searchClientId
      );
      if (foundClient) {
        setSearchResult({
          id: foundClient.id,
          client: foundClient.name,
          status: "Aucune maintenance en cours",
        });
      } else {
        setSearchResult({
          id: searchClientId,
          client: "Client non trouvé",
          status: "Aucune maintenance en cours",
        });
      }
    }
  };
  const getReadyMaintenanceOrders = () => {
    return maintenanceOrders.filter((order) => order.status === "Prêt");
  };
  const handleMaintenanceStatusChange = (orderId, isReady) => {
    const updatedOrders = maintenanceOrders.map((order) =>
      order.id === orderId
        ? { ...order, status: isReady ? "Prêt" : "En cours" }
        : order
    );
    setMaintenanceOrders(updatedOrders);
  };
  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  const handleAddProduct = () => {
    if (
      newProduct.name &&
      newProduct.description &&
      newProduct.price &&
      newProduct.stock &&
      newProduct.image
    ) {
      const product = {
        id: Date.now().toString(),
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
      };
      setProducts([...products, product]);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: null,
      });
    } else {
      alert("Veuillez remplir tous les champs du produit et ajouter une image");
    }
  };
  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    if (productToEdit) {
      setNewProduct(productToEdit);
    }
  };
  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };
  const handleEditMaintenance = (orderId) => {
    const orderToEdit = maintenanceOrders.find((order) => order.id === orderId);
    if (orderToEdit) {
      setMaintenanceOrder(orderToEdit);
    }
  };
  const handleDeleteMaintenance = (orderId) => {
    setMaintenanceOrders(
      maintenanceOrders.filter((order) => order.id !== orderId)
    );
  };
  const calculateTotalRevenue = () => {
    return maintenanceOrders
      .filter((order) => order.status === "Prêt")
      .reduce((total, order) => total + 50, 0) // Assuming a flat rate of 50€ per maintenance
      .toFixed(2);
  };
  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };
  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Votre panier est vide");
      return;
    }
    alert("Commande passée avec succès !");
    setCart([]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">GMAO</h1>
          <div className="flex items-center">
            <div className="flex">
              <button
                className={`mr-2 px-4 py-2 ${
                  activeTab === "accueil"
                    ? "bg-blue-500 text-white"
                    : "text-white"
                }`}
                onClick={() => handleTabChange("accueil")}
              >
                Accueil
              </button>
              <button
                className={`mr-2 px-4 py-2 ${
                  activeTab === "clients"
                    ? "bg-blue-500 text-white"
                    : "text-white"
                }`}
                onClick={() => handleTabChange("clients")}
              >
                Clients
              </button>
              <button
                className={`mr-2 px-4 py-2 ${
                  activeTab === "maintenance"
                    ? "bg-blue-500 text-white"
                    : "text-white"
                }`}
                onClick={() => handleTabChange("maintenance")}
              >
                Maintenance
              </button>
              <button
                className={`mr-2 px-4 py-2 ${
                  activeTab === "rapports"
                    ? "bg-blue-500 text-white"
                    : "text-white"
                }`}
                onClick={() => handleTabChange("rapports")}
              >
                Rapports
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "produits"
                    ? "bg-blue-500 text-white"
                    : "text-white"
                }`}
                onClick={() => handleTabChange("produits")}
              >
                Produits
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-4">
        {activeTab === "accueil" && (
          <div>
            <div className="bg-blue-100 p-8 rounded-lg mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Tableau de bord de gestion
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">Clients actifs</h3>
                  <p className="text-3xl font-bold">{clients.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">
                    Maintenances en cours
                  </h3>
                  <p className="text-3xl font-bold">
                    {
                      maintenanceOrders.filter(
                        (order) => order.status === "En cours"
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">
                    Chiffre d'affaires
                  </h3>
                  <p className="text-3xl font-bold">
                    {calculateTotalRevenue()} Da
                  </p>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Recherche rapide</h2>
            <h2 className="text-2xl font-bold mb-2">
              Recherche de maintenance
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="ID du client"
                value={searchClientId}
                onChange={(e) => setSearchClientId(e.target.value)}
                className="border p-2 mr-2"
              />
              <button
                onClick={handleSearchClient}
                className="bg-blue-500 text-white px-4 py-2"
              >
                Rechercher
              </button>
            </div>
            {searchResult && (
              <div>
                <p>Client: {searchResult.client}</p>
                <p>ID: {searchResult.id}</p>
                <p>Statut: {searchResult.status}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "clients" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Gestion des Clients</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nom du client"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                className="border p-2 mr-2"
              />
              <input
                type="text"
                placeholder="Numéro du client"
                value={newClientNumber}
                onChange={(e) => setNewClientNumber(e.target.value)}
                className="border p-2 mr-2"
              />
              <input
                type="email"
                placeholder="Email du client"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
                className="border p-2 mr-2"
              />
              <button
                onClick={handleAddClient}
                className="bg-green-500 text-white px-4 py-2"
              >
                Ajouter Client
              </button>
            </div>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Numéro</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="border p-2">{client.id}</td>
                    <td className="border p-2">{client.name}</td>
                    <td className="border p-2">{client.number}</td>
                    <td className="border p-2">{client.email}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => {
                          setSelectedClient(client.name);
                          setSelectedClientId(client.id);
                          setSelectedClientNumber(client.number);
                          setSelectedClientEmail(client.email);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Sélectionner
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Gestion des Maintenances
            </h2>
            <div className="mb-4">
              <select
                value={selectedClientId}
                onChange={(e) => {
                  const client = clients.find((c) => c.id === e.target.value);
                  setSelectedClientId(e.target.value);
                  setSelectedClient(client ? client.name : "");
                  setSelectedClientNumber(client ? client.number : "");
                  setSelectedClientEmail(client ? client.email : "");
                }}
                className="border p-2 mr-2"
              >
                <option value="">Sélectionnez un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Type de maintenance"
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
                className="border p-2 mr-2"
              />
              <label className="label">
                Type de maintenance disponible :
                <select
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                  className="input select border p-2 mr-2"
                >
                  <option value="">Sélectionnez un type de maintenance</option>
                  <option value="pc">Maintenance PC</option>
                  <option value="imprimante">Réparation imprimante</option>
                  <option value="portable">Réparation portable</option>
                  <option value="logiciel">Installation logiciel</option>
                  <option value="Hardware Failure">Hardware Failure</option>
                  <option value="Software Issue">Software Issue</option>
                  <option value="Network Connectivity">
                    Network Connectivity
                  </option>
                  <option value="Power Supply">Power Supply</option>
                  <option value="Printer Jam">Printer Jam</option>
                  <option value="Operating System">Operating System</option>
                  <option value="Virus or Malware">Virus or Malware</option>
                  <option value="Data Loss">Data Loss</option>
                  <option value="Performance Issues">Performance Issues</option>
                  <option value="Display Issues">Display Issues</option>
                  <option value="Sound Issues">Sound Issues</option>
                </select>
              </label>
              <br />
              <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 mr-2 resize"
              ></input>
              <button
                onClick={handleCreateMaintenanceOrder}
                className="bg-blue-500 text-white px-4 py-2"
              >
                Créer Ordre de Maintenance
              </button>
            </div>
            {maintenanceOrder && (
              <div className="maintenance-order">
                <h3>Ordre de Maintenance</h3>
                <p>Client: {maintenanceOrder.client}</p>
                <p>Type: {maintenanceOrder.type}</p>
                <p>Description: {maintenanceOrder.description}</p>
                <p>Date: {maintenanceOrder.date}</p>
                <p>Statut: {maintenanceOrder.status}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 mr-2  "
                  onClick={handlePrintOrder}
                >
                  Imprimer
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2"
                  onClick={handleEmailOrder}
                >
                  Envoyer par Email
                </button>
              </div>
            )}
            <h3 className="text-xl font-bold mt-6 mb-2">
              Liste des maintenances
            </h3>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Client</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Statut</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="border p-2">{order.id}</td>
                    <td className="border p-2">{order.client}</td>
                    <td className="border p-2">{order.type}</td>
                    <td className="border p-2">{order.date}</td>
                    <td className="border p-2">{order.status}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleEditMaintenance(order.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteMaintenance(order.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "rapports" && (
          <div className="text-2xl">
            <h2 className="text-2xl font-bold mb-2">Rapports et Analyses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">
                  Performances mensuelles
                </h3>
                <p>Graphique des performances à implémenter</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">
                  Statistiques des maintenances
                </h3>
                <ul>
                  <li>Total des maintenances: {maintenanceOrders.length}</li>
                  <li>
                    En cours:{" "}
                    {
                      maintenanceOrders.filter(
                        (order) => order.status === "En cours"
                      ).length
                    }
                  </li>
                  <li>
                    Terminées:{" "}
                    {
                      maintenanceOrders.filter(
                        (order) => order.status === "Prêt"
                      ).length
                    }
                  </li>
                </ul>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">
              Historique des maintenances
            </h3>
            <table className="w-full border-collapse border mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Nom du client</th>
                  <th className="border p-2">Date d'ajout</th>
                </tr>
              </thead>
              <tbody>
                {getClientsForDate(selectedDate).map((client) => (
                  <tr key={client.id}>
                    <td className="border p-2">{client.id}</td>
                    <td className="border p-2">{client.name}</td>
                    <td className="border p-2">{client.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-xl font-bold mt-4 mb-2">
              Ordres de Maintenance
            </h3>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Client</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Statut</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="border p-2">{order.id}</td>
                    <td className="border p-2">{order.client}</td>
                    <td className="border p-2">{order.type}</td>
                    <td className="border p-2">{order.status}</td>
                    <td className="border p-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={order.status === "Prêt"}
                          onChange={(e) =>
                            handleMaintenanceStatusChange(
                              order.id,
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        Prêt
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "produits" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Gestion des Produits</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nom du produit"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="border p-2 mr-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="border p-2 mr-2"
              />
              <input
                type="number"
                placeholder="Prix"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="border p-2 mr-2"
              />
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="border p-2 mr-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProductImageUpload}
                className="border p-2 mr-2"
              />
              <button
                onClick={handleAddProduct}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Ajouter Produit
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-2">Inventaire des Produits</h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Prix</th>
                  <th className="border p-2">Stock</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="border p-2">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover"
                        />
                      )}
                    </td>
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2">{product.description}</td>
                    <td className="border p-2">{product.price} €</td>
                    <td className="border p-2">{product.stock}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">À propos de nous</h3>
            <p>
              Nous sommes spécialisés dans la maintenance et la réparation de
              vos appareils électroniques.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Contactez-nous</h3>
            <p>Email: contact@maintenance.com</p>
            <p>Téléphone: 01 23 45 67 89</p>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-bold mb-2">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">
                Facebook
              </a>
              <a href="#" className="hover:text-blue-400">
                Twitter
              </a>
              <a href="#" className="hover:text-blue-400">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024 Gestion de Maintenance. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;
