import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ProfileHeader() {
  const location = useLocation();
  const { worker } = location.state || {};

  const [isHeaderImageLoading, setIsHeaderImageLoading] = useState(true);
  const [isProfileImageLoading, setIsProfileImageLoading] = useState(true);
  const [headerImage, setHeaderImage] = useState(worker?.headerphoto);
  const [profileImage, setProfileImage] = useState(worker?.profilephoto);
  const [workerData, setWorkerData] = useState(worker); 
  
  const workerId = worker?.id; 

  useEffect(() => {
    if (!workerId) return; 

    
    const fetchWorkerData = async () => {
      try {
        const response = await fetch(`https://tulookapiv2.vercel.app/api/api/users/${workerId}`);  
        const data = await response.json();
        setWorkerData(data);  
        setHeaderImage(data?.headerphoto);  
        setProfileImage(data?.profilephoto);  
      } catch (error) {
       
      }
    };

    
    const intervalId = setInterval(fetchWorkerData, 1000); 

  
    return () => clearInterval(intervalId);

  }, [workerId]); 

  useEffect(() => {
   
    if (worker) {
      setHeaderImage(worker?.headerphoto);
      setProfileImage(worker?.profilephoto);
      setWorkerData(worker);
    }
  }, [worker]);  

  if (!workerData) {
    return <p>No worker data found</p>;
  }

  return (
    <div className="relative">
    
      {isHeaderImageLoading && (
        <img
          src="https://via.placeholder.com/1500x500/cccccc/ffffff?text=Loading"
          className="w-full h-80 object-cover"
          alt="Cargando encabezado..."
        />
      )}
      <img
        className={`w-full h-80 object-cover ${isHeaderImageLoading ? 'hidden' : ''}`}
        src={`${headerImage}?t=${new Date().getTime()}`} 
        alt="header photo"
        onLoad={() => setIsHeaderImageLoading(false)}
        onError={(e) => {
          e.target.src = '/img/template-img.png';
          setIsHeaderImageLoading(false);
        }}
      />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-md text-center w-80 h-72">
        
        {isProfileImageLoading && (
          <img
            src="https://via.placeholder.com/150/cccccc/ffffff?text=Loading"
            className="w-32 h-32 rounded-full mx-auto border border-gray-300"
            alt="Cargando perfil..."
          />
        )}
        <img
          className={`w-32 h-32 rounded-full mx-auto border border-gray-300 ${isProfileImageLoading ? 'hidden' : ''}`}
          src={`${pre) => {
            e.target.src = '/img/template-img.png';
            setIsProfileImageLoading(false);
          }}`}  
          alt={`${workerData.name} ${workerData.lastname}`}
          onLoad={() => setIsProfileImageLoading(false)}
          onError={() => setIsProfileImageLoading(false)}
        />
        <h2 className="text-xl font-semibold mt-4">{workerData.name} {workerData.lastname}</h2>
        <p className="text-gray-500">{workerData.email}</p>
      </div>
    </div>
  );
}
