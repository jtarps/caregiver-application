-- Drop existing table to recreate with updated schema
DROP TABLE IF EXISTS caregiver_applications CASCADE;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_caregiver_applications_updated_at ON caregiver_applications;

-- Create or replace the updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create caregiver_applications table with updated schema including file URLs
CREATE TABLE caregiver_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id TEXT UNIQUE NOT NULL,
    
    -- Step 1: Basic Info
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    
    -- Step 2: Upload Documents (URLs)
    resume_url TEXT,
    cpr_certificate_url TEXT,
    psw_certificate_url TEXT,
    additional_certifications_url TEXT,
    
    -- Step 3: Quick Eligibility Check
    legally_eligible_canada BOOLEAN,
    age_18_or_older BOOLEAN,
    has_driver_license BOOLEAN,
    has_reliable_car BOOLEAN,
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
    languages TEXT[],
    
    -- Step 7: Work Experience
    has_caregiving_experience BOOLEAN,
    work_experience JSONB,
    
    -- Step 8: Availability
    work_types TEXT[],
    available_days TEXT[],
    available_mornings BOOLEAN,
    available_afternoons BOOLEAN,
    available_evenings BOOLEAN,
    available_overnight BOOLEAN,
    available_weekends_availability BOOLEAN,
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
    
    -- Status and timestamps
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_caregiver_applications_email ON caregiver_applications(email);
CREATE INDEX idx_caregiver_applications_status ON caregiver_applications(status);
CREATE INDEX idx_caregiver_applications_created_at ON caregiver_applications(created_at);
CREATE INDEX idx_caregiver_applications_application_id ON caregiver_applications(application_id);

-- Create trigger for updated_at
CREATE TRIGGER update_caregiver_applications_updated_at
    BEFORE UPDATE ON caregiver_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Caregiver applications table recreated successfully with updated schema including file URLs!' as status; 