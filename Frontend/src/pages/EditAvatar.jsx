import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function EditAvatar() {
    const [avatar, setAvatar] = useState(null)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState(""); // Success message state
    const navigate = useNavigate(); 

    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]); 
      };
      const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("");
        try{
            const formData = new FormData()
            if (avatar) formData.append("avatar", avatar);
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/update-avatar`,
                formData,
                { withCredentials: true }
            );

            
            setSuccessMessage("Avatar Changed Successfully"); // Show success message

            setTimeout(() => {
                navigate("/my-account"); // Navigate after 2 seconds
            }, 1000);
          
        }
        catch(error){
            console.log(error);
            
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
        
      }
  return (
    <div>
      
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {error && <div className='text-red-600'>{error}</div>}
        {successMessage && <div className='text-green-600'>{successMessage}</div>}
        <button 
                className='transition duration-500 hover:bg-buttons1 py-3 px-6 bg-gray-50' 
                onClick={handleSubmit}
        >
                Change Password
        </button>
        
    </div>
  )
}

export default EditAvatar
