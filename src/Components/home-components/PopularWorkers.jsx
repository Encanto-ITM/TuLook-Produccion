import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const CustomNextArrow = ({ onClick }) => {
    return (
        <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 cursor-pointer transition duration-300 hover:bg-gray-700 z-10"
            onClick={onClick}
        >
            <ChevronRight className="w-5 h-5" />
        </div>
    );
};


const CustomPrevArrow = ({ onClick }) => {
    return (
        <div
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 cursor-pointer transition duration-300 hover:bg-gray-700 z-10"
            onClick={onClick}
        >
            <ChevronRight className="w-5 h-5 transform rotate-180" />
        </div>
    );
};

export function PopularWorkers({ workers }) {
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        autoplay: true,          
        autoplaySpeed: 4000,      
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                }
            }
        ]
    };

    const handleFindOutMore = (worker) => {
        if (!worker.id) {
            console.error("Worker ID is undefined");
            return;
        }
        console.log("Navigating to worker profile with ID:", worker.id);
        navigate(`/workerprofile/${worker.id}`, { state: { worker } });
    };

    const limitedWorkers = workers && workers.length > 0 ? workers.slice(0, 9) : [];

    return (
        <section className="py-12 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Conoce nuestros colaboradores
                </h2>

                {limitedWorkers.length > 0 ? (
                    <Slider {...settings}>
                        {limitedWorkers.map(worker => (
                            <div key={worker.id} className="relative p-4">
                                <div className="bg-white shadow-lg overflow-hidden">
                                    <img
                                        src={worker.profilephoto || `https://picsum.photos/seed/${worker.id}/800/800`}
                                        alt={`${worker.name} ${worker.lastname}`}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = '/img/template-img.png';
                                        }}
                                    />
                                    <div className='p-8'>
                                        <h2 className="text-xl font-semibold text-left text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis max-h-6">
                                            {worker.name} {worker.lastname}
                                        </h2>

                                        <h3 className="text-left text-gray-500">
                                            {worker.profession}
                                        </h3>
                                        <p className="overflow-hidden whitespace-nowrap text-ellipsis max-h-6">
                                            {worker.description || 'No description available'}
                                        </p>

                                        <div className="text-center mt-4">
                                            <button
                                                className="flex items-center"
                                                onClick={() => handleFindOutMore(worker)}
                                            >
                                                <div className="rounded-full bg-purple p-1">
                                                    <ChevronRight className="text-white" />
                                                </div>
                                                <span className="ml-2 text-purple">Averigua más</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p className="text-center text-gray-600">No results found for workers.</p>
                )}
            </div>
        </section>
    );
}
