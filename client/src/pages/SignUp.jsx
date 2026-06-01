import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import { Button, Input } from '../component/common/index.jsx';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'user' } });
  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/register', { name: data.name, email: data.email, password: data.password, role: data.role });
      const res = await login(data.email, data.password);
      toast.success('Account created successfully!');
      if (res.user.role === 'expert') navigate('/expert/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-slate-950 to-accent-500/5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-white font-bold text-2xl">FixMate</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 mt-1 text-sm">Start solving problems today</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">I want to...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'user', label: '🙋 Get Help', desc: 'Find experts & consult' },
                  { value: 'expert', label: '🧑‍💼 Be an Expert', desc: 'Help others & earn' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all text-center ${
                      selectedRole === opt.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <input type="radio" value={opt.value} className="hidden" {...register('role')} />
                    <div className="text-base">{opt.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="relative">
              <FiUser className="absolute left-3 top-9 text-slate-400" size={16} />
              <Input
                label="Full name"
                placeholder="John Doe"
                className="pl-10"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-3 top-9 text-slate-400" size={16} />
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                })}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-9 text-slate-400" size={16} />
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                className="pl-10 pr-10"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-slate-400 hover:text-white">
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>

            {selectedRole === 'expert' && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-400">
                ⚠️ Expert accounts require admin approval before you can accept consultations.
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full py-3 text-base">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;