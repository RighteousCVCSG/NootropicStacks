import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { LogOut, Users, Mail, MousePointer, BarChart2, ShieldCheck } from 'lucide-react';

async function apiAdmin(path, options = {}) {
  const res = await fetch(path, { credentials: 'include', ...options });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = {
    blue: 'bg-primary-050 text-primary-700 border-primary-100',
    green: 'bg-accent-050 text-accent-700 border-accent-100',
    purple: 'bg-primary-050 text-primary-700 border-primary-300',
    orange: 'bg-warn-100 text-warn-700 border-warn-100',
  };
  return (
    <div className={`rounded-md border p-5 flex items-center gap-4 ${colors[color]}`}>
      <div className="rounded-md bg-white/70 p-2.5 shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold">{value ?? '—'}</p>
        <p className="text-xs font-medium opacity-75">{label}</p>
      </div>
    </div>
  );
}

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function AdminPage() {
  const [authed, setAuthed] = useState(null); // null=checking, false=logged out, true=in
  const [secret, setSecret] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [tab, setTab] = useState('leads');

  useEffect(() => {
    apiAdmin('/api/admin/me')
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    apiAdmin('/api/admin/stats').then(setStats).catch(console.error);
    apiAdmin('/api/admin/leads').then(d => setLeads(d.leads)).catch(console.error);
    apiAdmin('/api/admin/users').then(d => setUsers(d.users)).catch(console.error);
    apiAdmin('/api/admin/clicks').then(d => setClicks(d.clicks)).catch(console.error);
  }, [authed]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginErr('');
    try {
      await apiAdmin('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });
      setAuthed(true);
    } catch (err) {
      setLoginErr(err.message);
    }
  }

  async function handleLogout() {
    await apiAdmin('/api/admin/logout', { method: 'POST' }).catch(() => {});
    setAuthed(false);
    setSecret('');
  }

  if (authed === null) {
    return <div className="flex justify-center py-20 text-ink-400 text-sm">Checking session…</div>;
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto mt-20">
        <div className="rounded-md border border-ink-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-md bg-ink-900 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-ink-900">Admin Access</h1>
              <p className="text-xs text-ink-500">NootropicStacker dashboard</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ink-700 mb-1.5 block">Admin Secret</label>
              <Input
                type="password"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                placeholder="Enter admin secret"
                autoFocus
              />
            </div>
            {loginErr && <p className="text-xs text-danger-500">{loginErr}</p>}
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-ink-700" />
          <h1 className="text-xl font-semibold text-ink-900">Admin Dashboard</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-1.5" />
          Sign out
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Mail} label="Newsletter Leads" value={stats.subscribers} color="blue" />
          <StatCard icon={Users} label="Registered Users" value={stats.users} color="green" />
          <StatCard icon={MousePointer} label="Affiliate Clicks" value={stats.clicks} color="purple" />
          <StatCard icon={BarChart2} label="Contact Messages" value={stats.messages} color="orange" />
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="clicks">Affiliate Clicks ({clicks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <div className="rounded-md border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-card text-xs text-ink-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Source</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {leads.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-4 text-center text-ink-400">No subscribers yet</td></tr>
                )}
                {leads.map(l => (
                  <tr key={l.id} className="hover:bg-surface-card">
                    <td className="px-4 py-2.5 font-medium">{l.email}</td>
                    <td className="px-4 py-2.5 text-ink-500">{l.source}</td>
                    <td className="px-4 py-2.5 text-ink-400">{fmt(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="rounded-md border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-card text-xs text-ink-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Premium</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {users.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-4 text-center text-ink-400">No users yet</td></tr>
                )}
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-surface-card">
                    <td className="px-4 py-2.5 font-medium">{u.email}</td>
                    <td className="px-4 py-2.5 text-ink-500">{u.name || '—'}</td>
                    <td className="px-4 py-2.5">{u.is_premium ? <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full">Yes</span> : '—'}</td>
                    <td className="px-4 py-2.5 text-ink-400">{fmt(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="clicks">
          <div className="rounded-md border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-card text-xs text-ink-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Supplement</th>
                  <th className="px-4 py-3 text-left">Vendor</th>
                  <th className="px-4 py-3 text-left">Page</th>
                  <th className="px-4 py-3 text-right">Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {clicks.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-4 text-center text-ink-400">No clicks recorded yet</td></tr>
                )}
                {clicks.map((c, i) => (
                  <tr key={i} className="hover:bg-surface-card">
                    <td className="px-4 py-2.5 font-medium">{c.supplement_id}</td>
                    <td className="px-4 py-2.5 text-ink-500">{c.vendor}</td>
                    <td className="px-4 py-2.5 text-ink-500">{c.page}</td>
                    <td className="px-4 py-2.5 text-right font-semibold">{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
