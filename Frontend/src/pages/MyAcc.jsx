import React from 'react'
import { useSelector } from 'react-redux'
import SignoutBtn from '../components/SignoutBtn';
function MyAcc() {
    const userData = useSelector((state)=>(state.auth.userInfo))
    console.log(userData);
    const createdAt = userData.$createdAt;
    const date = new Date(createdAt);

const datePart = date.toLocaleDateString('en-US', {
  year: 'numeric', 
  month: 'long', 
  day: 'numeric'
}); // e.g., "August 16, 2024"

const timePart = date.toLocaleTimeString('en-US', {
  hour: '2-digit', 
  minute: '2-digit',
  second: '2-digit',
  hour12: true
}); // e.g., "06:25:07 PM"
  return (
    <div className='p-2 mx-10  font-dolce'>
      <div className='text-3xl'>My Account</div>
      <div>{userData.email}</div>
      <div>{userData.name}</div>
      <div>{datePart}</div>
      <div>{timePart}</div>
      <SignoutBtn/>
    </div>
  )
}

export default MyAcc
