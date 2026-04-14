import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const allRequests = [
  { id: 1, name: "Rahul", task: "Fix React bug", initials: "R", color: "bg-blue-100 text-blue-600" },
  { id: 2, name: "Ananya", task: "Help with Node.js", initials: "A", color: "bg-rose-100 text-rose-600" },
  { id: 3, name: "Vikram", task: "WebRTC setup issue", initials: "V", color: "bg-emerald-100 text-emerald-600" },
  { id: 4, name: "Sneha", task: "UX design feedback", initials: "S", color: "bg-purple-100 text-purple-600" },
  { id: 5, name: "Arjun", task: "Database optimization", initials: "A", color: "bg-amber-100 text-amber-600" },
  { id: 6, name: "Priya", task: "API integration help", initials: "P", color: "bg-teal-100 text-teal-600" },
];

const statusConfig = {
  Online:  { dot: "bg-green-500",  badge: "bg-green-50 text-green-700 border-green-200"  },
  Busy:    { dot: "bg-red-500",    badge: "bg-red-50 text-red-700 border-red-200"        },
  Away:    { dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700 border-amber-200"  },
  Offline: { dot: "bg-gray-400",   badge: "bg-gray-50 text-gray-600 border-gray-200"     },
};

export default function ExpertDashboard() {
  const [status, setStatus]           = useState("Online");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [notifications, setNotifications] = useState(3);
  const [requests, setRequests] = useState(
    allRequests.slice(0, 4).map(r => ({ ...r, state: "pending" }))
  );
  const {isExpertLogin , setIsExpertLogin}=useAppContext()

  const cfg = statusConfig[status];

  const handleAction = (id, action) =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, state: action } : r));

  const handleLoadMore = () => {
    const next = Math.min(visibleCount + 2, allRequests.length);
    setRequests(allRequests.slice(0, next).map(r => ({ ...r, state: "pending" })));
    setVisibleCount(next);
  };

  const navigate = useNavigate();

  const handleLogOut=()=>{
    setIsExpertLogin(false);
    navigate("/expert-login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full lg:w-[50vw] space-y-3">

        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between px-1">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Expert Dashboard</h1>
          <div className="flex items-center gap-2">
           
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow cursor-pointer">
              YS
            </div>
            <div className="w-19 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow cursor-pointer" onClick={()=>handleLogOut()}>
              Log Out
            </div>
          </div>
        </div>

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start gap-4">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow">
                YS
              </div>
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${cfg.dot}`} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-slate-800">Yashita Sharma</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Frontend Expert</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="bg-amber-50 text-amber-600 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded-lg">⭐ 4.8</span>
                <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-lg">2 Yrs Exp</span>
                <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-lg">···</span>
              </div>
            </div>

            {/* Status dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setDropdownOpen(p => !p)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${cfg.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {status}
                <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                  {Object.keys(statusConfig).map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setStatus(opt); setDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-left text-slate-700 hover:bg-slate-50 transition-colors ${status === opt ? "bg-slate-50" : ""}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusConfig[opt].dot}`} />
                      {opt}
                      {status === opt && (
                        <svg className="w-3 h-3 ml-auto text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
            {[
              { label: "Sessions", value: "128" },
              { label: "Resolved", value: "94%" },
              { label: "Earnings",  value: "₹18k" },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl py-2.5 text-center">
                <div className="text-base font-bold text-slate-800">{s.value}</div>
                <div className="text-[11px] text-slate-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Requests Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Incoming Requests</h3>
            <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {requests.filter(r => r.state === "pending").length} pending
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {requests.map(req => (
              <div key={req.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${req.color}`}>
                  {req.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{req.name}</p>
                  <p className="text-xs text-slate-400 truncate">{req.task}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {req.state === "pending" ? (
                    <>
                      <button
                        onClick={() => handleAction(req.id, "accepted")}
                        className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "declined")}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        Decline
                      </button>
                     
                    </>
                  ) : (
                    <span className={`text-[11px] font-bold px-3 py-1.5 rounded-lg ${req.state === "accepted" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                      {req.state === "accepted" ? "✓ Accepted" : "✕ Declined"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {visibleCount < allRequests.length && (
            <div className="border-t border-slate-100 px-5 py-3">
              <button
                onClick={handleLoadMore}
                className="w-full text-xs font-semibold text-slate-400 hover:text-indigo-500 transition-colors py-1"
              >
                Load More ↓
              </button>
            </div>
          )}
        </div>

       

      </div>
    </div>
  );
}