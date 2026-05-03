import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';

const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/signup', { name, email, password, role });
      onSignup(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg py-12">
      <Card>
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Create your account</h1>
        <p className="mb-6 text-slate-600">Sign up and start managing your team tasks in one place.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
            <select
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {error && <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <button
            type="submit"
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
