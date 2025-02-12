import React from 'react'
import { Input, Button, Logo } from '../components'
//import { useDispatch } from 'react-redux'
import { useState } from 'react'
import authService from '../appwrite/auth'
import { login } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
function SignUp() {
  const navigate= useNavigate()
  //const dispatch = useDispatch()

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]); 
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try{
      const formData = new FormData(); // form data since we are using multipart for including a file as well
      formData.append("fullName", fullName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) formData.append("avatar", avatar);

      const session= await authService.createAccount(formData)
      if(session){
        //const userData = await authService.getLoggedInUser() 
        //if(userData) 
        //dispatch(login(userData))
        navigate("/sign-in")
      }
    }
    catch(error){
      setError(error.message)
    }
    
  }
  return (
    <div className=' font-dolce p-10 flex flex-col items-center justify-center text-customMaroon'>
      
      <div className=' bg-whiteBg p-8 rounded-md shadow-lg shadow-neutral-500 lg:w-1/3'>
      <h1 className=' mb-10 text-2xl font-bold'>Sign-Up</h1>
      <form onSubmit={handleSubmit} className=' space-y-6'>
        <Input 
          value={fullName}
          type="text"
          placeholder="Full Name"
          className="p-2 lg:w-full rounded-sm border  bg-white focus:outline-none focus:ring-2 focus:ring-background focus:border-transparent focus:shadow-md"
          onChange={(e)=>setFullName(e.target.value)}
        /> 
        <Input 
          value={email}
          type="email"
          placeholder="Email"
          className="p-2 lg:w-full rounded-sm border  bg-white focus:outline-none focus:ring-2 focus:ring-background focus:border-transparent focus:shadow-md"
          onChange={(e)=>setEmail(e.target.value)}
        /> 
        <div>
        <Input 
          value={password}
          type="password"
          placeholder="Password"
          className="p-2 lg:w-full rounded-sm border   bg-white focus:outline-none focus:ring-2 focus:ring-background focus:border-transparent focus:shadow-md"
          onChange={(e)=>setPassword(e.target.value)}
        /> 
        <div className=' text-xs mt-1 ml-1 text-gray-500 '>Must be at least 8 characters.</div>
        </div>
        <Input 
          value={username}
          type="text"
          placeholder="Username"
          className="p-2 lg:w-full rounded-sm border   bg-white focus:outline-none focus:ring-2 focus:ring-background focus:border-transparent focus:shadow-md"
          onChange={(e)=>setUsername(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <Button 
          children='Create Account'
          textColor='text-white'
          className='lg:w-full bg-black  hover:shadow-md rounded-md transition-transform transform duration-300 ease-in-out hover:scale-105 hover:bg-buttons1 hover:text-black '
          type='submit'
        />
      </form>
      <br />
      <p className=' text-gray-500'>Already have an account? <Link to="/sign-in" className=' hover:text-customMaroon underline underline-offset-2'>Sign In</Link> </p>
      </div>
    </div>
  )
}

export default SignUp
