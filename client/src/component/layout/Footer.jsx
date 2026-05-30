import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-slate-900 border-t border-slate-700/50 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-white font-bold text-xl">FixMate</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Connect instantly with verified experts for real-time video consultations. Get your problems solved, fast.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
          <ul className="space-y-2">
            {[['Find Experts', '/experts'], ['How it Works', '/'], ['Become an Expert', '/signup']].map(([label, to]) => (
              <li key={to}><Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
          <ul className="space-y-2">
            {[['About', '/'], ['Privacy', '/'], ['Terms', '/']].map(([label, to]) => (
              <li key={label}><Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700/50 mt-8 pt-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} FixMate. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;