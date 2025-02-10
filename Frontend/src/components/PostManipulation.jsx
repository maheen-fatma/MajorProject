import React, { useCallback, useEffect, useState } from 'react'
import Input from './Input'
import EditorComponent from './EditorComponent'
import dbService from '../appwrite/databases'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
function PostManipulation({post}) {

    
    const userData = useSelector((state)=>(state.auth.userInfo))
    const navigate= useNavigate()
    const [loading , setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        imageState: null
    })
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev)=>({
            ...prev,
            [name]: value,
        }))
    }
    const handleFileChange = (e) => {
        setFormData((prev)=>({
            ...prev,
            imageState: e.target.files[0]
        }))
    }
    

    const slugTransform = useCallback((value)=>{
        if(value){
            return value.trim().toLowerCase().replace(/ /g,'-')
        }
        return "";
    },[])

    useEffect(()=>{
        const newSlug=slugTransform(formData.title)
        if(formData.slug!==newSlug){ 
        setFormData((prev)=>({
            ...prev,
            slug: newSlug
        }))
    }
    },[formData.title, slugTransform])

    const handleSubmit = async (e) => {
        e.preventDefault()
        let file= null //initialize a variable to store the uploaded file
        setLoading(true)
        
        if(formData.imageState){ //if the image file was provided by the user...
            //upload the image file
            file = await dbService.uploadFile(formData.imageState)
            
            
        }

        if(post) //if the post is being updated
        {
            if(file){
                //check if the new file was uploaded then delete the old file
                dbService.deleteFile(post.image)
            }
            //update the existing post with a new data
            const updatedPost = await dbService.editPost(post.$id,{
                ...formData,
                image: file ? file.$id : post.image 
            })
            //here what we did was is to update the formData state variable with the new image id that has been uploaded if at all it was 
            if(updatedPost){ //if every updation was done sucessfully, navigate to the posts page
                setLoading(false)
                navigate(`/posts/${updatedPost.$id}`)
            } 
        }
        else //if new post is to be created
        {
            
            if(file && file.$id){
                
                const fileId = file.$id 
                //if file was uploaded
                formData.image=fileId//add the file id to the form data
                const newPost=await dbService.newPost({
                    ...formData,
                    userId: userData.$id

                })
                if(newPost){
                    setLoading(false)
                    navigate(`/posts/${newPost.$id}`)
                }
            }  
        }
    }
  return loading ? (
    
        <div className=' font-dolce text-2xl tracking-wider' >
            Loading...
        </div>
      
  ) : (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
            label= "Title: "
            name="title"
            value={formData.title}
            placeholder= "Title"
            onChange={handleInputChange}
            required
            className="mb-1 p-2  rounded-md border  bg-white focus:outline-none focus:ring-1 focus:ring-customMaroon focus:border-transparent focus:shadow-lg "
            overallClassName= " font-dolce ml-4"
        />
        <Input
            label= "Slug: "
            name="slug"
            value={formData.slug}
            placeholder= "Slug"
            onChange={handleInputChange}
            disabled
            className="p-2 mb-2 rounded-md border  bg-white focus:outline-none focus:ring-2 focus:ring-background focus:border-transparent focus:shadow-lg "
            overallClassName= " font-dolce ml-4"
        />
        <div className={`p-5 flex ${post ? 'flex-row  space-x-6 ' : 'flex-col space-y-5'} m-10 border border-customMaroon border-solid rounded-2xl`}>

        <div className={` ${post ? 'w-1/2 ' : 'pl-3'}`}>
        <Input
            label= "Add Image: "
            name="imageState"
            type= "file"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            overallClassName =' font-dolce'
            onChange={handleFileChange}
            required={!post} // if post is not there i.e if the user is creating a new post then it is a must
        />
        
        {post && (
            <div className=" pt-5">
            <img
                src={dbService.filePreview(post.image)}
                alt={post.title}
                className=" h-[350px] rounded-lg"
            />
            </div>
        )}
        </div>
        <EditorComponent
            lable="Content: "
            name= "content"
            value= {formData.content}
            onChange={(value) => setFormData((prev)=>({...prev, content: value}))}
            className={` ${post ? 'w-1/2' : ''}`}
        />
        </div>
        <Button
        children={post? "Update":"Create Post"}
        type='submit'
        className=' shadow-md border  border-white border-solid hover:border-none  bg-black text-white ml-10 rounded-md font-dolce font-bold hover:shadow-lg '
        />
      </form>
      
    </div>
  )
}

export default PostManipulation
