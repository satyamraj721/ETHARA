import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberForms, setMemberForms] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/projects', { name, description });
      setName('');
      setDescription('');
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMember = async (projectId) => {
    const form = memberForms[projectId] || {};
    if (!form.userEmail) {
      setError('Member email is required.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/projects/${projectId}/members`, {
        userEmail: form.userEmail,
        role: form.role || 'MEMBER',
      });
      setMemberForms((prev) => ({ ...prev, [projectId]: { userEmail: '', role: 'MEMBER' } }));
      await fetchProjects();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to add member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMemberChange = (projectId, field, value) => {
    setMemberForms((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value,
      },
    }));
  };

  const projectCards = useMemo(
    () =>
      projects.map((project) => {
        const canManageMembers = user?.role === 'ADMIN' || project.creator?.id === user?.id;

        return (
          <Card key={project.id}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{project.name}</h2>
                <p className="text-sm text-slate-500">{project.description || 'No description'}</p>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">{project.members.length + 1} members</span>
            </div>
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Creator</p>
                <p className="text-sm text-slate-600">{project.creator?.name}</p>
                <p className="text-sm text-slate-500">{project.creator?.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Members</p>
                <div className="space-y-2">
                  {project.members.length ? (
                    project.members.map((member) => (
                      <div key={member.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        {member.user.name} • {member.role}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No members added yet.</p>
                  )}
                </div>
              </div>
            </div>
            {canManageMembers ? (
              <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                    placeholder="Member email (e.g. admin@example.com)"
                    value={memberForms[project.id]?.userEmail || ''}
                    onChange={(e) => handleMemberChange(project.id, 'userEmail', e.target.value)}
                  />
                  <div className="relative z-50">
                    <select
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                      value={memberForms[project.id]?.role || 'MEMBER'}
                      onChange={(e) => handleMemberChange(project.id, 'role', e.target.value)}
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                <button
                  className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700"
                  disabled={submitting}
                  onClick={() => handleAddMember(project.id)}
                >
                  Add member
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Only project owners and admins can add members.
              </div>
            )}
          </Card>
        );
      }),
    [projects, memberForms, submitting, user]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Projects">
          <p className="text-slate-600">Manage projects, review members, and add contributors from the team.</p>
        </Card>
        <Card title="Your role">
          <p className="text-slate-600">{user?.role || 'Unknown'}</p>
          <p className="mt-2 text-sm text-slate-500">Only admins can create new projects.</p>
        </Card>
      </div>

      {isAdmin && (
        <Card title="Create new project">
          <form className="space-y-4" onSubmit={handleCreateProject}>
            <input
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              placeholder="Project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <button className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create project'}
            </button>
          </form>
        </Card>
      )}

      {error && <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-2">{projectCards}</div>
    </div>
  );
};

export default Projects;
