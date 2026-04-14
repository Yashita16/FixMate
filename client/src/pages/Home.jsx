import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
       <div className='flex items-center w-[300px] '>
        <img src={assets.logo} alt="logo image" />
       </div>

       <h2  className='text-primary-text text-2xl' >What do you want to do ?</h2>

       <div className='flex flex-col gap-4 mt-8 w-100 '>
         <button className='border rounded-full h-14 text-white bg-primary-blue cursor-pointer hover:bg-primary-blue-dull' onClick={()=>navigate('/user-login')}>I need help</button>
         <button className='border rounded-full h-14 text-white bg-primary-orange cursor-pointer hover:bg-primary-orange-dull' onClick={()=>navigate('/expert-login')}>I am an Expert</button>
       </div>
      
    </div>
  )
}

export default Home
