import React from 'react';
import { useNavigate } from 'react-router-dom';

export function TypeServices() {
    const navigate = useNavigate();

    const services = [
        { id: 1, name: 'Barbería' },
        { id: 2, name: 'Estilismo' },
        { id: 3, name: 'Manicura' },
        { id: 6, name: 'Depilación' },
        { id: 4, name: 'Cejas' },
        { id: 7, name: 'Skin Care' },
        { id: 8, name: 'Otros' }
    ];

    const img = [
        '/img/Iconos/Barberia.png',
        '/img/Iconos/Estilismo.png',
        '/img/Iconos/Manicura.png',
        '/img/Iconos/Depilacion.png',
        '/img/Iconos/Cejas.png',
        '/img/Iconos/SkinCare.png',
        '/img/Iconos/Otros.png',
    ];

    const handleServiceClick = (id, name) => {
        // Si el nombre del servicio es "Otros", pasamos los tres IDs
        if (name === 'Otros') {
            // Navegar a una ruta especial con los tres IDs
            navigate(`/results/otros?ids=5,8,9`);
        } else {
            // Si no es "Otros", simplemente pasamos el ID normal
            navigate(`/results/${id}`);
        }
    };

    return (
        <div className="flex flex-wrap justify-center mt-8 mb-8">
            {services.map((service, index) => (
                <div key={service.id} className="flex flex-col items-center space-y-2 m-4 transition duration-500 hover:scale-110 w-24 sm:w-32 lg:w-40 lg:mx-6">
                    <div 
                        onClick={() => handleServiceClick(service.id, service.name)} 
                        className="w-16 h-16 rounded-full flex items-center justify-cente cursor-pointer"
                    >
                        <img 
                            src={img[index]} 
                            alt={service.name} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.src = '/img/template-img.png';
                            }}
                        />
                    </div>
                    <span className="text-center">{service.name}</span>
                </div>
            ))}
        </div>
    );
}
