import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import api from '../../api/axios.js';

const ExpertFilter = ({ filters, onChange }) => {
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  const handleChange = (key, value) => onChange({ ...filters, [key]: value });

  const clearFilters = () =>
    onChange({ search: '', category: '', minRating: '', available: '', minExperience: '', sort: '-rating' });

  const hasActiveFilters = filters.category || filters.minRating || filters.available || filters.minExperience;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search experts by name or skill..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="input-field pl-10 pr-4"
        />
      </div>

      {/* Filter toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <FiFilter size={14} />
          Filters
          {hasActiveFilters && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
            <FiX size={12} /> Clear
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="input-field text-sm py-1.5"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {/* Min Rating */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Min Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) => handleChange('minRating', e.target.value)}
              className="input-field text-sm py-1.5"
            >
              <option value="">Any Rating</option>
              {[4.5, 4, 3.5, 3].map((r) => (
                <option key={r} value={r}>{'★'.repeat(Math.floor(r))} {r}+</option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Availability</label>
            <select
              value={filters.available}
              onChange={(e) => handleChange('available', e.target.value)}
              className="input-field text-sm py-1.5"
            >
              <option value="">Any</option>
              <option value="true">Available Now</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => handleChange('sort', e.target.value)}
              className="input-field text-sm py-1.5"
            >
              <option value="-rating">Highest Rated</option>
              <option value="-consultationsCompleted">Most Sessions</option>
              <option value="-experience">Most Experienced</option>
              <option value="hourlyRate">Lowest Price</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertFilter;