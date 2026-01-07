import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ServicesCard({ service, fetchCurrentUser }) {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getCurrentUser = async () => {
            if (fetchCurrentUser) {
                const user = await fetchCurrentUser();
                setCurrentUser(user);
            }
        };

        getCurrentUser();
    }, [fetchCurrentUser]);

    const handleActivate = () => {
        console.log(`Activando el servicio: ${service.name}`);
    };

    const handleDeactivate = () => {
        console.log(`Desactivando el servicio: ${service.name}`);
    };

    const handleViewMore = () => {
        navigate(`/service/${service.id}`);
    };

    const isOwner = currentUser && currentUser.id === service.owner_id;

    return (
        <div
            className={`shadow-lg rounded-md p-4 flex flex-col h-full ${service.is_active !== 1 ? 'bg-gray-300' : ''}`}
        >
            <img
                src={service.image}
                alt={service.name}
                className="w-full h-48 object-cover rounded-t-md"
                onError={(e) => {
                    e.target.src = '/img/template-img.png';
                }}
            />
            <h2 className="text-xl font-semibold mt-2">{service.name}</h2>
            <p className="text-sm text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis">
                {service.details}
                </p>

            {isOwner ? (
                <div className="flex justify-between mt-4">
                    <button
                        className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
                        onClick={handleActivate}
                    >
                        Activar
                    </button>
                    <button
                        className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                        onClick={handleDeactivate}
                    >
                        Desactivar
                    </button>
                </div>
            ) : (
                <button
                    className="mt-4 bg-purple text-white rounded-md px-4 py-2 hover:scale-105 duration-300" 
                    onClick={handleViewMore}
                >
                    Ver más
                </button>
            )}
        </div>
    );
}
