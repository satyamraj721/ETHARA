import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-bold shadow-md">TT</div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Team Task Manager</h1>
            <p className="text-sm text-slate-500">Manage projects, tasks, and teams.</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-3">
          <NavLink className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100" to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100" to="/projects">
            Projects
          </NavLink>
          <NavLink className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100" to="/tasks">
            Tasks
          </NavLink>
          <button onClick={handleLogout} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
