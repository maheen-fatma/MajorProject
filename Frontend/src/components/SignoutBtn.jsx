import React from 'react'
import Button from './Button'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { logout } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
function SignoutBtn() {
  const navigate = useNavigate()
    const dispatch = useDispatch()
    const signoutHandler = () => { 
        authService.logout()
        .then(() => {
            dispatch(logout())
            navigate("/")
        })

    }
  return (
    <div>
      <Button 
        children='Sign-out' 
        className='transition duration-500 hover:bg-buttons1 rounded-3xl py-3 px-6  bg-gray-50 '
        onClick={signoutHandler}
      />
    </div>
  )
}

export default SignoutBtn
