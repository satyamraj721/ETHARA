const prisma = require('../utils/prisma');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

const authController = {
  signup: async (req, res) => {
    try {
      const { name, email, password, role: requestedRole } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const validRoles = ['ADMIN', 'MEMBER'];
      const role = validRoles.includes(requestedRole) ? requestedRole : 'MEMBER';

      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
        select: { id: true, name: true, email: true, role: true },
      });

      const token = generateToken(user);
      res.status(201).json({ token, user });
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user);
      const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role };
      res.json({ token, user: userResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = authController;
