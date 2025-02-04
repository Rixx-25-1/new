'use client';

import { useEffect } from "react";

const UserDashboard = () =>{

useEffect(()=>{
    fetch(`http://localhost:3001/issue-book?userId=${userId}`).then((response)=>response.json()).then((data)=>data)
})


    return(
        <div>
            <h1>Welcome to user DASHBOARD</h1>
        </div>
    )
}
export default UserDashboard;