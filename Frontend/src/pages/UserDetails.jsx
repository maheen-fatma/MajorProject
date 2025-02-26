import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
//this displays the details of a specific user whose userid is extracted from useParams as userId
function UserDetails() {
  const [avatar, setAvatar] = useState("")
  const [fullname, setFullname] = useState("Loading...")
  const [username, setUsername] = useState("Loading...")
  const [createdAt, setCreatedAt] = useState("Loading")
  const [isFollowing, setIsFollowing] = useState(false)
  const {userId} = useParams();
  const getDetails = async () => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,{}, {withCredentials:true})
    setAvatar(response.data.data.avatar)
    setFullname(response.data.data.fullname)
    setUsername(response.data.data.username)
    setCreatedAt(response.data.data.createdAt)
    }
  const getIsFollowing = async () => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/follows/is-following/${userId}`,{},{withCredentials:true})
    setIsFollowing(response.data.data)
  }
  const toggleFollow = async () => {
    setIsFollowing(!isFollowing)
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/follows/followToggle/${userId}`,{},{withCredentials:true})
    console.log(response.data.data);
    
  }
    useEffect(()=>{
      getDetails()
      getIsFollowing()
    },[])
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10 text-center">
      {/* Avatar */}
      <img 
        src={avatar} 
        alt="User Avatar" 
        className="w-24 h-24 mx-auto rounded-full shadow-md"
      />

      {/* User Details */}
      <h2 className="text-xl font-semibold mt-4">{fullname}</h2>
      <p className="text-gray-500">@{username}</p>
      <p className="text-sm text-gray-400 mt-1">Joined on {new Date(createdAt).toDateString()}</p>

      {/* Follow Button */}
      <button 
        className={`mt-4 px-4 py-2 rounded-lg text-white font-semibold ${
          isFollowing ? 'bg-gray-500' : 'bg-blue-500'
        }`}
        onClick={() => toggleFollow() }
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  )
}

export default UserDetails
