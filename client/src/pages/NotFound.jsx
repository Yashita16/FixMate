import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="text-8xl font-black bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
      <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or was moved.</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
        <FiArrowLeft size={15} /> Back to Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;