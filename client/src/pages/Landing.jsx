import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiVideo, FiShield, FiZap, FiStar, FiArrowRight, FiCheck } from 'react-icons/fi';
import Navbar from '../component/layout/Navbar.jsx';
import Footer from '../component/layout/Footer.jsx';

const features = [
  { icon: <FiZap className="text-yellow-400" size={22} />, title: 'Instant Matching', desc: 'Our algorithm matches you with the best expert in seconds based on your problem category.' },
  { icon: <FiVideo className="text-blue-400" size={22} />, title: 'HD Video Calls', desc: 'Crystal-clear WebRTC video sessions with screen sharing and zero setup required.' },
  { icon: <FiShield className="text-emerald-400" size={22} />, title: 'Verified Experts', desc: 'Every expert is vetted and approved by our admin team before going live.' },
  { icon: <FiStar className="text-purple-400" size={22} />, title: 'Rated & Reviewed', desc: 'Transparent ratings system ensures you always get the best quality consultation.' },
];

const steps = [
  { num: '01', title: 'Describe Your Issue', desc: 'Tell us what you need help with and select a category.' },
  { num: '02', title: 'Get Matched', desc: 'Our AI matches you with the top-rated available expert instantly.' },
  { num: '03', title: 'Start Video Call', desc: 'Connect via HD video and get your problem solved in real time.' },
];

const Landing = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    {/* Hero */}
    <section className="flex-1 pt-24 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-slate-950 to-accent-500/10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Live Expert Consultations
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Fix Any Problem,{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with verified domain experts via real-time video consultation. Submit your issue, get matched in seconds, and solve it live.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/issues/new" className="btn-primary text-base px-8 py-3 flex items-center justify-center gap-2">
              Get Help Now <FiArrowRight size={16} />
            </Link>
            <Link to="/experts" className="btn-outline text-base px-8 py-3">
              Browse Experts
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
            {['No credit card required', '500+ verified experts', 'Available 24/7'].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><FiCheck size={13} className="text-emerald-400" />{t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 px-4 bg-slate-900/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Why FixMate?</h2>
          <p className="text-slate-400">Everything you need to get expert help, fast.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card p-6 hover:border-slate-600 transition-all"
            >
              <div className="w-10 h-10 bg-slate-700/60 rounded-lg flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
          <p className="text-slate-400">Three steps to solving your problem.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-4">{s.num}</div>
              <h3 className="font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-4 bg-gradient-to-r from-primary-900/30 to-accent-500/10">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
        <p className="text-slate-400 mb-8">Join thousands of users solving problems with expert help every day.</p>
        <Link to="/signup" className="btn-primary text-base px-10 py-3 inline-flex items-center gap-2">
          Create Free Account <FiArrowRight size={16} />
        </Link>
      </div>
    </section>

    <Footer />
  </div>
);

export default Landing;