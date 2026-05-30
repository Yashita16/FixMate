import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiVideo } from 'react-icons/fi';
import { StarRating } from '../common/index.jsx';

const ExpertCard = ({ expert, index = 0 }) => {
  const { _id, user, rating, experience, hourlyRate, isAvailable, skills, bio, consultationsCompleted, categoryDetails } = expert;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card p-5 hover:border-primary-500/40 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative flex-shrink-0">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
          )}
          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${isAvailable ? 'bg-emerald-400' : 'bg-slate-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-sm">{user?.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <StarRating rating={Math.round(rating)} />
            <span className="text-slate-400 text-xs">({rating?.toFixed(1)})</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          {hourlyRate > 0 ? (
            <span className="text-primary-400 font-semibold text-sm">${hourlyRate}<span className="text-slate-500 font-normal text-xs">/hr</span></span>
          ) : (
            <span className="text-emerald-400 text-sm font-medium">Free</span>
          )}
        </div>
      </div>

      {/* Bio */}
      {bio && <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">{bio}</p>}

      {/* Categories */}
      {categoryDetails && categoryDetails.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categoryDetails.slice(0, 3).map((cat, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-700/60 rounded-full text-xs text-slate-300">
              {cat.icon} {cat.name}
            </span>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="px-2 py-0.5 bg-primary-500/10 text-primary-400 rounded-full text-xs">{skill}</span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><FiClock size={11} /> {experience}y exp</span>
        <span className="flex items-center gap-1"><FiVideo size={11} /> {consultationsCompleted} sessions</span>
        <span className={`ml-auto font-medium ${isAvailable ? 'text-emerald-400' : 'text-slate-500'}`}>
          {isAvailable ? '● Available' : '○ Offline'}
        </span>
      </div>

      {/* Action */}
      <Link
        to={`/experts/${_id}`}
        className="block w-full text-center btn-primary py-2 text-sm group-hover:bg-primary-700 transition-colors"
      >
        View Profile & Book
      </Link>
    </motion.div>
  );
};

export default ExpertCard;