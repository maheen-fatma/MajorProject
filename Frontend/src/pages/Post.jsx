import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dbService from '../appwrite/databases';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser'
import {Button, PostManipulation} from '../components'

function Post() {
  const theme = useSelector((state)=>(state.theme.mode))
  
  useEffect(()=>{
    document.querySelector('html').classList.remove("light","dark")
    document.querySelector('html').classList.add(theme)
  },[theme])

  const { fromUrl } = useParams(); //this extracts the 'fromUrl' parameter from the url. This particularly hold the id
  const [post , setPost] = useState(null);
  const navigate = useNavigate();
  const userData = useSelector((state)=> state.auth.userInfo)
  //check if the post that is clicked belongs to the person logged in, for this it will check if the post and the userData exist, then also it will check if the userId parameter of the post is the id parameter of the userData
  const isCurrAuthor = post && userData ? post.userId === userData.$id : false 

  //to fetch that particular post whenever there is a change in the id parameter fetched from the url 
  useEffect(()=>{
    if(fromUrl){
      
      dbService.getPost(fromUrl).then((post)=>{
        if(post) 
          setPost(post);
        else 
        navigate("/")
      })
    } else {
      navigate("/")
    }
  },[fromUrl,navigate])

  const deletePost = ()=> {
    dbService.deletePost(post.$id).then((isDeleted)=>{
      if(isDeleted)
        dbService.deleteFile(post.image)
      navigate("/")
    })
  }

  return post ? (
    <div className=' p-10 lg:px-56'>
      <div className=' flex md:flex-row flex-col justify-center dark:bg-gray-800 dark:text-whiteBg dark:shadow-cyan-900 bg-white rounded-3xl shadow-custom  '>
          <div className='md:w-1/2 '>
              <img 
              src={dbService.filePreview(post.image)} 
              alt="Post Image" 
              className='rounded-tl-3xl rounded-bl-3xl h-full'
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
                    navigate(`/edit-post/${post.$id}`)
                  }}
                  /> </>
                )
                  }
              </div>
              <h1 className=' text-3xl font-dolceBold tracking-wider'>{post.title}</h1>
              <div className=' font-dolce text-lg pt-5'>{ parse(post.content) }</div>
          </div>
      </div>
    </div>
  ) : null
}

export default Post
