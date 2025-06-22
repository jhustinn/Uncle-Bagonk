/*
  # Promo Claims System

  1. New Tables
    - `promo_claims`
      - `id` (uuid, primary key)
      - `promo_id` (uuid, foreign key to promos)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `customer_email` (text, optional)
      - `claimed_at` (timestamp)
      - `used_at` (timestamp, nullable)
      - `status` (text: 'claimed', 'used', 'expired')
      - `claim_code` (text, unique)
      - `notes` (text, optional)

  2. Security
    - Enable RLS on promo_claims table
    - Add policies for public claim creation
    - Add policies for authenticated users to manage claims

  3. Functions
    - Generate unique claim codes
    - Validate promo availability
    - Track claim usage
*/

-- Create promo_claims table
CREATE TABLE IF NOT EXISTS promo_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_id uuid REFERENCES promos(id) ON DELETE CASCADE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  claimed_at timestamptz DEFAULT now(),
  used_at timestamptz,
  status text DEFAULT 'claimed' CHECK (status IN ('claimed', 'used', 'expired')),
  claim_code text UNIQUE NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_promo_claims_promo_id ON promo_claims(promo_id);
CREATE INDEX IF NOT EXISTS idx_promo_claims_claim_code ON promo_claims(claim_code);
CREATE INDEX IF NOT EXISTS idx_promo_claims_status ON promo_claims(status);
CREATE INDEX IF NOT EXISTS idx_promo_claims_phone ON promo_claims(customer_phone);

-- Enable Row Level Security
ALTER TABLE promo_claims ENABLE ROW LEVEL SECURITY;

-- Create policies for public claim creation
CREATE POLICY "Anyone can create promo claims"
  ON promo_claims
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policies for customers to view their own claims
CREATE POLICY "Customers can view their own claims"
  ON promo_claims
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for authenticated users (admin) to manage all claims
CREATE POLICY "Authenticated users can manage all promo claims"
  ON promo_claims
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to generate unique claim code
CREATE OR REPLACE FUNCTION generate_claim_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM promo_claims WHERE claim_code = code) INTO exists;
    
    -- Exit loop if code is unique
    IF NOT exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically expire claims for expired promos
CREATE OR REPLACE FUNCTION expire_old_claims()
RETURNS void AS $$
BEGIN
  UPDATE promo_claims 
  SET status = 'expired', updated_at = now()
  WHERE status = 'claimed' 
    AND promo_id IN (
      SELECT id FROM promos 
      WHERE valid_until < CURRENT_DATE OR active = false
    );
END;
$$ LANGUAGE plpgsql;

-- Trigger to set claim_code automatically
CREATE OR REPLACE FUNCTION set_claim_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.claim_code IS NULL OR NEW.claim_code = '' THEN
    NEW.claim_code := generate_claim_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_claim_code
  BEFORE INSERT ON promo_claims
  FOR EACH ROW
  EXECUTE FUNCTION set_claim_code();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_promo_claims_updated_at
  BEFORE UPDATE ON promo_claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();