import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // User management states
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    if (showUsers) {
      loadUsers();
    }
  }, [showUsers]);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Load users error:', err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserError('');
    setUserLoading(true);

    try {
      await api.post('/users', newUser);
      setNewUser({ name: '', email: '', password: '', role: 'MEMBER' });
      loadUsers(); // Refresh list
    } catch (err) {
      setUserError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setUserLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Total tasks">
          <p className="text-4xl font-semibold text-slate-900">{stats?.totalTasks ?? 0}</p>
        </Card>
        <Card title="Overdue tasks">
          <p className="text-4xl font-semibold text-slate-900">{stats?.overdueTasks ?? 0}</p>
        </Card>
        <Card title="Status breakdown">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>TODO</span>
              <span>{stats?.statusCounts?.TODO ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>In progress</span>
              <span>{stats?.statusCounts?.IN_PROGRESS ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Done</span>
              <span>{stats?.statusCounts?.DONE ?? 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {error && (
        <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {isAdmin() && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Admin Quick Actions">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/projects"
                  className="rounded-2xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  + New Project
                </Link>
                <Link
                  to="/tasks"
                  className="rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  + New Task
                </Link>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setShowUsers(!showUsers)}
                  className="w-full rounded-2xl bg-purple-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  {showUsers ? 'Hide Users' : 'Manage Users'}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Manage teams, projects, and users.
              </p>
            </Card>

            <Card title="Admin Overview">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Active Users</span>
                  <span className="font-semibold text-slate-900">{users.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Projects</span>
                  <span className="font-semibold text-slate-900">{stats?.totalProjects ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-600">
                  <span>System Health</span>
                  <span className="font-semibold">✓ Healthy</span>
                </div>
              </div>
            </Card>
          </div>

          {showUsers && (
            <Card title="Create New User & Manage Users (Admin Only)">
              <form className="space-y-4 mb-6" onSubmit={handleCreateUser}>
                <div className="grid gap-4 lg:grid-cols-2">
                  <input
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                  />
                  <input
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                <input
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                  minLength={6}
                />
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {userError && (
                  <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{userError}</div>
                )}
                <button
                  type="submit"
                  disabled={userLoading}
                  className="w-full rounded-2xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {userLoading ? 'Creating User...' : 'Create New User'}
                </button>
              </form>

              <div>
                <h3 className="mb-4 font-semibold text-slate-900">All Users ({users.length})</h3>
                {users.length === 0 ? (
                  <p className="text-sm text-slate-500">No users found.</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {users.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium text-slate-900">{u.name}</div>
                          <div className="truncate text-sm text-slate-600">{u.email}</div>
                        </div>
                        <span className={`ml-4 flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          u.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </>
      )}

      <Card title="Quick Summary">
        <p className="text-slate-600 leading-relaxed">
          {isAdmin() ? (
            <>
              Welcome, Admin! Full access to create projects, manage tasks, and control users. 
              Use the admin tools above to get started with your team.
            </>
          ) : (
            <>
              Welcome back! Quick view of your tasks and progress. 
              Check Projects and Tasks for your work items and team updates.
            </>
          )}
        </p>
      </Card>
    </div>
  );
};

export default Dashboard;

