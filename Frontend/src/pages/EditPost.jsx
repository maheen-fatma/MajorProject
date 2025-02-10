import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dbService from '../appwrite/databases';
import { PostManipulation } from '../components';
function EditPost() {
    const {postId} = useParams();
    const [post, setPost] = useState();
    const navigate = useNavigate()

    useEffect(()=>{
        if(postId){
            dbService.getPost(postId).then((post)=>{
                if(post)
                    setPost(post)
            })
        } else {
            navigate("/")
        }
    },[postId, navigate])
  return post ? (
    <div>
      <PostManipulation post={post} />
    </div>
  ) : null
}

export default EditPost
