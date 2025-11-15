import express from 'express';
import { pool } from '../db';
import { Ledger } from '../core/ledger';
import { requireAuth, requireRole } from '../middleware/auth';

const ledger = new Ledger();
const router = express.Router();

// Add a medical record (visit, diagnosis, lab, etc.)
router.post('/add', requireAuth, requireRole('Doctor', 'Nurse', 'Lab Technician'), async (req, res) => {
  const { patient_id, record_type, data } = req.body;
  if (!patient_id || !record_type) return res.status(400).json({ error: 'patient_id and record_type required' });

  try {
    const client = await pool.connect();
    try {
      let result;
      if (record_type === 'visit') {
        result = await client.query(
          'INSERT INTO visits (patient_id, visit_type, notes) VALUES ($1, $2, $3) RETURNING id',
          [patient_id, data.visit_type || 'general', data.notes || '']
        );
      } else if (record_type === 'diagnosis') {
        result = await client.query(
          'INSERT INTO diagnoses (visit_id, code, description) VALUES ($1, $2, $3) RETURNING id',
          [patient_id, data.code || '', data.description || '']
        );
      }

      const recordId = result?.rows[0]?.id || 'unknown';
      const dataHash = ledger.hashRecord(data);
      await ledger.addBlock(record_type, dataHash, req.user?.id || 'system');

      res.status(201).json({ id: recordId });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

export default router;
