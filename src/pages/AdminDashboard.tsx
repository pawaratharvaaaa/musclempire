import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { fetchSubmissions, deleteRecord, type AssessmentData } from "@/lib/sheets";
import { Search, RefreshCw, Users, Clock, CheckCircle2, AlertCircle, LogOut, Trash2, Activity, Image as ImageIcon, Tag } from "lucide-react";
import { motion } from "framer-motion";
import AdminGuard from "@/components/AdminGuard";
import { logout } from "@/lib/adminAuth";
import { setSelectedAssessment } from "@/lib/adminStore";

function formatDate(raw: string | undefined): string {
  if (!raw) return "--";
  const s = String(raw).trim();
  if (!s || s === "undefined") return "--";
  // Handle Excel/Sheets serial date numbers
  if (/^\d+(\.\d+)?$/.test(s)) {
    const num = Number(s);
    if (num <= 1) return "--"; // 0 or 1 = empty/epoch in Sheets
    try {
      const d = new Date(Math.round((num - 25569) * 86400 * 1000));
      if (!isNaN(d.getTime()) && d.getFullYear() > 1970) {
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
      }
    } catch {}
  }
  // Catch the 1899 date specifically
  if (s.includes("1899") || s.includes("1900")) return "--";
  // Already clean format like "25/6/2026" or "11 Aug 2026"
  if (!s.includes("GMT") && !s.includes("00:00:00") && s.length < 20) return s;
  try {
    const d = new Date(s);
    if (!isNaN(d.getTime()) && d.getFullYear() > 1970) {
      return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
  } catch {}
  return "--";
}

function StatusBadge({ status }: { status: string }) {
  // Guard against JSON/object being passed as status
  const raw = String(status || "New").trim();
  const s = raw.startsWith("[") || raw.startsWith("{") || raw.length > 30 ? "New" : raw;
  const colors: Record<string, string> = {
    New: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
    "In Progress": "bg-blue-400/15 text-blue-400 border-blue-400/30",
    Completed: "bg-green-400/15 text-green-400 border-green-400/30",
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider border rounded-full ${colors[s] || "bg-white/10 text-white border-white/20"}`}>
      {s}
    </span>
  );
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [data, setData] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterFood, setFilterFood] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ arrayIndex: number; rowIndex: number } | null>(null);

  const load = async (force = false) => {
    setLoading(true);
    const items = await fetchSubmissions(force);
    const fixed = items.map(row => {
      // Detect shifted row: foodPref contains a date string (cols shifted by 2 due to duty/restTime added later)
      const foodPrefVal = String(row.foodPref || "");
      const isShifted = foodPrefVal.includes("GMT") || foodPrefVal.includes("1899") || foodPrefVal.match(/^\d{2}:\d{2}/) !== null;
      if (isShifted) {
        // Remap: cols 15-16 (duty/restTime) were inserted, shifting everything after
        return {
          ...row,
          duty: "",
          restTime: "",
          targetWeight: String(row.targetWeight || ""),   // was foodPref → now targetWeight (off by 2)
          weightChange: String(row.weightChange || ""),
          foodPref: String(row.targetWeight || ""),       // foodPref is actually in targetWeight slot
          collegeTime: String(row.weightChange || ""),
          workTime: String(row.foodPref || ""),           // skip date value
          medicalConditions: String(row.collegeTime || ""),
          allergies: String(row.workTime || ""),
          supplements: String(row.medicalConditions || ""),
          goals: String(row.allergies || ""),
          remarks: String(row.supplements || ""),
          status: String(row.goals || "New"),             // actual status is in goals slot
          foodHistory: String(row.remarks || ""),         // food history is in remarks slot
          earlyMorning: String(row.status || ""),         // meal plan data shifted into status
        };
      }
      return row;
    });
    setData(fixed);
    setLoading(false);
  };

  useEffect(() => { 
    // Clear stale cache on mount to force fresh fetch with new token
    localStorage.removeItem("me_assessments_ts");
    load(true); 
  }, []);
  const handleRefresh = () => load(true);

  const filtered = data
    .map((d, i) => ({ ...d, _arrayIndex: i }))
    .filter((d) => {
      const s = search.toLowerCase().trim();
      const name = String(d.name || "").toLowerCase();
      const phone = String(d.phone || "");
      const matchSearch = !s || name.includes(s) || phone.includes(s);
      const matchFood = !filterFood || d.foodPref === filterFood;
      const matchStatus = !filterStatus || d.status === filterStatus;
      return matchSearch && matchFood && matchStatus;
    });

  const counts = {
    total: data.length,
    new: data.filter((d) => d.status === "New").length,
    inProgress: data.filter((d) => d.status === "In Progress").length,
    completed: data.filter((d) => d.status === "Completed").length,
  };

  const handleDelete = async (arrayIndex: number, rowIndex: number) => {
    // Always reload fresh from Sheets first to get accurate row indices
    const freshData = await fetchSubmissions(true);
    setData(freshData);
    // Find the matching row by arrayIndex in fresh data
    const target = freshData[arrayIndex];
    const accurateRowIndex = target?._rowIndex ?? rowIndex;
    await deleteRecord(accurateRowIndex);
    setData((prev) => {
      const next = [...prev];
      next.splice(arrayIndex, 1);
      return next;
    });
    setConfirmDelete(null);
    setTimeout(() => load(true), 800);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0d1117] text-white">
        {confirmDelete !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-[#161b22] border border-white/20 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
              <h2 className="text-white font-black text-lg mb-2">Delete Assessment?</h2>
              <p className="text-white/50 text-sm mb-6">This will permanently remove this assessment.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(confirmDelete.arrayIndex, confirmDelete.rowIndex)}
                  className="flex-1 bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-wider py-2.5 rounded-xl text-sm transition-colors">
                  Yes, Delete
                </button>
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider py-2.5 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#161b22] border-b border-white/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider text-green-400">Muscle Empire</h1>
            <p className="text-xs text-white/40 uppercase tracking-widest">Nutrition Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => navigate("/sagarkharat/gallery")}
              className="flex items-center gap-1.5 text-white/50 hover:text-green-400 text-xs transition-colors cursor-pointer">
              <ImageIcon size={13} /> Gallery
            </button>
            <button onClick={() => navigate("/sagarkharat/offers")}
              className="flex items-center gap-1.5 text-white/50 hover:text-green-400 text-xs transition-colors cursor-pointer">
              <Tag size={13} /> Offers
            </button>
            <button onClick={handleRefresh} className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors">
              <RefreshCw size={13} /> Refresh
            </button>
            <button onClick={() => { logout(); navigate("/sagarkharat"); }}
              className="flex items-center gap-1.5 text-red-400/60 hover:text-red-400 text-xs transition-colors">
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total", value: counts.total, icon: Users, color: "text-white" },
              { label: "New", value: counts.new, icon: AlertCircle, color: "text-yellow-400" },
              { label: "In Progress", value: counts.inProgress, icon: Clock, color: "text-blue-400" },
              { label: "Completed", value: counts.completed, icon: CheckCircle2, color: "text-green-400" },
            ].map((s) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#161b22] border border-white/10 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/40 uppercase tracking-widest">{s.label}</span>
                  <s.icon size={16} className={s.color} />
                </div>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-[#161b22] border border-white/10 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
              <Search size={14} className="text-white/40" />
              <input type="text" placeholder="Search by name or phone..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder:text-white/25" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#161b22] border border-white/10 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-green-400">
              <option value="">All Status</option>
              {["New", "In Progress", "Completed"].map((o) => <option key={o}>{o}</option>)}
            </select>
            <select value={filterFood} onChange={(e) => setFilterFood(e.target.value)}
              className="bg-[#161b22] border border-white/10 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-green-400">
              <option value="">All Food</option>
              {["Vegetarian", "Non-Vegetarian", "Eggitarian"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20 text-white/40">Loading assessments...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-white/40">No submissions found.</div>
          ) : (
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#1c2128]">
                      {["Customer Name", "Mobile", "Date", "BMI", "Goal", "Food Pref", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/40">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, idx) => (
                      <tr key={`${row._arrayIndex}-${idx}`}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedAssessment(row);
                          navigate(`/sagarkharat/customer/${row._rowIndex ?? row._arrayIndex}`);
                        }}>                        <td className="px-4 py-3 font-bold text-white">{row.name}</td>
                        <td className="px-4 py-3 text-white/60">{row.phone}</td>
                        <td className="px-4 py-3 text-white/60">{formatDate(row.date)}</td>
                        <td className="px-4 py-3 text-white/60">{row.bmi}</td>
                        <td className="px-4 py-3 text-white/60 max-w-[150px] truncate">{row.goals}</td>
                        <td className="px-4 py-3 text-white/60">{row.foodPref}</td>
                        <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => {
                              setSelectedAssessment(row);
                              navigate(`/sagarkharat/customer/${row._rowIndex ?? row._arrayIndex}`);
                            }}
                              className="text-green-400 hover:text-green-300 text-xs font-bold uppercase tracking-wider transition-colors">
                              Open
                            </button>
                            <button onClick={() => navigate(`/sagarkharat/track/${row.phone}`)}
                              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-wider transition-colors">
                              <Activity size={13} /> Track
                            </button>
                            <button onClick={() => setConfirmDelete({ arrayIndex: row._arrayIndex, rowIndex: row._rowIndex ?? row._arrayIndex })}
                              className="text-red-400/60 hover:text-red-400 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
