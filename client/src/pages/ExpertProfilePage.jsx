import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiStar, FiClock, FiVideo, FiCheck, FiAlertCircle } from 'react-icons/fi';
import Navbar from '../component/layout/Navbar.jsx';
import { Button, StarRating, Modal, Textarea, FullPageSpinner } from '../component/common/index.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const ExpertProfilePage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [expertRes, reviewsRes] = await Promise.all([
          api.get(`/experts/${id}`),
          api.get(`/reviews/expert/${id}?limit=10`),
        ]);
        setExpert(expertRes.data);
        setReviews(reviewsRes.data.reviews || []);
      } catch { toast.error('Expert not found'); navigate('/experts'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setBookingLoading(true);
    try {
      await api.post('/consultations/request', { expertId: id, userNotes: notes });
      toast.success('Consultation request sent! Waiting for expert to accept.');
      setBookingModal(false);
      navigate('/consultations');
    } catch (err) {
      toast.error(err.message || 'Failed to send request');
    } finally { setBookingLoading(false); }
  };

  if (loading) return <FullPageSpinner />;
  if (!expert) return null;

  const { user: expertUser, rating, experience, hourlyRate, isAvailable, bio, skills, consultationsCompleted, categoryDetails, totalReviews, languages } = expert;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — profile card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {/* Avatar */}
              <div className="text-center mb-5">
                <div className="relative inline-block">
                  {expertUser?.profileImage ? (
                    <img src={expertUser.profileImage} alt={expertUser.name} className="w-24 h-24 rounded-full object-cover mx-auto" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto">
                      <span className="text-white text-3xl font-bold">{expertUser?.name?.[0]}</span>
                    </div>
                  )}
                  <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${isAvailable ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                </div>
                <h1 className="text-xl font-bold text-white mt-3">{expertUser?.name}</h1>
                <p className={`text-sm mt-1 font-medium ${isAvailable ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isAvailable ? '● Available Now' : '○ Currently Offline'}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                <div className="bg-slate-700/40 rounded-lg p-2">
                  <p className="text-white font-semibold text-sm">{rating?.toFixed(1)}</p>
                  <p className="text-slate-500 text-xs">Rating</p>
                </div>
                <div className="bg-slate-700/40 rounded-lg p-2">
                  <p className="text-white font-semibold text-sm">{experience}y</p>
                  <p className="text-slate-500 text-xs">Exp.</p>
                </div>
                <div className="bg-slate-700/40 rounded-lg p-2">
                  <p className="text-white font-semibold text-sm">{consultationsCompleted}</p>
                  <p className="text-slate-500 text-xs">Sessions</p>
                </div>
              </div>

              {/* Rate */}
              <div className="flex items-center justify-between mb-5 p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-400 text-sm">Rate</span>
                <span className="text-primary-400 font-bold">
                  {hourlyRate > 0 ? `$${hourlyRate}/hr` : 'Free'}
                </span>
              </div>

              {/* Categories */}
              {categoryDetails?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryDetails.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-700/60 rounded-full text-xs text-slate-300">
                        {c.icon} {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Book button */}
              {user?.role !== 'expert' && user?.role !== 'admin' && (
                <Button
                  onClick={() => isAuthenticated ? setBookingModal(true) : navigate('/login')}
                  disabled={!isAvailable}
                  className="w-full py-3 mt-2"
                >
                  <FiVideo size={15} />
                  {isAvailable ? 'Book Consultation' : 'Currently Unavailable'}
                </Button>
              )}

              {!isAvailable && (
                <p className="text-xs text-slate-500 text-center mt-2">This expert is offline. Check back later.</p>
              )}
            </div>
          </motion.div>

          {/* Right — details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="card p-6">
              <h2 className="font-semibold text-white mb-3">About</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {bio || 'This expert has not added a bio yet.'}
              </p>
            </div>

            {/* Skills */}
            {skills?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm">
                      <FiCheck size={11} /> {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Reviews ({totalReviews})</h2>
                <div className="flex items-center gap-1">
                  <StarRating rating={Math.round(rating)} size="md" />
                  <span className="text-slate-400 text-sm ml-1">{rating?.toFixed(1)}</span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="border-b border-slate-700/50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs text-white font-semibold">
                          {r.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-white">{r.user?.name}</span>
                        <StarRating rating={r.rating} size="sm" />
                        <span className="text-xs text-slate-500 ml-auto">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {r.comment && <p className="text-slate-400 text-sm pl-9">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking modal */}
      <Modal isOpen={bookingModal} onClose={() => setBookingModal(false)} title="Book Consultation">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-700/40 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-semibold">{expertUser?.name?.[0]}</span>
            </div>
            <div>
              <p className="text-white font-medium text-sm">{expertUser?.name}</p>
              <p className="text-primary-400 text-xs">{hourlyRate > 0 ? `$${hourlyRate}/hr` : 'Free'}</p>
            </div>
          </div>

          <Textarea
            label="Describe your issue (optional)"
            placeholder="Give the expert context about what you need help with..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg text-xs text-blue-400">
            <FiAlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            The expert will receive your request and must accept before the video session starts.
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" onClick={() => setBookingModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleBook} loading={bookingLoading} className="flex-1">
              <FiVideo size={14} /> Send Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExpertProfilePage;