import React, { useEffect, useState } from 'react'
import Menu from '../components/common/Menu';
import Farmer from '../components/Farmer';

function Dashboard() {
  const [userData, setUserData] = useState({})
  
  const userInfo = JSON.parse(localStorage.getItem("user"))
  setUserData(userInfo)

  return (
    <div>
        <Menu/>
        {userData.role === "farmer" && <Farmer/>}
    </div>
  )
}

export default Dashboard