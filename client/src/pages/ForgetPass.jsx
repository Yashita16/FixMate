import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ForgetPass = () => {

  const [email, setEmail] = useState("");
  const [userGetEmail, setUserGetEmail] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const navigate = useNavigate();

  // ✅ Generate OTP
  const handleOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOtp(code.toString());

    console.log("Generated OTP:", code); // 👈 check here

    setUserGetEmail(true);
  };

  // ✅ Verify OTP
  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      alert("OTP Verified ✅");
    } else {
      alert("Wrong OTP ❌");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-200 px-4'>
      
      <div className='bg-white w-full max-w-md p-6 rounded-2xl shadow-lg flex flex-col items-center'>
        
        {/* Heading */}
        <h1 className='text-2xl font-semibold mt-2'>
          Forgot Password
        </h1>

        {/* Subtext */}
        <p className='text-gray-500 text-sm text-center max-w-xs mt-2'>
          Enter your registered email and we'll send you a reset link.
        </p>

        {/* Form */}
        <div className='w-full mt-6 flex flex-col gap-3'>
          
          {/* Email */}
          <input 
            type="email"
            placeholder='Enter your email'
            className='w-full border border-gray-300 p-2 rounded-lg outline-none focus:border-primary-blue'
            value={email}
            onChange={(e) => setEmail(e.target.value)} required
          />

          {/* Send OTP */}
          <button 
            onClick={handleOtp}
            className='w-full bg-primary-blue text-white p-2 rounded-lg hover:bg-primary-blue-dull transition'
          >
            Send Reset Link
          </button>

          {/* OTP Section */}
          {userGetEmail && (
            <>
              <p className='text-green-500 text-sm'>
                OTP sent to your email
              </p>

              <input 
                type="text"
                placeholder='Enter OTP'
                className='w-full border border-gray-300 p-2 rounded-lg'
                value={otp}
                onChange={(e) => setOtp(e.target.value)} required
              />

              <button 
                onClick={handleVerifyOtp}
                className='w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition'
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Divider */}
          <div className='w-full h-[1px] bg-gray-300 mt-2'></div>

          {/* Back to login */}
          <p className='text-gray-400 text-sm text-center'>
            Remember your password? 
            <span 
              className='text-primary-orange cursor-pointer ml-1'
              onClick={() => navigate('/user-login')}
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}

export default ForgetPass;