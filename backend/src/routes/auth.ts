import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../db';
import { config } from '../config';

const router = express.Router();

// Local login for demo purposes (in prod use OAuth/ecitizen + strong password policies)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username & password required' });

  try {
    const result = await pool.query('SELECT id, username, password_hash, role_id FROM users WHERE username=$1', [username]);
    if (result.rowCount === 0) return res.status(401).json({ error: 'invalid' });
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(401).json({ error: 'invalid' });

    // fetch role name
    const r = await pool.query('SELECT name FROM roles WHERE id=$1', [user.role_id]);
    const role = r.rows[0]?.name || 'patient';

    const token = jwt.sign({ username: user.username, role }, config.jwtSecret, { subject: user.id, expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'internal' });
  }
});

// OAuth/ecitizen endpoint stub
router.get('/ecitizen', (req, res) => {
  // In production, implement OAuth2 flow to authenticate government users via eCitizen
  res.json({ message: 'eCitizen OAuth endpoint stub' });
});

export default router;
