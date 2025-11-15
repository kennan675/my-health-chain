import express from 'express';
import { pool } from '../db';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Upload lab results
router.post('/upload', requireAuth, async (req, res) => {
  const { patient_id, lab_name, results } = req.body;
  if (!patient_id || !lab_name) return res.status(400).json({ error: 'patient_id and lab_name required' });

  try {
    const result = await pool.query(
      'INSERT INTO lab_results (visit_id, lab_name, results, performed_at) VALUES ($1, $2, $3, now()) RETURNING id',
      [patient_id, lab_name, results]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

export default router;
