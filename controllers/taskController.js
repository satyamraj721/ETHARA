const prisma = require('../utils/prisma');

const taskController = {
  createTask: async (req, res) => {
    try {
      const { title, description, status, priority, dueDate, assignedTo, projectId } = req.body;

      const project = await prisma.project.findUnique({
        where: { id: parseInt(projectId) },
        include: { members: true },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const isMember = project.members.some((member) => member.userId === req.user.id) || project.createdBy === req.user.id;
      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to create tasks in this project' });
      }

      if (assignedTo) {
        const assignee = await prisma.user.findUnique({ where: { id: assignedTo } });
        if (!assignee) {
          return res.status(404).json({ error: 'Assigned user not found' });
        }

        const isAssigneeMember = project.members.some((member) => member.userId === assignedTo) || project.createdBy === assignedTo;
        if (!isAssigneeMember) {
          return res.status(400).json({ error: 'Assigned user must be part of this project' });
        }
      }

      const task = await prisma.task.create({
        data: {
          title,
          description,
          status: status || 'TODO',
          priority: priority || 'MEDIUM',
          dueDate: dueDate ? new Date(dueDate) : null,
          assignedTo: assignedTo || null,
          projectId: parseInt(projectId),
          createdBy: req.user.id,
        },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          creator: { select: { id: true, name: true, email: true } },
          project: { select: { id: true, name: true } },
        },
      });

      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getTasksByProject: async (req, res) => {
    try {
      const { projectId } = req.params;

      // Check access
      const project = await prisma.project.findUnique({
        where: { id: parseInt(projectId) },
        include: { members: true },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const isProjectMember = project.members.some(member => member.userId === req.user.id) || project.createdBy === req.user.id;
      if (!isProjectMember) {
        return res.status(403).json({ error: 'Not authorized to view tasks in this project' });
      }

      const taskFilter = { projectId: parseInt(projectId) };
      if (req.user.role !== 'ADMIN') {
        taskFilter.assignedTo = req.user.id;
      }

      const tasks = await prisma.task.findMany({
        where: taskFilter,
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          creator: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateTaskStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const task = await prisma.task.findUnique({
        where: { id: parseInt(id) },
        include: { project: { include: { members: true } } },
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const isMember = task.project.members.some((member) => member.userId === req.user.id) || task.project.createdBy === req.user.id;
      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to update this task' });
      }

      // RBAC rule:
      // - ADMIN can update any task status
      // - MEMBER can update status only for tasks assigned to them
      if (req.user.role !== 'ADMIN' && task.assignedTo !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update status for this task' });
      }

      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          creator: { select: { id: true, name: true, email: true } },
          project: { select: { id: true, name: true } },
        },
      });

      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  assignTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { assignedTo } = req.body;

      const task = await prisma.task.findUnique({
        where: { id: parseInt(id) },
        include: { project: { include: { members: true } } },
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const isMember = task.project.members.some(member => member.userId === req.user.id) || task.project.createdBy === req.user.id;
      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to assign tasks in this project' });
      }

      // Check if the user being assigned is a member of the project
      const isAssigneeMember = task.project.members.some(member => member.userId === assignedTo) || task.project.createdBy === assignedTo;
      if (!isAssigneeMember) {
        return res.status(400).json({ error: 'Cannot assign task to user who is not a member of this project' });
      }

      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: { assignedTo },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          creator: { select: { id: true, name: true, email: true } },
          project: { select: { id: true, name: true } },
        },
      });

      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = taskController;
