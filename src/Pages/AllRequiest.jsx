import React, { useEffect } from 'react';
import { use } from 'react';
import AuthContext from '../contexts/AuthContexts';
import Requests from '../Component/requests';
import { useState } from 'react';
const AllRequiest = () => {
    const {user}=use(AuthContext);
    const [requestPromise,setRequestPromise]=useState(null);
    useEffect(() => {
        if (!user?.email) return;{
            fetch(`http://localhost:3000/requests/${user?.email}`)
            .then(res => res.json())
            .then(data => {
                setRequestPromise(data);
                console.log(data);
            })
            .catch(error => console.error('Error fetching requests data:', error));
        }
     },[user] );
    

    return (
        <div>
            <Requests requestPromise={requestPromise}> </Requests>
        </div>
    );
};

export default AllRequiest;
