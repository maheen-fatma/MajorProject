import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dbService from '../backend/databases';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser'
import axios from 'axios';
import {Button, PostManipulation} from '../components'
import { FaHeart, FaRegHeart } from "react-icons/fa";
const API_URL = import.meta.env.VITE_BACKEND_URL
function Post() {
   
  const theme = useSelector((state)=>(state.theme.mode))
  
  useEffect(()=>{
    document.querySelector('html').classList.remove("light","dark")
    document.querySelector('html').classList.add(theme)
  },[theme])

  const { postId } = useParams(); //this extracts the 'fromUrl' parameter from the url. This particularly hold the id
  const [post , setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false)
  const navigate = useNavigate();
  const userData = useSelector((state)=> state.auth.userInfo)
  //check if the post that is clicked belongs to the person logged in, for this it will check if the post and the userData exist, then also it will check if the userId parameter of the post is the id parameter of the userData
  const isCurrAuthor = post && userData ? post.owner._id === userData._id : false
  const isPostLiked = async ()=>{
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}/liked`,{
          withCredentials: true, 
      });
      return response.data.data; 
    } catch (error) {
      throw error.response?.data || "Could not know if the post is liked or not";
  }
  }

  const likeToggle = async () => {
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/like`, {}, {
        withCredentials: true, 
    });
    setIsLiked(!isLiked);
    return response.data
    } catch (error) {
      throw error.response?.data || "Could not liked/unliked the post";
    }
  }

  //to fetch that particular post whenever there is a change in the id parameter fetched from the url 
  useEffect(() => {
    if (postId) {
      dbService.getPost(postId).then(async (post) => {
        if (post) {
          setPost(post);
          try {
            const likedStatus = await isPostLiked(); 
            setIsLiked(likedStatus); 
          } catch (error) {
            console.error("Error fetching like status:", error);
            setIsLiked(false);
          }
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  }, [postId, navigate]);

  const deletePost = ()=> {
    dbService.deletePost(post._id).then(()=>{
      console.log("Post deleted");
      navigate("/")
    })
  }

  return post ? (
    <div className=' p-10 lg:px-56'>
      <div className=' flex md:flex-row flex-col justify-center dark:bg-gray-800 dark:text-whiteBg dark:shadow-cyan-900 bg-white rounded-3xl shadow-custom  '>
          <div className='md:w-1/2 '>
            <img 
            src={post.imageFile} 
            alt={"Post cant get"} 
            className="rounded-tl-3xl rounded-bl-3xl h-full"
            />
          </div>
          <div className='md:w-1/2 p-5  '>
              <div className='flex justify-end space-x-4'>
                  { isCurrAuthor && ( <>
                  <Button
                  children='Delete'
                  className='  font-dolce tracking-wider rounded-3xl px-5 hover:bg-red-700 '
                  onClick={deletePost}
                  />
                  <Button
                  children='Edit'
                  className=' bg-red-600 text-white font-dolce tracking-wider rounded-3xl px-5 hover:bg-red-700 '
                  onClick={()=>{
                    navigate(`/edit-post/${post._id}`)
                  }}
                  /> </>
                )
                  }
              </div>
              <h1 className=' text-3xl font-dolceBold tracking-wider'>{post.title}</h1>
              <div className=' font-dolce text-sm pt-5 mt-1 '>
                Buy:
              <a href={post.purchaseLink} target="_blank" rel="noopener noreferrer" className=' font-dolce text-sm pt-5 underline text-blue-500 ml-1'>
                  {post.purchaseLink}
              </a>
              <div className="flex items-center mt-2">
                <img 
                  src={post.owner.avatar} 
                  alt="User Avatar" 
                  className="w-6 h-6 rounded-full object-cover mr-2" 
                />
                <div className="text-sm">{post.owner.username}</div>
              </div>
              </div>
              <div className=' font-dolce text-lg pt-5'>{ post.content ? parse(post.content) : ""}</div>
              <button 
                className={`mt-7  rounded-full transition ${
                isLiked ? "text-red-700" : "text-slate-400 hover:text-red-700"
                }`} 
                onClick={likeToggle}
              >
              {isLiked ? (
                <FaHeart fill="red" size={24} />
                ) : (
                <FaRegHeart size={24} />
                )}
              </button>
          </div>
      </div>
    </div>
  ) : null
}

export default Post
