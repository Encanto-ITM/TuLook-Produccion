import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import {EditProfile} from './EditProfile';
import { fetchUserData } from '../hooks/userData'; 
import { logout } from '../hooks/useLogout'; 
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import { useCart } from '../Cart/CartContext';

export default function UserProfile({ open, onClose }) {
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [isExiting, setIsExiting] = useState(false); 
    const navigate = useNavigate();

    const handleProfileUpdated = (updatedUser) => {
        setUserData(updatedUser); 
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
            setIsExiting(false);
        }, 500);
    };
    const handleCloseEdit = () => {
        setIsExiting(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setIsExiting(false);
        }, 500);
      };

    const closeEditProfileModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            const user = await fetchUserData();
            if (user) {
                setUserData(user);
                setShowContent(true);
            } else {
                window.location.href = '/login'; 
            }
        };

        if (open) {
            fetchData();
            setShowContent(false);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            setShowContent(true);
            setIsExiting(false); 
        }
    }, [open]);

    if (!userData) return null; 

    const handleGoToWorkerProfile = () => {
        navigate(`/workerprofile/${userData.id}`, { state: { worker: userData } });
    };

    const handleOrders = () => {
        navigate(`/list/${userData.id}`);
        closeModal();
    };

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const { clearCart } = useCart();
    const handleClearCart = () => {
        clearCart();
        console.log('Carrito limpiado');  
    };

    return (
        <Modal open={open} onClose={closeModal}>
            <Box className="fixed inset-0 flex items-start justify-end p-4 pt-20" onClick={handleCloseModal}>
                <Grow in={showContent && !isExiting} timeout={500}>
                    <div className='bg-white text-black max-w-lg w-full rounded-lg relative shadow-lg overflow-y-auto' style={{ maxHeight: '90vh' }}>
                        
                        <div className="p-6 relative">
                            <button onClick={closeModal} className="absolute top-4 right-4 text-black text-lg">X</button>
                            
                            <div className='flex flex-col items-center text-center'>
                                <div className="w-32 h-32 bg-gray-300 flex items-center justify-center rounded-full border-2 border-gray-300 overflow-hidden">
                                    <img 
                                        className="w-full h-full object-cover" 
                                        src={userData.profilephoto || '/img/Death Note.jpg'} 
                                        alt={`${userData.name} ${userData.lastname}`}
                                        onError={(e) => {
                                            e.target.src = '/img/template-img.png';
                                        }}
                                    />
                                </div>
                                <h2 className="text-2xl font-bold mt-4">{userData.name} {userData.lastname}</h2>
                                <div className='flex items-center text-center gap-4'>
                              
                                <button class="btn-edit" onClick={openModal}>Editar 
                                    <svg class="svg" viewBox="0 0 512 512">
                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                                </button>


        
                                    {userData.acounttype_id === 3 && (
                                        <button class="btn-edit" onClick={handleGoToWorkerProfile}>Perfil
                                    <svg class="svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.49939C10.7857 5.49939 9.65119 5.83167 8.68004 6.40982C7.75056 6.96316 6.97046 7.74197 6.41557 8.67041L6.33669 8.81256L8.97987 8.05464L9.39332 9.49654L4.28753 10.9606L2.92432 6.20674L4.3662 5.79326L5.02392 8.08686L5.11519 7.92239L5.12101 7.9126C5.80399 6.76541 6.76552 5.80389 7.91273 5.12093C9.10954 4.40843 10.5082 3.99939 12 3.99939C16.4186 3.99939 20.0006 7.58138 20.0006 12C20.0006 16.4186 16.4186 20.0006 12 20.0006C9.75159 20.0006 7.71868 19.0721 6.2661 17.5796L7.34105 16.5334C8.5229 17.7478 10.1729 18.5006 12 18.5006C15.5902 18.5006 18.5006 15.5902 18.5006 12C18.5006 8.40981 15.5902 5.49939 12 5.49939Z" fill="#ffffff"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.25 12.3086V8H12.75V11.6873L15.5016 14.4389L14.441 15.4995L11.25 12.3086Z" fill="#ffffff"></path> </g></svg>
                                </button>)}

                                <button class="btn-edit" onClick={handleOrders}>Ordenes
                                    <svg class="svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.49939C10.7857 5.49939 9.65119 5.83167 8.68004 6.40982C7.75056 6.96316 6.97046 7.74197 6.41557 8.67041L6.33669 8.81256L8.97987 8.05464L9.39332 9.49654L4.28753 10.9606L2.92432 6.20674L4.3662 5.79326L5.02392 8.08686L5.11519 7.92239L5.12101 7.9126C5.80399 6.76541 6.76552 5.80389 7.91273 5.12093C9.10954 4.40843 10.5082 3.99939 12 3.99939C16.4186 3.99939 20.0006 7.58138 20.0006 12C20.0006 16.4186 16.4186 20.0006 12 20.0006C9.75159 20.0006 7.71868 19.0721 6.2661 17.5796L7.34105 16.5334C8.5229 17.7478 10.1729 18.5006 12 18.5006C15.5902 18.5006 18.5006 15.5902 18.5006 12C18.5006 8.40981 15.5902 5.49939 12 5.49939Z" fill="#ffffff"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.25 12.3086V8H12.75V11.6873L15.5016 14.4389L14.441 15.4995L11.25 12.3086Z" fill="#ffffff"></path> </g></svg>
                                </button>                                
                                </div>
                            </div>
                        </div>
                        
                        <div className='bg-purple p-6 rounded-b-lg shadow-md'>
                            <p className="text-white text-xs">Email</p>
                            <p className="text-white text-base mb-3">{userData.email}</p>
                            <hr className="border-white my-2" /> 

                            <p className="text-white text-xs">Número de Contacto</p>
                            <p className="text-white text-base mb-3">{userData.contact_number || 'No disponible'}</p>
                            <hr className="border-white my-2" /> 

                            <p className="text-white text-xs">Descripción</p>
                            <p className="text-white text-base mb-3">{userData.description || 'No hay descripción disponible'}</p>
                            <hr className="border-white my-2" /> 

                            
                            <button class="Btn" onClick={() => { logout();  }}>
                            
                                <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
                                
                                <div class="text">Logout</div>
                            </button>
                        </div>
        
                        <EditProfile 
                        open={isModalOpen} 
                        onClose={handleCloseEdit} 
                        user={userData} 
                        onProfileUpdated={handleProfileUpdated} 
                        />
                    </div>
                </Grow>
            </Box>
        </Modal>
    );
}
