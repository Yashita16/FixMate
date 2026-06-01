import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSend, FiZap } from 'react-icons/fi';
import Navbar from '../component/layout/Navbar.jsx';
import { Button, Input, Textarea, Select } from '../component/common/index.jsx';
import ExpertCard from '../component/expert/ExpertCard.jsx';
import api from '../api/axios.js';

const IssueSubmission = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [matchedExperts, setMatchedExperts] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { urgency: 'medium' },
  });

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/issues', data);
      setMatchedExperts(res.data.matchedExperts || []);
      setSubmitted(true);
      toast.success('Issue submitted! Here are your matched experts.');
    } catch (err) {
      toast.error(err.message || 'Failed to submit issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Submit Your Issue</h1>
              <p className="text-slate-400">Describe your problem and we'll instantly match you with the best experts.</p>
            </div>

            <div className="card p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Issue Title"
                  placeholder="e.g. My Node.js app crashes on startup"
                  error={errors.title?.message}
                  {...register('title', {
                    required: 'Title is required',
                    minLength: { value: 5, message: 'Title must be at least 5 characters' },
                    maxLength: { value: 100, message: 'Title cannot exceed 100 characters' },
                  })}
                />

                <Textarea
                  label="Detailed Description"
                  placeholder="Describe your issue in detail. The more context you give, the better expert we can match you with..."
                  rows={5}
                  error={errors.description?.message}
                  {...register('description', {
                    required: 'Description is required',
                    minLength: { value: 20, message: 'Description must be at least 20 characters' },
                  })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    error={errors.category?.message}
                    options={[
                      { value: '', label: '-- Select a category --' },
                      ...categories.map((c) => ({ value: c._id, label: `${c.icon} ${c.name}` })),
                    ]}
                    {...register('category', { required: 'Category is required' })}
                  />
                  <Select
                    label="Urgency"
                    options={[
                      { value: 'low', label: '🟢 Low – Not urgent' },
                      { value: 'medium', label: '🟡 Medium – Needs attention' },
                      { value: 'high', label: '🔴 High – Critical issue' },
                    ]}
                    {...register('urgency')}
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-primary-500/10 rounded-lg text-sm text-primary-400">
                  <FiZap size={15} />
                  Our AI will instantly match you with the top-rated available experts in your category.
                </div>

                <Button type="submit" loading={loading} className="w-full py-3 text-base">
                  <FiSend size={15} /> Submit & Match Experts
                </Button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-white mb-2">We found your experts!</h2>
              <p className="text-slate-400">Select an expert below to book an instant consultation.</p>
            </div>

            {matchedExperts.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-slate-400 mb-4">No available experts found for your category right now.</p>
                <Button onClick={() => navigate('/experts')} variant="secondary">Browse All Experts</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {matchedExperts.map((expert, i) => (
                  <ExpertCard key={expert._id} expert={expert} index={i} />
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-8 justify-center">
              <Button onClick={() => navigate('/experts')} variant="secondary">Browse More Experts</Button>
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IssueSubmission;