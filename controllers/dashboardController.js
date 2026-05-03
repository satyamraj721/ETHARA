const prisma = require('../utils/prisma');

const dashboardController = {
  getDashboard: async (req, res) => {
    try {
      // Get projects user has access to
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
        select: { id: true },
      });

      const projectIds = projects.map(p => p.id);

      const taskAccessFilter =
        req.user.role === 'ADMIN'
          ? { projectId: { in: projectIds } }
          : { projectId: { in: projectIds }, assignedTo: req.user.id };

      // Total tasks
      const totalTasks = await prisma.task.count({
        where: taskAccessFilter,
      });

      // Tasks grouped by status
      const tasksByStatus = await prisma.task.groupBy({
        by: ['status'],
        where: taskAccessFilter,
        _count: { status: true },
      });

      // Overdue tasks
      const overdueTasks = await prisma.task.count({
        where: {
          ...taskAccessFilter,
          dueDate: { lt: new Date() },
          status: { not: 'DONE' },
        },
      });

      res.json({
        totalTasks,
        statusCounts: tasksByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        }, {}),
        overdueTasks,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = dashboardController;
