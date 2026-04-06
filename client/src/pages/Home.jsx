import React from 'react'
import { assets } from '../assets/assets'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
       <div className='flex items-center w-[300px] '>
        <img src={assets.logo} alt="logo image" />
       </div>

       <h2  className='text-primary-text text-2xl' >What do you want to do ?</h2>

       <div className='flex flex-col gap-4 mt-8 w-100 '>
         <button className='border rounded-full h-14 text-white bg-primary-blue cursor-pointer hover:bg-primary-blue-dull'>I need help</button>
         <button className='border rounded-full h-14 text-white bg-primary-orange cursor-pointer hover:bg-primary-orange-dull'>I am an Expert</button>
       </div>
      
    </div>
  )
}

export default Home
