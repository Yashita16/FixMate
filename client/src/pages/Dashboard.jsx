import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiVideo, FiMessageSquare, FiArrowRight, FiClock, FiPlusCircle } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { CardSkeleton, EmptyState, StatusBadge } from '../components/common/index.jsx';
import ConsultationCard from '../components/consultation/ConsultationCard.jsx';
import api from '../api/axios.js';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-slate-400 text-xs">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/consultations/my?limit=5');
        const data = res.data.consultations || [];
        setConsultations(data);
        setStats({
          total: res.data.pagination?.total || 0,
          completed: data.filter((c) => c.status === 'completed').length,
          pending: data.filter((c) => c.status === 'pending').length,
        });
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 text-sm">Here's what's happening with your consultations.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<FiVideo className="text-blue-400" size={22} />} label="Total Consultations" value={stats.total} color="bg-blue-500/10" />
          <StatCard icon={<FiMessageSquare className="text-emerald-400" size={22} />} label="Completed" value={stats.completed} color="bg-emerald-500/10" />
          <StatCard icon={<FiClock className="text-yellow-400" size={22} />} label="Pending" value={stats.pending} color="bg-yellow-500/10" />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <Link to="/issues/new" className="card p-5 hover:border-primary-500/40 transition-all group flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
              <FiPlusCircle className="text-primary-400" size={22} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm">Submit a New Issue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Describe your problem and get matched with an expert instantly</p>
            </div>
            <FiArrowRight className="text-slate-500 group-hover:text-primary-400 transition-colors" size={18} />
          </Link>

          <Link to="/experts" className="card p-5 hover:border-primary-500/40 transition-all group flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center group-hover:bg-accent-500/20 transition-colors">
              <FiVideo className="text-accent-500" size={22} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm">Browse All Experts</h3>
              <p className="text-xs text-slate-400 mt-0.5">Filter by category, rating, and availability</p>
            </div>
            <FiArrowRight className="text-slate-500 group-hover:text-accent-500 transition-colors" size={18} />
          </Link>
        </div>

        {/* Recent consultations */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Recent Consultations</h2>
            <Link to="/consultations" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <FiArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : consultations.length === 0 ? (
            <EmptyState
              icon="🎯"
              title="No consultations yet"
              description="Submit your first issue to get matched with an expert."
              action={
                <Link to="/issues/new" className="btn-primary inline-flex items-center gap-2">
                  <FiPlusCircle size={15} /> Submit Issue
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultations.map((c) => <ConsultationCard key={c._id} consultation={c} role="user" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;