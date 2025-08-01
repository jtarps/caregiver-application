-- Drop existing table and recreate with correct schema
DROP TABLE IF EXISTS caregiver_applications CASCADE;

-- Create or replace the function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create table with correct schema matching the updated form
CREATE TABLE caregiver_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id TEXT UNIQUE NOT NULL,
  
  -- Step 1: Basic Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  
  -- Step 2: Upload Documents (file paths/references)
  resume_url TEXT,
  cpr_certificate_url TEXT,
  psw_certificate_url TEXT,
  additional_certifications_url TEXT,
  
  -- Step 3: Quick Eligibility Check
  legally_eligible_canada BOOLEAN,
  age_18_or_older BOOLEAN,
  has_driver_license BOOLEAN,
  has_reliable_car BOOLEAN,
  available_weekends BOOLEAN,
  can_live_in_care BOOLEAN,
  is_international_student BOOLEAN,
  previously_applied BOOLEAN,
  can_perform_duties BOOLEAN,
  
  -- Step 4: Qualifications
  has_psw_certificate BOOLEAN,
  completed_placement_hours BOOLEAN,
  has_cpr_first_aid BOOLEAN,
  is_canadian_rn BOOLEAN,
  is_rn_student BOOLEAN,
  is_foreign_rn BOOLEAN,
  
  -- Step 5: Criminal & Physical Fitness
  criminal_conviction_5_years BOOLEAN,
  criminal_conviction_details TEXT,
  physically_capable BOOLEAN,
  physical_limitations TEXT,
  
  -- Step 6: Languages
  languages TEXT[], -- Array of languages
  
  -- Step 7: Work Experience
  has_caregiving_experience BOOLEAN,
  work_experience JSONB, -- Store as JSON array of work experience objects
  
  -- Step 8: Availability
  work_types TEXT[], -- Array of work types
  available_days TEXT[], -- Array of available days
  available_mornings BOOLEAN,
  available_afternoons BOOLEAN,
  available_evenings BOOLEAN,
  available_overnight BOOLEAN,
  available_weekends_availability BOOLEAN, -- Renamed to avoid conflict
  available_holidays BOOLEAN,
  preferred_shift_length TEXT,
  start_date TEXT,
  start_date_other TEXT,
  hours_per_week TEXT,
  
  -- Final Declarations
  certification_truthfulness BOOLEAN,
  authorization_background_check BOOLEAN,
  understanding_at_will_employment BOOLEAN,
  acknowledgment_application_validity BOOLEAN,
  digital_signature TEXT,
  signature_date TEXT,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_caregiver_applications_email ON caregiver_applications(email);
CREATE INDEX idx_caregiver_applications_application_id ON caregiver_applications(application_id);
CREATE INDEX idx_caregiver_applications_status ON caregiver_applications(status);
CREATE INDEX idx_caregiver_applications_created_at ON caregiver_applications(created_at);

-- Create trigger
CREATE TRIGGER update_caregiver_applications_updated_at 
    BEFORE UPDATE ON caregiver_applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Show success message
SELECT 'Caregiver applications table recreated successfully with updated schema!' as status; 