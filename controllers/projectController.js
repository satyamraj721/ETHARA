const prisma = require('../utils/prisma');

const projectController = {
  createProject: async (req, res) => {
    try {
      const { name, description } = req.body;

      const project = await prisma.project.create({
        data: {
          name,
          description,
          createdBy: req.user.id,
        },
        include: {
          creator: { select: { id: true, name: true, email: true } },
        },
      });

      res.status(201).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getProjects: async (req, res) => {
    try {
      const projects = await prisma.project.findMany({
        where: {
          OR: [
            { createdBy: req.user.id },
            {
              members: {
                some: {
                  userId: req.user.id,
                },
              },
            },
          ],
        },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          members: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });

      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  addMember: async (req, res) => {
    try {
      const { id: projectId } = req.params;
      let { userId, userEmail, role = 'MEMBER' } = req.body;

      // Check if project exists and user is creator or admin
      const project = await prisma.project.findUnique({
        where: { id: parseInt(projectId) },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      if (project.createdBy !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized to add members' });
      }

      // Lookup userId from email if provided
      if (userEmail && !userId) {
        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        userId = user.id;
      }

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Check existing membership
      const existingMember = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: { userId, projectId: parseInt(projectId) },
        },
      });
      if (existingMember) {
        return res.status(400).json({ error: 'User is already a member of this project' });
      }

      const membership = await prisma.projectMember.create({
        data: {
          userId,
          projectId: parseInt(projectId),
          role,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          project: { select: { id: true, name: true } },
        },
      });

      res.status(201).json(membership);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = projectController;