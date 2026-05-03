const prisma = require('../utils/prisma');
const { hashPassword } = require('../utils/auth');

const userController = {
  getUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createUser: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password required' });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const validRoles = ['ADMIN', 'MEMBER'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be ADMIN or MEMBER' });
      }

      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
        select: { id: true, name: true, email: true, role: true },
      });

      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = userController;
