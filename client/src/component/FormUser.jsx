 import { useState } from "react";
import { useNavigate } from "react-router-dom";


const FormUser = () => {
  const [selectCategory , setSelectedCategory]=useState("");
  const navigate = useNavigate();
  

  const onsubmitHandler=(e)=>{
    e.preventDefault();
    navigate('/videocall');

  }

  return (
    <div className='flex flex-col mt-10 flex-1 items-center'>
      
      <h1 className='font-bold text-2xl'>Hello , Username</h1>

      <div className='bg-white w-[90%] md:w-[60vw] mt-4 rounded-xl shadow-lg flex flex-col gap-6 p-8'>
        
        <h1 className='font-semibold text-xl mt-5'>Report an Issue</h1>

        <form className='flex flex-col gap-6' onSubmit={onsubmitHandler}>
          
          <input 
            type="text" 
            placeholder='Enter a brief title of your issue.' 
            className='border border-gray-200 rounded-xl p-2 w-full'  
          />
               
          <select 
            onChange={(e)=> setSelectedCategory(e.target.value)}
            className='border border-gray-200 rounded-xl p-2 text-gray-800'
          >
            <option value="">Select Category</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Technician">Technician</option>
            <option value="Furniture">Furniture Fix</option>
            <option value="Cleaning">Cleaning Problem</option>
          </select>

          <p className='text-gray-400 text-sm'>Description</p>

          <textarea 
            placeholder='Enter Your Issue' 
            className='border border-gray-200 rounded-xl p-2'
          ></textarea>

          <button className='cursor-pointer text-white bg-primary-blue h-[5vh] rounded-xl'>
            Submit Issue
          </button>

        </form>
      </div>
    </div>
  )
}

export default FormUser