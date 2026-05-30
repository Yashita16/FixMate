import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiToggleLeft, FiToggleRight, FiVideo, FiStar, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar.jsx';
import { Button, CardSkeleton, EmptyState, StatusBadge } from '../components/common/index.jsx';
import api from '../api/axios.js';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-slate-400 text-xs">{label}</p>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

const ExpertDashboard = () => {
  const [expertProfile, setExpertProfile] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchData = async () => {
    try {
      const [profileRes, consultRes] = await Promise.all([
        api.get('/experts/me'),
        api.get(`/consultations/expert?status=${activeTab}&limit=20`),
      ]);
      setExpertProfile(profileRes.data);
      setConsultations(consultRes.data.consultations || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const toggleAvailability = async () => {
    setToggling(true);
    try {
      const res = await api.patch('/experts/me/availability');
      setExpertProfile((prev) => ({ ...prev, isAvailable: res.data.isAvailable }));
      toast.success(res.message || 'Availability updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update availability');
    } finally { setToggling(false); }
  };

  const respond = async (consultationId, action) => {
    try {
      await api.patch(`/consultations/${consultationId}/respond`, { action });
      toast.success(`Consultation ${action}ed`);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to respond');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  if (!expertProfile?.isApproved) return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-32 text-center">
        <div className="text-6xl mb-6">⏳</div>
        <h2 className="text-2xl font-bold text-white mb-3">Pending Approval</h2>
        <p className="text-slate-400">Your expert account is under review. We'll notify you once approved.</p>
      </div>
    </div>
  );

  const { rating, consultationsCompleted, totalEarnings, totalReviews, isAvailable } = expertProfile;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Expert Dashboard</h1>
            <p className="text-slate-400 text-sm">Manage your consultations and availability.</p>
          </div>
          <motion.button
            onClick={toggleAvailability}
            disabled={toggling}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isAvailable
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
            }`}
            whileTap={{ scale: 0.97 }}
          >
            {isAvailable ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
            {toggling ? 'Updating...' : isAvailable ? 'Available' : 'Go Offline'}
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<FiStar className="text-yellow-400" size={20} />} label="Rating" value={rating?.toFixed(1) || '0.0'} sub={`${totalReviews} reviews`} color="bg-yellow-500/10" />
          <StatCard icon={<FiCheckCircle className="text-emerald-400" size={20} />} label="Completed" value={consultationsCompleted} color="bg-emerald-500/10" />
          <StatCard icon={<FiDollarSign className="text-primary-400" size={20} />} label="Earnings" value={`$${totalEarnings}`} color="bg-primary-500/10" />
          <StatCard icon={<FiVideo className="text-blue-400" size={20} />} label="Status" value={isAvailable ? 'Live' : 'Offline'} color={isAvailable ? 'bg-emerald-500/10' : 'bg-slate-700'} />
        </div>

        {/* Consultation tabs */}
        <div className="flex gap-2 mb-6">
          {['pending', 'accepted', 'completed', 'rejected'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                activeTab === tab ? 'bg-primary-600 text-white' : 'bg-slate-700/50 text-slate-400 hover:text-white'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Consultation list */}
        {consultations.length === 0 ? (
          <EmptyState icon="📭" title={`No ${activeTab} consultations`} description="New requests will appear here." />
        ) : (
          <div className="space-y-4">
            {consultations.map((c) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="card p-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">{c.user?.name?.[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{c.user?.name}</p>
                    <p className="text-xs text-slate-400">{c.user?.email}</p>
                    {c.userNotes && <p className="text-xs text-slate-500 mt-1 max-w-sm truncate">"{c.userNotes}"</p>}
                    <p className="text-xs text-slate-600 mt-1">
                      {new Date(c.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={c.status} />
                  {c.status === 'pending' && (
                    <>
                      <Button onClick={() => respond(c._id, 'accept')} className="px-3 py-1.5 text-xs">Accept</Button>
                      <Button onClick={() => respond(c._id, 'reject')} variant="danger" className="px-3 py-1.5 text-xs">Reject</Button>
                    </>
                  )}
                  {c.status === 'accepted' && (
                    <a href={`/room/${c._id}`} className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1">
                      <FiVideo size={11} /> Join
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertDashboard;