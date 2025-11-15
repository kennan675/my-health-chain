-- PostgreSQL schema for My Health Chain

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role_id INTEGER REFERENCES roles(id),
  hospital_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE hospitals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  county TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  health_id TEXT UNIQUE, -- generated unique health id
  national_id TEXT UNIQUE,
  passport TEXT UNIQUE,
  birth_certificate TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  dob DATE,
  gender TEXT,
  contact JSONB,
  demographics JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_patients_national_id ON patients(national_id);
CREATE INDEX idx_patients_health_id ON patients(health_id);

CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  hospital_id INTEGER REFERENCES hospitals(id),
  visit_at TIMESTAMPTZ DEFAULT now(),
  visit_type TEXT,
  notes TEXT
);

CREATE TABLE diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  code TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  name TEXT,
  dose TEXT,
  route TEXT,
  frequency TEXT,
  start_date DATE,
  end_date DATE,
  prescribing_doctor UUID REFERENCES users(id)
);

CREATE TABLE allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  substance TEXT,
  reaction TEXT,
  severity TEXT
);

CREATE TABLE lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  lab_name TEXT,
  results JSONB,
  attachments JSONB,
  performed_at TIMESTAMPTZ
);

CREATE TABLE radiology_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  file_url TEXT,
  metadata JSONB,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE immunizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  vaccine TEXT,
  date_given DATE,
  provider TEXT
);

CREATE TABLE blockchain_ledger (
  id SERIAL PRIMARY KEY,
  block_index INTEGER,
  timestamp TIMESTAMPTZ,
  action TEXT,
  data_hash TEXT,
  previous_hash TEXT,
  created_by TEXT,
  nonce INTEGER
);

CREATE INDEX idx_blockchain_data_hash ON blockchain_ledger(data_hash);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  action TEXT,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE offline_sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID,
  payload JSONB,
  status TEXT DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  last_attempt TIMESTAMPTZ
);

-- Extensions and helper
CREATE EXTENSION IF NOT EXISTS pgcrypto;
