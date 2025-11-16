import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mhc' });

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // roles
    await client.query("INSERT INTO roles (name, description) VALUES ('Patient', 'Patient role') ON CONFLICT DO NOTHING");
    await client.query("INSERT INTO roles (name, description) VALUES ('Doctor', 'Doctor role') ON CONFLICT DO NOTHING");
    await client.query("INSERT INTO roles (name, description) VALUES ('Nurse', 'Nurse role') ON CONFLICT DO NOTHING");
    await client.query("INSERT INTO roles (name, description) VALUES ('Hospital Admin', 'Hospital administrator') ON CONFLICT DO NOTHING");
    await client.query("INSERT INTO roles (name, description) VALUES ('Super Admin', 'Ministry of Health') ON CONFLICT DO NOTHING");

    // hospital
    await client.query("INSERT INTO hospitals (name, county, address) VALUES ('Nairobi General Hospital', 'Nairobi', '123 Nairobi Road') ON CONFLICT DO NOTHING");

    // admin user (username: admin, password: admin)
    const pw = await bcrypt.hash('admin', 10);
    await client.query(
      "INSERT INTO users (id, username, password_hash, role_id) SELECT gen_random_uuid(), 'admin', $1, r.id FROM roles r WHERE r.name='Super Admin' ON CONFLICT DO NOTHING",
      [pw],
    );

    await client.query('COMMIT');
    console.log('Seed complete');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

seed();
