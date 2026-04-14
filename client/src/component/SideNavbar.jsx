import React from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const SideNavbar = () => {
  const navigate = useNavigate();
  const {isUserLogin , setIsUserLogin}=useAppContext();

  
const handleLogout = () => {
  console.log("logout clicked");
  setIsUserLogin(false);
  navigate('/user-login');
};
 
  return (
    <div className='w-[70px] sm:w-[160px] md:w-[180px] lg:w-[200px] min-h-screen bg-white shadow-md border-r border-gray-200 flex flex-col  '>
      <div className='flex flex-row items-center w-20 h-20 '>
        <img src={assets.icon} alt="" className='w-20 h-20 cursor-pointer' />
        <h1 className='font-semibold'> FixMate </h1>

      </div>

      <p className='border border-gray-300 w-[70px] sm:w-[180px] md:w-[190px] lg:w-[200px] h-[1px] '></p>

      <div className='flex flex-col h-[88vh] justify-between'>

         <div className='flex flex-col gap-5 mt-5 text-gray-500 px-8 '>
        <Link  to="/user-dashboard"className='hover:text-primary-blue' >Report Issue</Link>
        <Link to="/user-dashboard/previous-issues" className='hover:text-primary-blue' >Previous Issues</Link>
        <button onClick={handleLogout}  className='hover:text-primary-blue cursor-pointer'
        >Log Out</button>
       </div>

      <div className='flex flex-col w-[70px] sm:w-[160px] md:w-[180px] lg:w-[200px] h-[50px] sm:h-[60px] lg:h-[100px] md:h-[80px] border border-gray-300 mt-10 '>
       

      {/* BOTTOM PROFILE SECTION */}
      <div className='flex flex-row items-center gap-3 p-3 border-t border-gray-200 h-[50px] justify-center my-auto cursor-pointer'>
        <img 
          src={assets.profile_pic} 
          alt="" 
          className='w-10 h-10 rounded-full object-cover'
        />
        <div className='hidden sm:block'>
          <p className='text-sm font-medium'>Yashita</p>
          <p className='text-xs text-gray-500'>User</p>
        </div>
      </div>

    </div>
  




      </div>


      </div>

     
      
   
  )
}

export default SideNavbar
