import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../UI/LoginModal';
import { useAuth } from '../hooks/useAuth';
import dayjs from 'dayjs';
import { format } from 'date-fns'; 
import { es } from 'date-fns/locale'; 

export function CartHistory() {
    const { cart = [], removeFromCart, loadingData } = useCart();
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [loadingCart, setLoadingCart] = useState(true); 

    useEffect(() => {
        if (!isAuthenticated) {
            setLoadingCart(false);
            return;
        }

        const fetchServices = async () => {
            try {
                const response = await fetch('https://tulookapiv2.vercel.app/api/api/services');
                if (!response.ok) throw new Error('Error al cargar los servicios.');
                const data = await response.json();
                setServices(data);
            } catch (error) {
               
            } finally {
                setLoadingServices(false);
                setLoadingCart(false); 
            }
        };

        fetchServices(); 
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated && cart.length === 0) {
            setLoadingCart(true);
        } else {
            setLoadingCart(false);
        }
    }, [isAuthenticated, cart]);

    const handleConfirmOrder = (item) => {
        if (!isAuthenticated) {
            setShowModal(true); // Mostrar modal si el usuario no está autenticado
            return;
        }
    
        console.log(item);  // Para asegurarte de que el objeto item tiene la estructura correcta
    
        // Redirigir a la página de confirmación y pasar la información en location.state
        navigate(`/confirmation/${item.service_id}`, { 
            state: { 
                serviceId: item.service_id,
                service: item.serviceDetails, // Información detallada del servicio
                selectedTime: item.date // Pasar el objeto fecha tal como está
            }
        });
    };

    const formatDate = (date) => {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    };

    const getServiceDetails = (serviceId) => {
        return services.find(service => service.id === serviceId);
    };

   
    return (
        <div className="min-h-screen bg-gray-100 overflow-y-auto h-[48rem] hidenscroll mb-16">
            <div className="container mx-auto">
                <h2 className="text-2xl font-bold my-8 text-center py-4 border-b">Historial del Carrito:</h2>

                {loadingCart ? (
                    <p className="text-center">Cargando carrito...</p>
                ) : cart.length === 0 ? (
                    <p className="text-center">No hay elementos en el carrito.</p>
                ) : (
                    <div className="flex justify-center mt-10">
                        <div className="w-full max-w-6xl p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {cart.map((item, index) => {
                                    const service = getServiceDetails(item.service_id);
                                    if (!service) {
                                        return null;
                                    }

                                    return (
                                        <div key={index} className="bg-white shadow-lg rounded-lg  border">
                                            <img
                                                src={service.image || '/img/placeholder.jpg'}
                                                alt={`Imagen de ${service.name}`}
                                                className="w-full h-48 object-cover rounded-t-lg "
                                                onError={(e) => {
                                                    e.target.src = '/img/template-img.png';
                                                }}
                                            />
                                            <div className='p-4'>
                                                <h2 className="text-xl font-semibold mt-2">{service.name}</h2>
                                                <h2 className="text-xl font-semibold mt-2">₡{service.price}</h2>

                                                {item.date && (
                                                    <p className="text-md mt-2 font-medium text-gray-700">
                                                        <span className="font-bold text-purple-600">Fecha seleccionada:</span> {formatDate(item.date)}
                                                    </p>
                                                )}

                                                <div className="flex gap-4 mt-4 justify-center">
                                                    <button
                                                        className="text-purple border-2 border-purple px-4 py-2 rounded hover:scale-105 duration-500"
                                                        onClick={() => handleConfirmOrder(item)}
                                                        aria-label="Confirmar Orden"
                                                    >
                                                        Ordenar
                                                    </button>
                                                    <button
                                                        className="text-red border-2 border-red px-4 py-2 rounded hover:scale-105 duration-500"
                                                        onClick={() => removeFromCart(item.id)}
                                                        aria-label="Eliminar del Carrito"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <LoginModal
                    onLoginClick={() => setShowModal(false)}
                    onCancelClick={closeModal}
                />
            )}
        </div>
    );
}
