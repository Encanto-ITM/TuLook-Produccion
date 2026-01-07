import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Nav } from '../Components/Activity/Nav.jsx';
import { TypeServices } from "../Components/home-components/TypeServices.jsx";
import { Search } from '../Components/home-components/Search.jsx';
import Footer from "../Components/Activity/Footer.jsx";
import { NavLanding } from "../Components/landing-components/NavLanding";

export function Results(service) {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const location = useLocation();
    const [services, setServices] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsAuthenticated(true);
        }
    }, []);
    
    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            setError(null);
            try {
                let url = '';
                const queryParams = new URLSearchParams(location.search);
                const ids = queryParams.get('ids'); 
        
                if (ids) {

                    const idsArray = ids.split(',');
                    const fetchRequests = idsArray.map((id) =>
                        fetch(`https://tulookapiv2.vercel.app/api/api/services/${id}/filtertype`)
                            .then((res) => res.json())
                            .then((data) => {
                                return data.data || [];  
                            })
                            .catch((err) => {
                                console.error(`Error fetching ID ${id}: `, err);
                                return []; 
                            })
                    );
        
               
                    const results = await Promise.all(fetchRequests);   
                    const combinedResults = results.flat();
                    setServices(combinedResults);
                } else {
                    const response = await fetch(`https://tulookapiv2.vercel.app/api/api/services/${id}/filtertype`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const data = await response.json();
                    setServices(data.data || []); 
                }
            } catch (err) {
                console.error(err);
                setError(<p className="text-center text-gray-500 mt-6">No se han encontrado servicios que coincidan con su búsqueda.</p>);
            } finally {
                setLoading(false);
            }
        };
        

        fetchServices();
    }, [id, location.search]); 

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOrder = (id) => {
        navigate(`/order/${id}`); 
    };

    const handleViewMore = (id) => {
        navigate(`/service/${id}`);
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('email');
    setIsLoggedIn(!!email);
  }, []);
    
    return (
        <div>
           {isLoggedIn ? <Nav /> : <NavLanding />}
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="flex justify-center mb-6 px-20 sm:px-10 md:px-20 ">
                <input
                    type="text"
                    placeholder="Busqueda por categoria"
                    className="border border-gray-300 rounded-full px-10 py-3 w-full sm:w-1/3 text-lg outline-none focus:ring-2 focus:ring-purple text-center"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <TypeServices />
            <div className="p-6 mb-20">
                <h1 className="text-2xl font-bold text-center mb-4 mt-8">Resultados de Búsqueda:</h1>

                {loading && <p className="text-center text-gray-500 mt-6">Por favor espere...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredServices.map(service => (
                            <div key={service.id} className="bg-white shadow-lg rounded-md flex flex-col">
                                <img
                                    src={`${service.image}`}
                                    alt={`Image of ${service.name}`}
                                    className="w-full h-48 object-cover rounded-t-md"
                                    onError={(e) => {
                                        e.target.src = '/img/template-img.png';
                                    }}
                                />
                                <div className='p-4'>
                                    <h2 className="text-xl font-semibold mt-2">{service.name}</h2>
                                    <h2 className="text-xl font-semibold mt-2">₡{service.price}</h2>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {service.details}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                        <button
                                            className="w-full  bg-purple text-white rounded-md px-4 py-2 duration-300 hover:scale-[102%]"
                                            onClick={() => handleOrder(service.id)}
                                        >
                                            Ordena Ahora
                                        </button>
                                        <button
                                            className="w-full bg-purple text-white rounded-md px-4 py-2 duration-300 hover:scale-[102%]"
                                            onClick={() => handleViewMore(service.id)}
                                        >
                                            Ver más
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && !error && filteredServices.length === 0 && (
                        <p className="text-center text-gray-500 mt-6">No se encontraron resultados de tu busqueda en esta categoría.</p>
                    )
                )}
            </div>
            <Footer />
        </div>
    );
}
