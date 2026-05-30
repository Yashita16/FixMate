import { Link } from 'react-router-dom';
import { FiVideo, FiClock, FiCalendar } from 'react-icons/fi';
import { StatusBadge } from '../common/index.jsx';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const ConsultationCard = ({ consultation, role = 'user' }) => {
  const { _id, user, expert, status, createdAt, durationMinutes, amount, issue, isReviewed } = consultation;
  const other = role === 'user' ? expert?.user : user;
  const expertObj = expert;

  return (
    <div className="card p-5 hover:border-slate-600/50 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {other?.profileImage ? (
            <img src={other.profileImage} alt={other.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">{other?.name?.[0]?.toUpperCase() || '?'}</span>
            </div>
          )}
          <div>
            <p className="font-medium text-white text-sm">{other?.name || 'Unknown'}</p>
            {issue && <p className="text-xs text-slate-400 truncate max-w-[180px]">{issue.title}</p>}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1"><FiCalendar size={11} />{formatDate(createdAt)}</span>
        {durationMinutes > 0 && <span className="flex items-center gap-1"><FiClock size={11} />{durationMinutes} min</span>}
        {amount > 0 && <span className="ml-auto text-primary-400 font-medium">${amount}</span>}
      </div>

      <div className="flex gap-2 flex-wrap">
        {status === 'accepted' && (
          <Link to={`/room/${_id}`} className="btn-primary py-1.5 text-xs flex items-center gap-1">
            <FiVideo size={12} /> Join Session
          </Link>
        )}
        {status === 'pending' && role === 'expert' && (
          <Link to={`/expert/dashboard`} className="btn-outline py-1.5 text-xs">Respond</Link>
        )}
        {status === 'completed' && role === 'user' && !isReviewed && (
          <Link to={`/consultations`} className="btn-secondary py-1.5 text-xs">Leave Review</Link>
        )}
        <Link to={`/consultations`} className="btn-ghost py-1.5 text-xs">Details</Link>
      </div>
    </div>
  );
};

export default ConsultationCard;