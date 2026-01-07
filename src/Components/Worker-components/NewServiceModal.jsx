import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import GenericButton from '../UI/GenericButton';

export default function NewServiceModal({ open, onClose, worker}) {
    const [serviceData, setServiceData] = useState({
        serviceName: '',
        price: '',
        materialList: '',
        details: '',
        schedule: '',
        considerations: '',
        aproxTime: '',
        typeServiceId: 9,
        typeServiceName: 'Corte de pelo caballeros',
    });
    const [typeServices, setTypeServices] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [serviceImage, setServiceImage] = useState(null); 
    const [serviceImagePreview, setServiceImagePreview] = useState(null); 

    useEffect(() => {
        const fetchTypeServices = async () => {
            try {
                const response = await fetch('https://tulookapiv2.vercel.app/api/api/type_services');
                const data = await response.json();
                setTypeServices(data);
            } catch (error) {
                console.error('Error fetching type services:', error);
            }
        };

        fetchTypeServices();
    }, []);

    useEffect(() => {
        if (open) {
            const fetchService = async () => {
                try {
                    const response = await fetch('https://tulookapiv2.vercel.app/api/api/services');
                    const data = await response.json();
                    console.log('Response data:', data);
                } catch (error) {
                    console.error('Error fetching service data:', error);
                }
            };

            fetchService();
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData({ ...serviceData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setServiceImage(file);
            setServiceImagePreview(URL.createObjectURL(file)); 
        }
    };

    const validateForm = (data) => {
        let formErrors = {};
        if (!data.serviceName) formErrors.serviceName = 'El nombre del servicio es requerido.';
        if (!data.price) formErrors.price = 'El precio es requerido.';
        if (!data.materialList) formErrors.materialList = 'La lista de materiales es requerida.';
        if (!data.details) formErrors.details = 'Los detalles son requeridos.';
        if (!data.schedule) formErrors.schedule = 'El horario es requerido.';
        if (!data.considerations) formErrors.considerations = 'Las consideraciones son requeridas.';
        if (!data.aproxTime) formErrors.aproxTime = 'El tiempo aproximado es requerido.';
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isValid = validateForm(serviceData);
        if (!isValid) {
            setSubmitted(true);
            return;
        }

        const formData = new FormData();
        formData.append('name', serviceData.serviceName);
        formData.append('price', serviceData.price);
        formData.append('material_list', serviceData.materialList);
        formData.append('details', serviceData.details);
        formData.append('schedule', serviceData.schedule);
        formData.append('considerations', serviceData.considerations);
        formData.append('aprox_time', serviceData.aproxTime);
        formData.append('type_service_id', serviceData.typeServiceId);
        formData.append('owner_id', worker.id);
        if (serviceImage) {
            formData.append('image', serviceImage); 
        }

        try {
            const response = await fetch('https://tulookapiv2.vercel.app/api/api/services', {
                method: 'POST',
                body: formData, 
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response text:', errorText);
                throw new Error(`Error en el servidor: ${response.status}`);
            }

            const result = await response.json();
            console.log('Servicio creado:', result);

            onClose(); 
        } catch (error) {
            console.error('Error al crear el servicio:', error.message);
        }
    };

    const handleTypeServiceChange = (e) => {
        const selectedId = e.target.value;
        const selectedService = typeServices.find(service => service.id === parseInt(selectedId));
        setServiceData({
            ...serviceData,
            typeServiceId: selectedId,
            typeServiceName: selectedService?.name || '',
        });
    };

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
      <Modal open={open} onClose={onClose}>
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-red-500 font-bold"
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4">Nuevo Servicio</h2>

            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Imagen del Servicio
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 p-2 border rounded w-full"
                />
                {serviceImagePreview && (
                  <img
                    src={serviceImagePreview}
                    alt="Previsualización del Servicio"
                    className="mt-2 w-full h-auto rounded-lg"
                    onError={(e) => {
                        e.target.src = '/img/template-img.png';
                    }}
                  />
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={serviceData.serviceName}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                />
                {submitted && errors.serviceName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.serviceName}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">Precio</label>
                <input
                  type="number"
                  name="price"
                  value={serviceData.price}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                />
                {submitted && errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Lista de Materiales
                </label>
                <input
                  type="text"
                  name="materialList"
                  value={serviceData.materialList}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                />
                {submitted && errors.materialList && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.materialList}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">Detalles</label>
                <textarea
                  name="details"
                  value={serviceData.details}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                />
                {submitted && errors.details && (
                  <p className="text-red-500 text-sm mt-1">{errors.details}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">Horario</label>
                <input
                  type="text"
                  name="schedule"
                  value={serviceData.schedule}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                />
                {submitted && errors.schedule && (
                  <p className="text-red-500 text-sm mt-1">{errors.schedule}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Consideraciones
                </label>
                <textarea
                  name="considerations"
                  value={serviceData.considerations}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                />
                {submitted && errors.considerations && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.considerations}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Tiempo Aproximado
                </label>
                <input
                  type="text"
                  name="aproxTime"
                  value={serviceData.aproxTime}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                />
                {submitted && errors.aproxTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.aproxTime}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Tipo de Servicio
                </label>
                <select
                  name="typeServiceId"
                  value={serviceData.typeServiceId}
                  onChange={handleTypeServiceChange}
                  className="mt-1 p-2 border rounded w-full"
                >
                  {typeServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center mt-4">
                <GenericButton type="submit" placeholder="Agregar Servicio" />
              </div>
            </form>
          </div>
        </div>
      </Modal>
    );
}
