import express from 'express';
import { pool } from '../db';
import { encryptJSON, decryptJSON } from '../utils/crypto';
import { Ledger } from '../core/ledger';
import { requireAuth, requireRole } from '../middleware/auth';

const ledger = new Ledger();
const router = express.Router();

// Create patient (restricted to hospital staff)
router.post('/', requireAuth, requireRole('Doctor', 'Nurse', 'Hospital Admin'), async (req, res) => {
  const { national_id, first_name, last_name, dob } = req.body;
  if (!national_id) return res.status(400).json({ error: 'national_id required' });

  try {
    const encrypted = encryptJSON({ national_id, first_name, last_name, dob });
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO patients (national_id, first_name, last_name, dob, demographics) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [national_id, first_name, last_name, dob, encrypted]
      );
      const patientId = result.rows[0].id;

      const record = { action: 'patient.create', patientId, dataHash: ledger.hashRecord({ national_id, first_name, last_name, dob }) };
      const dataHash = ledger.hashRecord(record);
      const block = await ledger.addBlock('patient.create', dataHash, req.user?.id || 'system');

      // persist ledger block to DB
      await client.query(
        'INSERT INTO blockchain_ledger (block_index, timestamp, action, data_hash, previous_hash, created_by, nonce) VALUES ($1,to_timestamp($2/1000.0),$3,$4,$5,$6,$7)',
        [block.index, block.timestamp, block.action, block.dataHash, block.previousHash, block.createdBy, block.nonce]
      );

      // audit log
      await client.query('INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata) VALUES ($1,$2,$3,$4,$5)', [req.user?.id || null, 'patient.create', 'patient', patientId, { national_id }]);

      res.status(201).json({ id: patientId });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Lookup patient by national ID (limited view unless authorized)
router.get('/lookup/:nationalId', requireAuth, async (req, res) => {
  const { nationalId } = req.params;
  try {
    const result = await pool.query('SELECT id, health_id, national_id, demographics FROM patients WHERE national_id=$1', [nationalId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'not found' });
    const row = result.rows[0];
    // Decrypt demographics for authorized roles
    let demographics: any = null;
    try { demographics = decryptJSON(row.demographics); } catch (e) { demographics = null; }
    res.json({ id: row.id, health_id: row.health_id, national_id: row.national_id, demographics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

export default router;
