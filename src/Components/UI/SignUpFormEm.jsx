import React, { useState, useEffect } from 'react';
import SignInputs from './SignInputs'; 
import GenericButton from './GenericButton'; 
import { Eye, EyeOff } from 'lucide-react';

export function SignUpFormEm({ onToggleForm }) {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        contact_number: '',
        contact_public: '0',
        is_active: '1',
        password: '',
        password_confirmation: '',
        acounttype_id: '3',
        professions_id: '',
    });

    const [professions, setProfessions] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [emailError, setEmailError] = useState(''); // Error específico para email
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                const response = await fetch('https://tulookapiv2.vercel.app/api/api/professions');
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const filteredProfessions = data.filter(
                        profession => ![1, 2].includes(profession.id) 
                    );
                    setProfessions(filteredProfessions); 
                } else {
                    console.error('La respuesta no contiene un arreglo de profesiones:', data);
                    setProfessions([]); 
                }
            } catch (error) {
                console.error('Error al cargar las profesiones:', error); 
            }
        };

        fetchProfessions(); 
    }, []); 

    const handleChange = (e) => {
        const { name, value } = e.target; 
        setFormData({ ...formData, [name]: value });

        const formErrors = validateForm({ ...formData, [name]: value });
        setErrors(formErrors);
    };

    const validateForm = (data) => {
        let formErrors = {};
        if (!data.name) formErrors.name = "El nombre es requerido.";
        if (!data.lastname) formErrors.lastname = "El apellido es requerido.";
        if (!data.email) formErrors.email = "El correo electrónico es requerido.";
        if (!data.contact_number) formErrors.contact_number = "El número de contacto es requerido.";
        if (data.contact_number && data.contact_number.length < 8) formErrors.contact_number = "El número de contacto debe tener al menos 8 dígitos.";
        if (!data.password) formErrors.password = "La contraseña es requerida.";
        if (data.password !== data.password_confirmation) formErrors.password_confirmation = "Las contraseñas no coinciden."; 
        if (!data.professions_id) formErrors.professions_id = "La profesión es requerida.";
        return formErrors; 
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        setSubmitted(true); 
        setSuccessMessage(''); 
        setEmailError(''); // Limpiar error de email previo

        const formErrors = validateForm(formData); 
        if (Object.keys(formErrors).length > 0) { 
            setErrors(formErrors); 
            return;
        }

        const formDataToSubmit = { ...formData };

        console.log('Datos del formulario antes de enviar:', formDataToSubmit); 
       
        fetch('https://tulookapiv2.vercel.app/api/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataToSubmit), 
        })
        .then(response => {
            if (response.status === 400) {
                // Email already exists
                return response.json().then(data => {
                    setEmailError(data.message || 'El correo electrónico ya está registrado.');
                    throw new Error('email_taken');
                });
            } else if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al registrarse.');
            }
        })
        .then(data => {
            console.log('Éxito:', data); 
            setSuccessMessage('Registro exitoso. Iniciar Sesión.'); 
            resetForm();
        })
        .catch((error) => {
            if (error.message !== 'email_taken') {
                console.error('Error:', error);
            }
        });
    };

    const resetForm = () => {
        console.log("Resetting form..."); 
        setFormData({
            name: '',
            lastname: '',
            email: '',
            contact_number: '',
            contact_public: '0',
            is_active: '1',
            password: '',
            password_confirmation: '',
            acounttype_id: '3',
            professions_id: '',
        });
        setErrors({}); 
        setSubmitted(false); 
    };

    const isFormValid = Object.keys(errors).length === 0;

    return (
        <section className="flex flex-col md:flex-row w-full h-screen max-w-none overflow-hidden">
            <div className="flex flex-col w-full bg-white gap-4 p-6 place-items-center shadow-lg flex-grow overflow-y-auto" style={{ maxHeight: '100vh' }}>
                <div className="h-32 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
                    <img
                        src="/img/identificador.png"
                        className="w-auto h-full mx-auto"
                        alt="identificador"
                    />
                </div>
                <h1 className="text-xl font-bold text-center mb-4">Registrarse</h1>
                
                {successMessage && <p className="text-green text-sm">{successMessage}</p>}
                <div className='w-3/4 flex flex-col gap-6'>
                    <SignInputs 
                        placeholder="Nombre" 
                        name="name" 
                        onChange={handleChange} 
                    />
                    {submitted && errors.name && <p className="text-red text-sm mt-1">{errors.name}</p>}
                    
                    <SignInputs 
                        placeholder="Apellido" 
                        name="lastname"
                        onChange={handleChange} 
                    />
                    {submitted && errors.lastname && <p className="text-red text-sm">{errors.lastname}</p>}
                    
                    <SignInputs
                        placeholder="Correo electrónico" 
                        name="email" 
                        type="email"
                        onChange={handleChange} 
                    />
                    {submitted && errors.email && <p className="text-red text-sm">{errors.email}</p>}
                    {emailError && <p className="text-red text-sm -mt-4">{emailError}</p>}
                    
                    <SignInputs 
                        placeholder="Número de contacto" 
                        name="contact_number" 
                        onChange={handleChange} 
                    />
                    {submitted && errors.contact_number && <p className="text-red text-sm">{errors.contact_number}</p>}
                    
                    <div className="w-full">
                        <select 
                            name="contact_public" 
                            onChange={handleChange} 
                            value={formData.contact_public} 
                            className="border-2 border-black text-center w-full h-12 rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="0">Contacto Público No</option>
                            <option value="1">Contacto Público Sí</option>
                        </select>
                    </div>

                    <div className="relative flex flex-col">
                        <SignInputs 
                            placeholder="Contraseña" 
                            name="password" 
                            type={showPassword ? 'text' : 'password'} 
                            onChange={handleChange} 
                        />
                        <div 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        >
                            {showPassword ? <Eye /> : <EyeOff />}
                        </div>
                    </div>
                    {submitted && errors.password && <p className="text-red text-sm">{errors.password}</p>}

                    <div className="relative flex flex-col">
                        <SignInputs
                            placeholder="Confirmar contraseña" 
                            name="password_confirmation" 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            onChange={handleChange} 
                        />
                        <div 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        >
                            {showConfirmPassword ? <Eye /> : <EyeOff />}
                        </div>
                    </div>
                    {submitted && errors.password_confirmation && <p className="text-red text-sm">{errors.password_confirmation}</p>}
                    
                    <div className="w-full">
                        <select 
                            name="professions_id" 
                            onChange={handleChange} 
                            value={formData.professions_id} 
                            className="border-2 border-black text-center w-full h-12 rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">Selecciona una profesión</option>
                            {Array.isArray(professions) && professions.length > 0 ? (
                                professions.map((profession) => (
                                    <option key={profession.id} value={profession.id}>
                                        {profession.profession}
                                    </option>
                                ))
                            ) : (
                                <option value="">No hay profesiones disponibles</option>
                            )}
                        </select>
                        {submitted && errors.professions_id && <p className="text-red text-sm">{errors.professions_id}</p>}
                    </div>
                </div>
    
                <div className='w-3/5 flex flex-col gap-4'> 
                    <GenericButton 
                        type="button" 
                        onClick={handleSubmit} 
                        placeholder="Registrarse" 
                        className='mt-2 h-12'
                        disabled={!isFormValid} 
                    />
                </div>
    
                <div onClick={onToggleForm} className="text-black hover:underline text-center cursor-pointer" role='button'>
                    Iniciar Sesión
                </div>
            </div>
            
            <div className="flex w-full max-h-screen overflow-hidden flex-grow hidden md:block">
                <img
                    src="/img/RegisterE.png"
                    className="w-full h-full object-cover"
                    alt="Register Em"
                    loading="lazy"
                />
            </div>
        </section>
    );
}
