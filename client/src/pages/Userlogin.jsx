import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Userlogin = () => {
  const navigate=useNavigate()

  const {isUserLogin , setIsUserLogin} = useAppContext();

  return (
   
       <div className='min-h-screen bg-primary-background flex items-center justify-center'>

        <div className='flex flex-col items-center mx-auto bg-white h-[70vh] w-[90%] sm:w-[400px] rounded-2xl shadow-lg px-6'>

          
        
          <div className='flex flex-col items-center mt-20'>
            {isUserLogin ? <h1 className='text-3xl text-primary-text font-semibold  '>User Login</h1> :<h1 className='text-3xl text-primary-text font-semibold'>User Signup</h1> }
            
            <p className='text-gray-600 mt-5'>Please Sign in to continue</p>
          </div>

          {isUserLogin ?  <div className='flex flex-col items-center mt-8 gap-4'>
           
            <input type="email" placeholder='Enter your Email' className='border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue' required />
            <input type="text" placeholder='Enter your Password' className='border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue' required />

           </div> : 
           <div className='flex flex-col items-center mt-8 gap-4'>
            <input type="text" placeholder='Enter your Name' className='border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue' required/>
            <input type="email" placeholder='Enter your Email' className='border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue' required />
            <input type="password" placeholder='Enter your Password' className='border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue' required/>

           </div> }
           
           
             {isUserLogin?  <h3 className='text-primary-blue cursor-pointer ml-auto mt-4 mx-5' onClick={()=> navigate('/forget-password')}>Forget Password?</h3> : null}

             {isUserLogin ? 
           <button className='mt-8 text-white border border-gray-200 w-[250px] bg-primary-blue rounded-lg py-2 cursor-pointer hover:primary-blue-dull  transition-all duration-200'

           onClick={()=>{navigate('/user-dashboard')}}
           
           >Login</button> :
             
           <button className='mt-8 text-white border border-gray-200 w-[250px] bg-primary-blue rounded-lg py-2 cursor-pointer hover:primary-blue-dull  transition-all duration-200' onClick={()=>
            {
            setIsUserLogin(true);
            navigate('/user-dashboard')
            
            }}>Sign UP</button>}
          


           <div className='w-[250px] h-[1px] border border-gray-400 mt-8'></div>

          <p className='mt-4 text-sm text-gray-500'>
  {isUserLogin ? "Don't have an account?" : "Already have an account?"}
  
  <span 
    onClick={()=>setIsUserLogin(!isUserLogin)}
    className='text-primary-orange cursor-pointer ml-1 font-medium'
  >
    {isUserLogin ? "Sign Up" : "Login"}
  </span>
</p>
           
           
            </div>

       </div>
       


      
      
  
  )
}

export default Userlogin
