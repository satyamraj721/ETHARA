import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const response = await api.post('/auth/login', { email, password });
      onLogin(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg py-12">
      <Card>
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mb-6 text-slate-600">Log in to manage your team tasks and projects.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            />
          </div>
          {error && <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <button
            type="submit"
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
