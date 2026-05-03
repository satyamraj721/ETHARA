import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

const statusOptions = ['TODO', 'IN_PROGRESS', 'DONE'];
const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [saving, setSaving] = useState(false);
  const [assignInputs, setAssignInputs] = useState({});

  const selectedProject = useMemo(
    () => projects.find((project) => String(project.id) === String(projectId)),
    [projects, projectId]
  );

  const noProjects = !loading && projects.length === 0;
  const canCreateProject = user?.role === 'ADMIN';
  const [selectedProjectMembers, setSelectedProjectMembers] = useState([]);
  const canCreateTask = Boolean(projectId && selectedProjectMembers.length > 0);

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
      setProjectId(response.data?.[0]?.id ? String(response.data[0].id) : '');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load projects.');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Unable to load users', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadProjects(), loadUsers()]);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedProject) {
      // Check if current user is member/owner of selected project
      const isProjectMember = selectedProject.creator?.id === user?.id || 
        selectedProject.members?.some(m => m.userId === user?.id);
      setSelectedProjectMembers(selectedProject.members || []);
      // canCreateTask now uses projectId && selectedProjectMembers.length > 0,
      // but since members loaded from projects, it's always true if project selected
      // Actual check: project membership via backend controller
    }
  }, [selectedProject, user]);

  const fetchTasks = async (projectIdValue) => {
    setLoading(true);
    try {
      const response = await api.get(`/tasks/project/${projectIdValue}`);
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  const groupedTasks = useMemo(
    () => ({
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
      ...tasks.reduce((acc, task) => {
        acc[task.status] = [...(acc[task.status] || []), task];
        return acc;
      }, {}),
    }),
    [tasks]
  );

  const handleCreateTask = async (event) => {
    event.preventDefault();

    if (!projectId) {
      setError('Please select a project before creating a task.');
      return;
    }

    const numericProjectId = Number(projectId);
    if (!Number.isInteger(numericProjectId) || numericProjectId <= 0) {
      setError('Please select a valid project.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/tasks', {
        title,
        description,
        status,
        priority,
        ...(dueDate ? { dueDate } : {}),
        ...(assignedTo ? { assignedTo } : {}),
        projectId: numericProjectId,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignedTo('');
      await fetchTasks(projectId);
      setError('');
    } catch (err) {
      const response = err.response?.data;
      if (response?.errors) {
        setError(response.errors.map((error) => error.msg).join(' | '));
      } else {
        setError(response?.error || 'Unable to create task.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const response = await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks((prev) => prev.map((task) => (task.id === taskId ? response.data : task)));
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to update status.');
    }
  };

  const handleAssign = async (taskId) => {
    const assignee = assignInputs[taskId] || '';
    if (!assignee) {
      setError('Enter a user ID to assign.');
      return;
    }
    try {
      const response = await api.put(`/tasks/${taskId}/assign`, { assignedTo: assignee });
      setTasks((prev) => prev.map((task) => (task.id === taskId ? response.data : task)));
      setAssignInputs((prev) => ({ ...prev, [taskId]: '' }));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to assign task.');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <Card title="Task management">
        <p className="text-slate-600">Create tasks, assign team members, and keep work moving in a kanban-style view.</p>
      </Card>

      {error && <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {noProjects && (
        <Card title="No projects available">
          <p className="text-slate-600">You don't have access to any projects yet.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {canCreateProject ? (
              <Link
                to="/projects"
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Create a project
              </Link>
            ) : (
              <Link
                to="/projects"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Request a project from admin
              </Link>
            )}
          </div>
        </Card>
      )}

      <Card title="Create task">
        {!canCreateTask ? (
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
            <p>Only admins can create tasks.</p>
            <p>If you need a task created, ask your project admin.</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleCreateTask}>
          <div className="grid gap-4 lg:grid-cols-2">
            <input
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="relative z-50">
              <select
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="relative z-50">
              <select
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="relative z-50">
              <select
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                disabled={noProjects}
              >
        <option value="">{noProjects ? 'No projects available' : 'Select project'}</option>
        {projects.map((project) => {
          const isMember = project.creator?.id === user?.id || 
            project.members?.some(m => m.userId === user?.id);
          return isMember ? (
            <option key={project.id} value={String(project.id)}>{project.name}</option>
          ) : null;
        })}
              </select>
            </div>
          </div>
          <textarea
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <input
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <div className="relative z-50">
              <select
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Unassigned</option>
                {selectedProject?.creator && (
                  <option value={String(selectedProject.creator.id)}>
                    {selectedProject.creator.name} (Owner)
                  </option>
                )}
                {selectedProject?.members?.map((member) => (
                  <option key={member.id} value={String(member.user.id)}>
                    {member.user.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="rounded-2xl bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={saving || noProjects || !projectId}
          >
            {saving ? 'Saving...' : 'Create task'}
          </button>
        </form>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {statusOptions.map((statusKey) => (
          <Card key={statusKey} title={statusKey.replace('_', ' ')}>
            <div className="space-y-4">
              {groupedTasks[statusKey]?.length ? (
                groupedTasks[statusKey].map((task) => (
                  <div key={task.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{task.description || 'No description'}</p>
                      </div>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-2 text-sm text-slate-600">
                      <span className="rounded-full bg-white px-3 py-1">Project {task.projectId}</span>
                      <span className="rounded-full bg-white px-3 py-1">Priority {task.priority}</span>
                      <span className="rounded-full bg-white px-3 py-1">Assigned {task.assignee?.name || 'Unassigned'}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="relative z-50">
                        <select
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 disabled:cursor-not-allowed disabled:bg-slate-100"
                          value={task.status}
                          disabled={
                            user?.role !== 'ADMIN' &&
                            String(task.assignedTo ?? task.assignee?.id) !== String(user?.id)
                          }
                          onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      {user?.role === 'ADMIN' ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="relative z-50">
                            <select
                              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                              value={assignInputs[task.id] || ''}
                              onChange={(e) => setAssignInputs((prev) => ({ ...prev, [task.id]: e.target.value }))}
                            >
                              <option value="">Select assignee</option>
                              {selectedProject?.creator && (
                                <option value={String(selectedProject.creator.id)}>
                                  {selectedProject.creator.name} (Owner)
                                </option>
                              )}
                              {selectedProject?.members?.map((member) => (
                                <option key={member.id} value={String(member.user.id)}>
                                  {member.user.name} ({member.role})
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="button"
                            className="rounded-2xl bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700"
                            onClick={() => handleAssign(task.id)}
                          >
                            Assign
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">Only admins can assign tasks.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No tasks in this column.</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
