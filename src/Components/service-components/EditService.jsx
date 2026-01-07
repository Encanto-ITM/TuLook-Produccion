import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import GenericButton from '../UI/GenericButton';

export function EditService({ serviceData, isOpen, onClose, onUpdate }) {
    const [name, setName] = useState(serviceData.name || '');
    const [price, setPrice] = useState(serviceData.price || '');
    const [schedule, setSchedule] = useState(serviceData.schedule || '');
    const [materialList, setMaterialList] = useState(serviceData.material_list || '');
    const [considerations, setConsiderations] = useState(serviceData.considerations || '');
    const [aproxTime, setAproxTime] = useState(serviceData.aprox_time || '');
    const [details, setDetails] = useState(serviceData.details || '');
    const [serviceImage, setServiceImage] = useState(null);
    const [serviceImagePreview, setServiceImagePreview] = useState(serviceData.image || '');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setServiceImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setServiceImagePreview(reader.result);
        };
        if (file) reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('schedule', schedule);
        formData.append('material_list', materialList);
        formData.append('considerations', considerations);
        formData.append('aprox_time', aproxTime);
        formData.append('details', details);
        formData.append('_method', 'PUT');
        if (serviceImage) formData.append('image', serviceImage);

        try {
            const response = await fetch(`https://tulookapiv2.vercel.app/api/api/services/${serviceData.id}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el servicio');
            }

            const result = await response.json();
            onUpdate(result);
            onClose();
        } catch (error) {
            console.error('Error al actualizar el servicio:', error);
        }
    };

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="fixed inset-0 flex items-center justify-center p-4" onClick={handleCloseModal}>
                <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative">
                    <button onClick={onClose} className="absolute top-2 right-2 text-red-500 font-bold">X</button>
                    <h2 className="text-xl font-bold mb-4">Editar Servicio</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Nombre del Servicio</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Precio</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Horario</label>
                            <input
                                type="text"
                                value={schedule}
                                onChange={(e) => setSchedule(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Lista de Materiales</label>
                            <textarea
                                value={materialList}
                                onChange={(e) => setMaterialList(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Consideraciones</label>
                            <textarea
                                value={considerations}
                                onChange={(e) => setConsiderations(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Tiempo Aproximado</label>
                            <input
                                type="text"
                                value={aproxTime}
                                onChange={(e) => setAproxTime(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Detalles</label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Imagen del Servicio</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded"
                            />
                            {serviceImagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={serviceImagePreview}
                                        alt="Previsualización de Imagen del Servicio"
                                        className="w-full h-auto rounded-md"
                                        onError={(e) => {
                                            e.target.src = '/img/template-img.png';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center">
                            <GenericButton type="submit" placeholder="Guardar cambios" className="rounded mt-4 border-2 text-white p-2 hover:scale-105 duration-300" />
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
