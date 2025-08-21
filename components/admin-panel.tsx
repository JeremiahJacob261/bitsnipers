"use client";
import React, { useMemo, useState, useEffect } from "react";
import "@/styles/bitsnipers.css";

// Simple inline icons (matching style from bitsnipers-game)
const IconUsers = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconGame = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 12h4M8 10v4M15 10v.01M18 13v.01" />
  </svg>
);
const IconDollar = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M12 2v20" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IconSettings = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.7 0 1.31-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.46.46 1.12.61 1.82.33H10a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .7.4 1.31 1 1.51.7.28 1.36.13 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.46.46-.61 1.12-.33 1.82V10c.9 0 1.65.75 1.65 1.65S20.3 15 19.4 15Z" />
  </svg>
);
const IconSearch = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

// Live data shapes
interface UserRow { email: string; username: string | null; status: string; last_login: string | null; created_at: string; }
interface GameRow { id: number; created_at: string; closed_at: string | null; status: string; buy_in_usd_cents: number; pot_usd_cents: number; rake_usd_cents: number; winner_email: string | null; }
interface TxnRow { id: number; created_at: string; user_email: string; type: string; amount_usd_cents: number; status: string; reference: string | null; }
interface Overview { users: number; activeUsers: number; totalBalanceUsd: number; todayGames: number; revenueUsd: number; }

const fmtCurrency = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString();

// Component
export default function AdminPanel() {
  const [tab, setTab] = useState<"overview" | "users" | "games" | "transactions" | "settings">("overview");
  const [userSearch, setUserSearch] = useState("");
  const [txnFilter, setTxnFilter] = useState<"all" | "deposit" | "withdrawal" | "payout">("all");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [games, setGames] = useState<GameRow[]>([]);
  const [txns, setTxns] = useState<TxnRow[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOverview = async () => { const r = await fetch('/api/admin/overview'); if (r.ok) setOverview(await r.json()); };
  const fetchUsers = async () => { const r = await fetch('/api/admin/users'); if (r.ok) { const j = await r.json(); setUsers(j.users||[]); } };
  const fetchGames = async () => { const r = await fetch('/api/admin/games'); if (r.ok) { const j = await r.json(); setGames(j.games||[]); } };
  const fetchTxns = async () => { const r = await fetch('/api/admin/transactions'); if (r.ok) { const j = await r.json(); setTxns(j.transactions||[]); } };
  const refreshAll = async () => { setLoading(true); await Promise.all([fetchOverview(), fetchUsers(), fetchGames(), fetchTxns()]); setLoading(false); };
  useEffect(() => { refreshAll(); }, []);

  const filteredUsers = useMemo(() => users.filter(u => {
    const q = userSearch.toLowerCase();
    return !q || (u.username||'').toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  }), [userSearch, users]);
  const filteredTxns = useMemo(() => txns.filter(t => txnFilter === 'all' || t.type === txnFilter), [txns, txnFilter]);

  const banUnban = async (email: string, action: 'ban'|'unban') => {
    setActionLoading(email+action);
    await fetch('/api/admin/users', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, action })});
    await fetchUsers();
    setActionLoading(null);
  };
  const approveRejectTxn = async (id: number, action: 'approve'|'reject') => {
    setActionLoading('txn'+id+action);
    await fetch('/api/admin/transactions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, action })});
    await fetchTxns();
    setActionLoading(null);
  };

  return (
    <div className="hexagon-bg min-h-screen text-white bg-neutral-900 p-4">
      <style jsx>{`
        .admin-badge { font-size: 10px; background: linear-gradient(135deg,#3b82f6,#1d4ed8); padding:2px 6px; border-radius:4px; text-transform:uppercase; letter-spacing:.5px; }
        .status-chip { padding:2px 6px; font-size:10px; border-radius:6px; font-weight:600; text-transform:uppercase; letter-spacing:.5px; }
        .status-active { background:#064e3b; color:#10b981; }
        .status-banned { background:#581c1c; color:#f87171; }
        .status-open { background:#1e3a8a; color:#60a5fa; }
        .status-in-progress { background:#78350f; color:#fbbf24; }
        .status-closed { background:#374151; color:#d1d5db; }
        .status-deposit { background:#065f46; color:#34d399; }
        .status-withdrawal { background:#4b5563; color:#f9fafb; }
        .status-payout { background:#1e3a8a; color:#93c5fd; }
        .status-pending { background:#422006; color:#fbbf24; }
        .status-completed { background:#064e3b; color:#10b981; }
        .status-failed { background:#581c1c; color:#f87171; }
        .table-scroll { scrollbar-width: thin; scrollbar-color: #4b5563 transparent; }
        .table-scroll::-webkit-scrollbar { height: 8px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background:#4b5563; border-radius:4px; }
      `}</style>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <img src="/images/icon.png" alt="logo" className="h-16" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">BitSnipers</h1>
            </div>
        </div>
        <div className="flex gap-2">
          {(["overview","users","games","transactions","settings"] as const).map(t => (
            <button key={t} className={`${tab===t ? "admin-taby" : "admin-tabx"}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === "overview" && overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="panel rounded-xl p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-300 text-xs"><IconUsers className="w-4 h-4" /> Users</div>
            <div className="text-3xl font-bold">{overview.users}</div>
            <div className="text-xs text-green-400">{overview.activeUsers} active</div>
          </div>
          <div className="panel rounded-xl p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-300 text-xs"><IconGame className="w-4 h-4" /> Games Today</div>
            <div className="text-3xl font-bold">{overview.todayGames}</div>
            <div className="text-xs text-neutral-400">Snapshot</div>
          </div>
          <div className="panel rounded-xl p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-300 text-xs"><IconDollar className="w-4 h-4" /> Total User Balance</div>
            <div className="text-3xl font-bold text-green-400">{fmtCurrency(overview.totalBalanceUsd)}</div>
            <div className="text-xs text-neutral-400">Across wallets</div>
          </div>
            <div className="panel rounded-xl p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-300 text-xs"><IconDollar className="w-4 h-4" /> Revenue Today</div>
            <div className="text-3xl font-bold">{fmtCurrency(overview.revenueUsd)}</div>
            <div className="text-xs text-neutral-400">From rake</div>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="panel rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><IconUsers className="w-5 h-5" /> Users</h2>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Search" className="bg-neutral-800 border border-neutral-600 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
              </div>
              <button onClick={refreshAll} className="game-btn !m-0 px-5" id="submit-btn" disabled={loading}>{loading? '...' : 'Refresh'}</button>
            </div>
          </div>
          <div className="overflow-auto table-scroll">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="text-left text-neutral-400">
                <tr className="border-b border-neutral-700/70">
                  <th className="py-2 font-medium">User</th>
                  <th className="py-2 font-medium">Email</th>
                  <th className="py-2 font-medium">Last Login</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.email} className="border-b border-neutral-800/60 hover:bg-neutral-800/40">
                    <td className="py-2 font-medium">{u.username || u.email.split('@')[0]}</td>
                    <td className="py-2 text-neutral-300">{u.email}</td>
                    <td className="py-2 text-neutral-400">{u.last_login ? fmtTime(u.last_login) : '—'}</td>
                    <td className="py-2"><span className={`status-chip status-${u.status}`}>{u.status}</span></td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button onClick={()=>banUnban(u.email,'ban')} className="btn-secondary px-3 py-1 rounded text-xs" disabled={u.status!=="active" || actionLoading===u.email+'ban'}>{actionLoading===u.email+'ban'? '...' : 'Ban'}</button>
                        <button onClick={()=>banUnban(u.email,'unban')} className="btn-secondary px-3 py-1 rounded text-xs" disabled={u.status==="active" || actionLoading===u.email+'unban'}>{actionLoading===u.email+'unban'? '...' : 'Unban'}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && <p className="text-xs text-neutral-500 mt-4">No users match.</p>}
        </div>
      )}

      {tab === "games" && (
        <div className="panel rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><IconGame className="w-5 h-5" /> Games</h2>
            <button onClick={fetchGames} className="game-btn !m-0 px-6" id="grey-btn" disabled={loading}>Reload</button>
          </div>
          <div className="overflow-auto table-scroll">
            <table className="w-full text-sm min-w-[840px]">
              <thead className="text-left text-neutral-400">
                <tr className="border-b border-neutral-700/70">
                  <th className="py-2 font-medium">ID</th>
                  <th className="py-2 font-medium">Created</th>
                  <th className="py-2 font-medium">Buy-In</th>
                  <th className="py-2 font-medium">Pot</th>
                  <th className="py-2 font-medium">Winner</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map(g => (
                  <tr key={g.id} className="border-b border-neutral-800/60 hover:bg-neutral-800/40">
                    <td className="py-2 font-medium">{g.id}</td>
                    <td className="py-2 text-neutral-400">{fmtTime(g.created_at)}</td>
                    <td className="py-2">{fmtCurrency(g.buy_in_usd_cents/100)}</td>
                    <td className="py-2 text-green-400 font-medium">{fmtCurrency(g.pot_usd_cents/100)}</td>
                    <td className="py-2">{g.winner_email || '—'}</td>
                    <td className="py-2"><span className={`status-chip status-${g.status}`}>{g.status}</span></td>
                    <td className="py-2"><div className="flex gap-2"><button className="btn-secondary px-3 py-1 rounded text-xs" disabled>Close</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "transactions" && (
        <div className="panel rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><IconDollar className="w-5 h-5" /> Transactions</h2>
            <div className="flex gap-2 items-center">
              {(["all","deposit","withdrawal","payout"] as const).map(f => (
                <button key={f} onClick={()=>setTxnFilter(f)} className={`px-3 py-1 rounded-md text-xs font-medium ${txnFilter===f?"bg-orange-500 text-black":"bg-neutral-800 hover:bg-neutral-700"}`}>{f}</button>
              ))}
              <button onClick={fetchTxns} className="game-btn !m-0 px-5" id="submit-btn" disabled={loading}>Reload</button>
            </div>
          </div>
          <div className="overflow-auto table-scroll">
            <table className="w-full text-sm min-w-[880px]">
              <thead className="text-left text-neutral-400">
                <tr className="border-b border-neutral-700/70">
                  <th className="py-2 font-medium">ID</th>
                  <th className="py-2 font-medium">User</th>
                  <th className="py-2 font-medium">Type</th>
                  <th className="py-2 font-medium">Amount</th>
                  <th className="py-2 font-medium">Reference</th>
                  <th className="py-2 font-medium">Time</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map(t => (
                  <tr key={t.id} className="border-b border-neutral-800/60 hover:bg-neutral-800/40">
                    <td className="py-2 font-medium">{t.id}</td>
                    <td className="py-2">{t.user_email}</td>
                    <td className="py-2"><span className={`status-chip status-${t.type}`}>{t.type}</span></td>
                    <td className="py-2 text-green-400 font-medium">{fmtCurrency(t.amount_usd_cents/100)}</td>
                    <td className="py-2 text-neutral-400">{t.reference || '—'}</td>
                    <td className="py-2 text-neutral-400">{fmtTime(t.created_at)}</td>
                    <td className="py-2"><span className={`status-chip status-${t.status}`}>{t.status}</span></td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button onClick={()=>approveRejectTxn(t.id,'approve')} className="btn-secondary px-3 py-1 rounded text-xs" disabled={t.status!=="pending" || actionLoading==='txn'+t.id+'approve'}>{actionLoading==='txn'+t.id+'approve'? '...' : 'Approve'}</button>
                        <button onClick={()=>approveRejectTxn(t.id,'reject')} className="btn-secondary px-3 py-1 rounded text-xs" disabled={t.status!=="pending" || actionLoading==='txn'+t.id+'reject'}>{actionLoading==='txn'+t.id+'reject'? '...' : 'Reject'}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="panel rounded-xl p-6 max-w-4xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><IconSettings className="w-5 h-5" /> Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-2">Rake Percentage</p>
              <div className="flex gap-2">
                <input type="number" value={10} readOnly className="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 w-full" />
                <button className="game-btn !m-0 px-6" id="submit-btn" disabled>Save</button>
              </div>
              <p className="text-xs text-neutral-400 mt-2">Demo mode – values are read-only.</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Maintenance Mode</p>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded-md">OFF</span>
                <button className="btn-secondary px-3 py-2 rounded-lg" disabled>Toggle</button>
              </div>
              <p className="text-xs text-neutral-400 mt-2">Coming soon.</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Support Email</p>
              <input value="support@example.com" readOnly className="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Danger Zone</p>
              <button className="game-btn !m-0 px-6" id="cashout" disabled>Reset Demo Data</button>
              <p className="text-xs text-neutral-500 mt-2">Disabled in demo.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
