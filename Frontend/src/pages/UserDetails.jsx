import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//this displays the details of a specific user whose userid is extracted from useParams as userId
function UserDetails() {
  const [avatar, setAvatar] = useState("")
  const [fullname, setFullname] = useState("Loading...")
  const [username, setUsername] = useState("Loading...")
  const [createdAt, setCreatedAt] = useState("Loading")
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const {userId} = useParams();

const navigate = useNavigate();
const handleClick = (id) => {
   
  navigate(`/userDetails/${id}`);
  
};
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
  }

  const getFollowersAndFollowing = async () => {
    const response1 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/follows/fetchFollowers/${userId}`,{withCredentials:true})
    const response2 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/follows/fetchFollowing/${userId}`,{withCredentials:true})
    setFollowers(response1.data.data.followers)
    setFollowing(response2.data.data.following)
    setFollowerCount(response1.data.data.followerCount)
    setFollowingCount(response2.data.data.followingCount)
  }
    useEffect(()=>{
      getDetails()
      getIsFollowing()
      getFollowersAndFollowing()
    },[userId])
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

      {/* Followers & Following Section */}
      <div className="flex justify-center space-x-8 mt-4">
        <div 
          className="cursor-pointer text-center" 
          onClick={() => {
            setShowFollowers(true);
            setShowFollowing(false);
          }}
        >
          <p className="font-semibold">{followerCount}</p>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>
        <div 
          className="cursor-pointer text-center" 
          onClick={() => {
            setShowFollowing(true);
            setShowFollowers(false);
          }}
        >
          <p className="font-semibold">{followingCount}</p>
          <p className="text-gray-500 text-sm">Following</p>
        </div>
      </div>

      {/* Follow Button */}
    
        <button
          className={`mt-4 px-4 py-2 rounded-lg text-white font-semibold ${
            isFollowing ? 'bg-gray-500' : 'bg-blue-500'
          }`}
          onClick={toggleFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      

      {/* Followers List */}
      {showFollowers && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Followers</h3>
          {followers.length > 0 ? (
            <ul className="text-left">
              {followers.map((follower) => (
                <li key={follower.follower._id} className="border-b py-2 cursor-pointer" onClick={() => handleClick(follower.follower._id)}>
                <span className="font-semibold">{follower.follower.fullName}</span> (@{follower.follower.username})
              </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No followers yet.</p>
          )}
        </div>
      )}

      {/* Following List */}
      {showFollowing && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Following</h3>
          {following.length > 0 ? (
            <ul className="text-left">
              {following.map((user) => (
                <li key={user.followed._id} className="border-b py-2 cursor-pointer" onClick={() => handleClick(user.followed._id)}>
                <span className="font-semibold">{user.followed.fullName}</span> (@{user.followed.username})
              </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Not following anyone yet.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default UserDetails
