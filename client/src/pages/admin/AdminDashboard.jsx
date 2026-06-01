import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiUsers, FiStar, FiVideo, FiDollarSign, FiCheck, FiX,
  FiGrid, FiTag, FiMenu, FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button, Skeleton, StatusBadge } from '../../component/common/index.jsx';
import api from '../../api/axios.js';

/* ─── Stat Card ─── */
const StatCard = ({ icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
      <p className="text-slate-400 text-xs">{label}</p>
    </div>
  </div>
);

/* ─── Overview ─── */
const Overview = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Overview</h2>
      {!stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i=><Skeleton key={i} className="h-24"/>)}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={<FiUsers className="text-blue-400" size={20}/>} label="Total Users" value={stats.totalUsers} color="bg-blue-500/10"/>
          <StatCard icon={<FiStar className="text-yellow-400" size={20}/>} label="Active Experts" value={stats.totalExperts} color="bg-yellow-500/10"/>
          <StatCard icon={<FiStar className="text-orange-400" size={20}/>} label="Pending Experts" value={stats.pendingExperts} color="bg-orange-500/10"/>
          <StatCard icon={<FiVideo className="text-purple-400" size={20}/>} label="Total Consultations" value={stats.totalConsultations} color="bg-purple-500/10"/>
          <StatCard icon={<FiCheck className="text-emerald-400" size={20}/>} label="Completed" value={stats.completedConsultations} color="bg-emerald-500/10"/>
          <StatCard icon={<FiDollarSign className="text-primary-400" size={20}/>} label="Total Revenue" value={`$${stats.totalRevenue}`} color="bg-primary-500/10"/>
        </div>
      )}
    </div>
  );
};

/* ─── Users ─── */
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users?limit=50').then(r => setUsers(r.data.users||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const toggle = async (id) => {
    try {
      const res = await api.patch(`/admin/users/${id}/toggle-active`);
      setUsers(prev => prev.map(u => u._id===id ? {...u, isActive: res.data.isActive} : u));
      toast.success(res.message);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">All Users ({users.length})</h2>
      {loading ? <Skeleton className="h-64 w-full"/> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-700/50">
              <tr>{['Name','Email','Role','Status','Action'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-400">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {users.map(u=>(
                <tr key={u._id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-slate-400">{u.email}</td>
                  <td className="px-4 py-3"><span className="badge-purple capitalize">{u.role}</span></td>
                  <td className="px-4 py-3">
                    <span className={u.isActive ? 'badge-green' : 'badge-red'}>{u.isActive ? 'Active' : 'Banned'}</span>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && (
                      <Button variant={u.isActive ? 'danger' : 'secondary'} onClick={()=>toggle(u._id)} className="px-3 py-1 text-xs">
                        {u.isActive ? 'Ban' : 'Unban'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ─── Pending Experts ─── */
const PendingExperts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    api.get('/admin/experts/pending').then(r=>setExperts(r.data||[])).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(()=>{ fetch(); },[]);

  const approve = async (id) => {
    try {
      await api.patch(`/admin/experts/${id}/approve`);
      toast.success('Expert approved!');
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  const reject = async (id) => {
    try {
      await api.patch(`/admin/experts/${id}/reject`, { reason: 'Application did not meet requirements.' });
      toast.success('Expert rejected.');
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Pending Expert Approvals ({experts.length})</h2>
      {loading ? <Skeleton className="h-64"/> :
        experts.length === 0 ? <p className="text-slate-400 text-sm">No pending applications.</p> : (
          <div className="space-y-4">
            {experts.map(e=>(
              <div key={e._id} className="card p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {e.user?.profileImage ? (
                    <img src={e.user.profileImage} alt="" className="w-12 h-12 rounded-full object-cover"/>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <span className="text-white font-semibold">{e.user?.name?.[0]}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">{e.user?.name}</p>
                    <p className="text-slate-400 text-xs">{e.user?.email}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{e.experience} years exp · {e.categories?.map(c=>c.name).join(', ')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={()=>approve(e._id)} className="px-4 py-1.5 text-xs flex items-center gap-1">
                    <FiCheck size={12}/> Approve
                  </Button>
                  <Button onClick={()=>reject(e._id)} variant="danger" className="px-4 py-1.5 text-xs flex items-center gap-1">
                    <FiX size={12}/> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};

/* ─── Categories ─── */
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: '', icon: '🔧', description: '' });
  const [adding, setAdding] = useState(false);

  const fetch = () => api.get('/admin/categories').then(r=>setCategories(r.data||[])).catch(()=>{});
  useEffect(()=>{ fetch(); },[]);

  const add = async () => {
    if (!newCat.name) return;
    setAdding(true);
    try {
      await api.post('/admin/categories', newCat);
      toast.success('Category created!');
      setNewCat({ name:'', icon:'🔧', description:'' });
      fetch();
    } catch(err){ toast.error(err.message); }
    finally { setAdding(false); }
  };

  const del = async (id) => {
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Category deleted');
      fetch();
    } catch(err){ toast.error(err.message); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Manage Categories</h2>
      <div className="card p-5 mb-6">
        <h3 className="font-medium text-white mb-3 text-sm">Add New Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="input-field text-sm" placeholder="Category name" value={newCat.name} onChange={e=>setNewCat(p=>({...p,name:e.target.value}))}/>
          <input className="input-field text-sm" placeholder="Icon (emoji)" value={newCat.icon} onChange={e=>setNewCat(p=>({...p,icon:e.target.value}))}/>
          <input className="input-field text-sm" placeholder="Description" value={newCat.description} onChange={e=>setNewCat(p=>({...p,description:e.target.value}))}/>
        </div>
        <Button onClick={add} loading={adding} className="mt-3 text-sm px-5 py-2">Add Category</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c=>(
          <div key={c._id} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="text-white font-medium text-sm">{c.name}</p>
                <p className="text-slate-500 text-xs">{c.description || 'No description'}</p>
              </div>
            </div>
            <button onClick={()=>del(c._id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
              <FiX size={14}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Admin Dashboard Shell ─── */
const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { icon: <FiGrid size={16}/>, label: 'Overview', path: '/admin' },
    { icon: <FiUsers size={16}/>, label: 'Users', path: '/admin/users' },
    { icon: <FiStar size={16}/>, label: 'Pending Experts', path: '/admin/experts' },
    { icon: <FiVideo size={16}/>, label: 'Consultations', path: '/admin/consultations' },
    { icon: <FiTag size={16}/>, label: 'Categories', path: '/admin/categories' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-slate-900 border-r border-slate-700/50 flex-shrink-0 transition-all duration-200 flex flex-col`}>
        <div className="p-4 border-b border-slate-700/50 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          {sidebarOpen && <span className="text-white font-bold">FixMate</span>}
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="ml-auto text-slate-400 hover:text-white">
            <FiMenu size={15}/>
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item=>(
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname===item.path ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}>
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700/50">
          <button onClick={()=>{logout();navigate('/');}}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-slate-700/60 transition-colors w-full">
            <FiLogOut size={15}/>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/users" element={<Users />} />
            <Route path="/experts" element={<PendingExperts />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="*" element={<Overview />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;