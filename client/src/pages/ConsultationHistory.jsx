import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../component/layout/Navbar.jsx';
import ConsultationCard from '../component/consultation/ConsultationCard.jsx';
import { CardSkeleton, EmptyState, Modal, StarRating, Textarea, Button } from '../component/common/index.jsx';
import api from '../api/axios.js';

const STATUS_TABS = ['all', 'pending', 'accepted', 'completed', 'cancelled', 'rejected'];

const ConsultationHistory = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [reviewModal, setReviewModal] = useState(null); // consultation object
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchConsultations = async (tab, page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (tab !== 'all') params.set('status', tab);
      const res = await api.get(`/consultations/my?${params}`);
      setConsultations(res.data.consultations || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchConsultations(activeTab); }, [activeTab]);

  const handleReviewSubmit = async () => {
    if (!rating) { toast.error('Please select a rating'); return; }
    setReviewLoading(true);
    try {
      await api.post('/reviews', { consultationId: reviewModal._id, rating, comment });
      toast.success('Review submitted! Thank you.');
      setReviewModal(null);
      setRating(0);
      setComment('');
      fetchConsultations(activeTab);
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally { setReviewLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Consultation History</h1>
          <p className="text-slate-400 text-sm">Track all your past and ongoing consultations.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
        ) : consultations.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No consultations found"
            description={activeTab === 'all' ? "You haven't booked any consultations yet." : `No ${activeTab} consultations.`}
          />
        ) : (
          <div className="space-y-4">
            {consultations.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ConsultationCard consultation={c} role="user" />
                {c.status === 'completed' && !c.isReviewed && (
                  <div className="mt-2 ml-1">
                    <button
                      onClick={() => setReviewModal(c)}
                      className="text-xs text-primary-400 hover:text-primary-300 underline"
                    >
                      ⭐ Leave a review
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            <Button variant="secondary" disabled={pagination.page <= 1}
              onClick={() => fetchConsultations(activeTab, pagination.page - 1)}>Previous</Button>
            <span className="text-slate-400 text-sm self-center">
              {pagination.page} / {pagination.pages}
            </span>
            <Button variant="secondary" disabled={pagination.page >= pagination.pages}
              onClick={() => fetchConsultations(activeTab, pagination.page + 1)}>Next</Button>
          </div>
        )}
      </div>

      {/* Review modal */}
      <Modal isOpen={!!reviewModal} onClose={() => setReviewModal(null)} title="Rate Your Experience">
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">How was your consultation?</p>
          <div className="flex justify-center">
            <StarRating rating={rating} size="lg" interactive onRate={setRating} />
          </div>
          <Textarea
            label="Comment (optional)"
            placeholder="Tell others about your experience..."
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setReviewModal(null)} className="flex-1">Cancel</Button>
            <Button onClick={handleReviewSubmit} loading={reviewLoading} className="flex-1">Submit Review</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConsultationHistory;