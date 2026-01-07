import React from 'react';
import GenericButton from '../UI/GenericButton';
import { useNavigate } from 'react-router-dom';


const popularServices = [
    { id: 1, name: 'Barberia Completa', price: '₡10 000', image: '/img/Iconos/Barberia-white.png' },
    { id: 2, name: 'Estilismo', price: '₡15 000', image: '/img/Iconos/Estilismo-white.png' },
    { id: 3, name: 'Manicura completa', price: '₡10 000', image: '/img/Iconos/Manicura-white.png' },
    { id: 6, name: 'Cuido de rostros', price: '₡5 000', image: '/img/Iconos/SkinCare-white.png'},
];

export function PopularServices() {
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/results/${id}`);
    };

    return (
        <div className="w-full mt-24">
            <section className="p-10">
                <div className="text-center p-8">
                    <h2 className="text-3xl font-bold text-white mb-4 max-w-[94rem] m-auto">Servicios populares</h2>
                    <h3 className="text-3xl font-bold text-white mb-8 max-w-[94rem] m-auto">Una selección de nuestros mejores servicios</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center p-10">
                    {popularServices.length > 0 ? (
                        popularServices.map((service) => (
                            <div key={service.id} className="grid gap-2 p-4"> 
                                <div className="border-4 border-white w-48 h-48 flex items-center justify-center">
                                    <img 
                                        src={service.image} 
                                        alt={service.name} 
                                        className="max-w-full max-h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/img/template-img.png';
                                        }}
                                    />
                                </div>
                                <div className="text-white text-center">
                                    <h2 className="text-xl font-semibold">{service.name}</h2>
                                    <p>{service.price}</p>
                                </div>
                                <div className="flex justify-center">
                                    <GenericButton 
                                        white 
                                        placeholder="Encuentra más" 
                                        onClick={() => handleClick(service.id)}
                                    />
                                </div>  
                            </div>
                        ))
                    ) : (
                        <p className="text-white text-center">No se encontraron servicios populares.</p>
                    )}
                </div>
            </section>
        </div>
    );
}



