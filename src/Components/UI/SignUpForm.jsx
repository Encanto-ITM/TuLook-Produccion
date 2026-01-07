import React, { useState } from 'react';
import SignInputs from './SignInputs';
import GenericButton from './GenericButton';
import { Eye, EyeOff } from 'lucide-react'; // Importar iconos de Lucide

export function SignUpForm({ onToggleForm }) {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseñas
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar confirmación de contraseña
    const [emailError, setEmailError] = useState(''); // Error específico para email

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
        if (!data.password) formErrors.password = "La contraseña es requerida.";
        if (!data.password_confirmation) formErrors.password_confirmation = "Confirmar la contraseña es requerido.";

        if (data.password && data.password.length < 8) {
            formErrors.password = "La contraseña debe tener al menos 8 caracteres.";
        }

        if (data.password !== data.password_confirmation) {
            formErrors.password_confirmation = "Las contraseñas no coinciden.";
        }

        return formErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEmailError(''); // Limpiar error de email previo

        const formErrors = validateForm(formData);
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
            return; 
        }

        const { password_confirmation, ...formDataToSubmit } = formData;

        fetch('https://tulookapiv2.vercel.app/api/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataToSubmit),
        })
        .then(response => {
            console.log('Response status:', response);
            if (!response.ok) {
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
            onToggleForm();
        })
        .catch((error) => {
            if (error.message !== 'email_taken') {
                console.error('Error:', error);
            }
            console.error('Error:', error);
        });
    };

    const isFormValid = Object.keys(errors).length === 0;

    return (
        <section className="flex flex-col md:flex-row w-full h-screen max-w-none overflow-hidden">
            <div className="flex flex-col w-full bg-white gap-4 p-6 place-items-center shadow-lg flex-grow overflow-y-auto">
                <div className="h-32 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
                    <img
                        src="/img/identificador.png"
                        className="w-auto h-full mx-auto"
                        alt="identificador"
                    />
                </div>
                <h1 className="text-xl font-bold text-center mb-4">Registrarse</h1>
                <div className="w-3/4 flex flex-col gap-6">
                    <SignInputs 
                        placeholder="Nombre" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        error={errors.name}
                    />
                    <SignInputs 
                        placeholder="Apellido" 
                        name="lastname" 
                        value={formData.lastname} 
                        onChange={handleChange} 
                        error={errors.lastname}
                    />
                    <SignInputs 
                        placeholder="Correo electrónico" 
                        name="email" 
                        value={formData.email} 
                        type="email"
                        onChange={handleChange} 
                        error={errors.email}
                    />
                    {emailError && <p className="text-red text-sm -mt-4">{emailError}</p>}
                    <div className="relative flex flex-col">
                        <SignInputs 
                            placeholder="Contraseña" 
                            name="password" 
                            value={formData.password} 
                            type={showPassword ? 'text' : 'password'} 
                            onChange={handleChange} 
                            error={errors.password}
                        />
                        <div 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        >
                            {showPassword ?  <Eye />: <EyeOff />}
                        </div>
                    </div>
                    <div className="relative flex flex-col">
                        <SignInputs 
                            placeholder="Confirmar contraseña" 
                            name="password_confirmation" 
                            value={formData.password_confirmation} 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            onChange={handleChange} 
                            error={errors.password_confirmation}
                        />
                        <div 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        >
                            {showConfirmPassword ? <Eye /> : <EyeOff />}
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        {submitted && errors.name && <p className="text-red text-sm mt-1">{errors.name}</p>}
                        {submitted && errors.lastname && <p className="text-red text-sm">{errors.lastname}</p>}
                        {submitted && errors.email && <p className="text-red text-sm">{errors.email}</p>}
                        {submitted && errors.password && <p className="text-red text-sm">{errors.password}</p>}
                        {submitted && errors.password_confirmation && <p className="text-red text-sm">{errors.password_confirmation}</p>}
                    </div>
                </div>
                <div className="w-3/5 flex flex-col gap-4">
                    <GenericButton 
                        type="button" 
                        onClick={handleSubmit} 
                        placeholder="Registrarse" 
                        className="mt-2 h-12"
                        disabled={!isFormValid}
                    />
                </div>
                <div onClick={onToggleForm} className="text-black hover:underline text-center cursor-pointer" role="button">
                    Iniciar Sesión
                </div>
            </div>
            
            <div className="flex w-full max-h-screen overflow-hidden flex-grow hidden md:block">
                <img
                    src="/img/Register.jpg"
                    className="w-full h-full object-cover"
                    alt="Register Mujer"
                    loading="lazy"
                />
            </div>
        </section>
    );
}
