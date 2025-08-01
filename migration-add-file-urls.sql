-- Migration: Add file URL columns to existing caregiver_applications table
-- This script adds the new file URL fields without dropping the existing table

-- Add new file URL columns to existing table
ALTER TABLE caregiver_applications 
ADD COLUMN IF NOT EXISTS resume_url TEXT,
ADD COLUMN IF NOT EXISTS cpr_certificate_url TEXT,
ADD COLUMN IF NOT EXISTS psw_certificate_url TEXT,
ADD COLUMN IF NOT EXISTS additional_certifications_url TEXT;

-- Success message
SELECT 'Migration completed: File URL columns added to caregiver_applications table!' as status; 