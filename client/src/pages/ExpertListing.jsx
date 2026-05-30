import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import ExpertCard from '../components/expert/ExpertCard.jsx';
import ExpertFilter from '../components/expert/ExpertFilter.jsx';
import { CardSkeleton, EmptyState, Button } from '../components/common/index.jsx';
import api from '../api/axios.js';

const ExpertListing = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [filters, setFilters] = useState({
    search: '', category: '', minRating: '', available: '', minExperience: '', sort: '-rating',
  });

  const fetchExperts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, ...filters });
      // Remove empty params
      for (const [k, v] of params.entries()) { if (!v) params.delete(k); }
      const res = await api.get(`/experts?${params}`);
      setExperts(res.data.experts || []);
      setPagination(res.data.pagination || { page: 1, total: 0, pages: 1 });
    } catch {}
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchExperts(1); }, [fetchExperts]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 flex-1 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Find an Expert</h1>
          <p className="text-slate-400">
            {pagination.total > 0 ? `${pagination.total} verified experts available` : 'Browse our verified experts'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ExpertFilter filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : experts.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No experts found"
            description="Try adjusting your filters or search terms."
            action={
              <Button onClick={() => setFilters({ search: '', category: '', minRating: '', available: '', minExperience: '', sort: '-rating' })} variant="secondary">
                Clear Filters
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {experts.map((expert, i) => (
                <ExpertCard key={expert._id} expert={expert} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="secondary"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchExperts(pagination.page - 1)}
                  className="px-4 py-2 text-sm"
                >
                  Previous
                </Button>
                <span className="text-slate-400 text-sm px-4">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchExperts(pagination.page + 1)}
                  className="px-4 py-2 text-sm"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ExpertListing;