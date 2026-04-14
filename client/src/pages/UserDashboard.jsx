import React from 'react'
import SideNavbar from '../component/SideNavbar'
import FormUser from '../component/FormUser'
import UserPreviousIssue from '../component/UserPreviousIssue'

const UserDashboard = () => {
  return (
    <div className='bg-gray-300 flex'>
      <SideNavbar></SideNavbar>
      <div className='flex-1 p-5'>
        <FormUser></FormUser>
       

      </div>
      
     
    </div>
  )
}

export default UserDashboard
