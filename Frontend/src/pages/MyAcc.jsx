import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import SignoutBtn from '../components/SignoutBtn';

function MyAcc() {
    
    const userData1 = useSelector((state) => state.auth.userInfo, shallowEqual); // even if the reference changes it does not rerender. Only on changing the value in the object does it change
    
    // Handle both cases (before & after refresh)
    const userData = userData1?.data || userData1;

    
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (userData) {
            
            setUser(userData);
        } 
    }, [userData]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const date = new Date(user.createdAt);
    const datePart = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const timePart = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    return (
        <div className='p-2 mx-10 font-dolce'>
            <div className='text-3xl'>My Account</div>
            <div>{user.fullName}</div>
            <div>{user.email}</div>
            <div>{datePart}</div>
            <div>{timePart}</div>
            <SignoutBtn />
        </div>
    );
}

export default MyAcc;



