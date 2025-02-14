import React from 'react'
import { Input, Button } from '../components'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import authService from '../backend/auth'
import { login } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

function SignIn() {

  const navigate= useNavigate()
  const dispatch = useDispatch()

  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try{
      const session= await authService.login({email, username, password})
      if(session){
        const userData = session.user
        if(userData) dispatch(login(userData))
        navigate("/")
      } 
    }
    catch(error){
      
      if(error && error.message){
        setError(error.message || "Login failed please try again")
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
    
  }
  return (
    <>
    
    <div className=' font-dolce p-10 flex flex-col items-center justify-center text-customMaroon '>
      
      <div className=' bg-whiteBg p-8 rounded-md  lg:w-1/3 shadow-lg shadow-neutral-500'>
      <h1 className=' mb-10 text-2xl font-bold'>Sign-In</h1>
      <form onSubmit={handleSubmit} className=' space-y-6'>
        
        <Input 
          value={email}
          type="email"
          placeholder="Email"
          className="p-2 lg:w-full rounded-sm border  bg-white focus:outline-none focus:ring-2 focus:ring-background focus:border-transparent focus:shadow-md"
          onChange={(e)=>setEmail(e.target.value)}
        />
        OR
        <Input 
          value={username}
          type="text"
          placeholder="Username"
          className="p-2 lg:w-full rounded-sm border  bg-white focus:outline-none focus:ring-2 focus:ring-background focus:border-transparent focus:shadow-md"
          onChange={(e)=>setUsername(e.target.value)}
        /> 
        
        <Input 
          value={password}
          type="password"
          placeholder="Password"
          className="p-2 lg:w-full rounded-sm border   bg-white focus:outline-none focus:ring-2 focus:ring-background focus:border-transparent focus:shadow-md"
          onChange={(e)=>setPassword(e.target.value)}
        /> 
        
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <Button 
          children='Sign In'
          textColor='text-white'
          className='lg:w-full   hover:shadow-md rounded-md transition-transform transform duration-300 ease-in-out hover:scale-105 bg-black hover:bg-buttons1 hover:text-black '
          type='submit'
        />
      </form>
      <br />
      <p className=' text-gray-500'>Don't have an account? <Link to="/sign-up" className=' hover:text-customMaroon underline underline-offset-2'>Sign Up</Link> </p>
      </div>
    </div>
   
    </>
  )
}

export default SignIn
