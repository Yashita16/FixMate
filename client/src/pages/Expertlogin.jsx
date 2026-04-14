import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Expertlogin = () => {
  const navigate=useNavigate()

  const {isUserLogin , setIsUserLogin , isExpertLogin , setIsExpertLogin} = useAppContext();
  
  return (
     

  
   
       <div className='min-h-screen bg-primary-background flex items-center justify-center'>

        <div className='flex flex-col items-center mx-auto bg-white h-[85vh] w-[90%] sm:w-[400px] rounded-2xl shadow-lg px-6'>

          
        
          <div className='flex flex-col items-center mt-20'>
            {isExpertLogin ? <h1 className='text-3xl text-primary-text font-semibold  '>Expert Login</h1> :<h1 className='text-3xl text-primary-text font-semibold'>Expert Signup</h1> }
            
            <p className='text-gray-600 mt-5'>Please Sign in to continue</p>
          </div>

          {isExpertLogin ?  <div className='flex flex-col items-center mt-8 gap-4'>
           
            <input type="email" placeholder='Enter your Email' className='border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue' required />
            <input type="text" placeholder='Enter your Password' className='border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue' required />

           </div> : 
           <div className='flex flex-col items-center mt-8 gap-4'>
            <input type="text" placeholder='Enter your Name' className='border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue' required/>
            <input type="email" placeholder='Enter your Email' className='border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue required'  />
          
            <select name="" id="" className='border border-gray-300 rounded-lg px-2 py-2 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-gray-500' required>
            <option value="">Select your expertise type</option>
            <option value="">Technicain</option>
           
            <option value="">Plumber</option>
            
            <option value="">Electrician</option>
            <option value="">Carpenter</option>
            <option value="">House Helper</option>
            </select>
            <input type="password" placeholder='Enter your Password' className='border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue' required/>
            <input type="Number" placeholder='Enter Income per videocall' className='border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue' />

           </div> }
           
           
             {isExpertLogin?  <h3 className='text-primary-blue cursor-pointer ml-auto mt-4 mx-5' onClick={()=> navigate('/forget-password')}>Forget Password?</h3> : null}

             {isExpertLogin ? 
           <button className='mt-8 text-white border border-gray-200 w-[250px] bg-primary-blue rounded-lg py-2 cursor-pointer hover:primary-blue-dull  transition-all duration-200'

           onClick={()=>{navigate('/expert-dashboard')}}
           
           >Login</button> :
             
           <button className='mt-8 text-white border border-gray-200 w-[250px] bg-primary-blue rounded-lg py-2 cursor-pointer hover:primary-blue-dull  transition-all duration-200' onClick={()=>
            {
            setIsExpertLogin(true);
            navigate('/expert-dashboard')
            
            }}>Sign UP</button>}
          


           <div className='w-[250px] h-[1px] border border-gray-400 mt-8'></div>

          <p className='mt-4 text-sm text-gray-500'>
  {isUserLogin ? "Don't have an account?" : "Already have an account?"}
  
  <span 
    onClick={()=>setIsExpertLogin(!isExpertLogin)}
    className='text-primary-orange cursor-pointer ml-1 font-medium'
  >
    {isExpertLogin ? "Sign Up" : "Login"}
  </span>
</p>
           
           
            </div>

       </div>
       


  )
}

export default Expertlogin
