-- PSW Competency Assessment Table
CREATE TABLE IF NOT EXISTS psw_competency_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id TEXT UNIQUE NOT NULL,
  caregiver_application_id TEXT, -- Link to caregiver application
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Section 1: Personal Care & Hygiene
  brushing_teeth TEXT CHECK (brushing_teeth IN ('comfortable', 'support_needed', 'prefer_not')),
  dentures_support TEXT CHECK (dentures_support IN ('comfortable', 'support_needed', 'prefer_not')),
  bathing_assistance TEXT CHECK (bathing_assistance IN ('comfortable', 'support_needed', 'prefer_not')),
  skin_condition_check TEXT CHECK (skin_condition_check IN ('comfortable', 'support_needed', 'prefer_not')),
  dressing_assistance TEXT CHECK (dressing_assistance IN ('comfortable', 'support_needed', 'prefer_not')),
  nail_clipping TEXT CHECK (nail_clipping IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 2: Bowel & Bladder Support
  toileting_assistance TEXT CHECK (toileting_assistance IN ('comfortable', 'support_needed', 'prefer_not')),
  digital_stimulation TEXT CHECK (digital_stimulation IN ('comfortable', 'support_needed', 'prefer_not')),
  catheter_care TEXT CHECK (catheter_care IN ('comfortable', 'support_needed', 'prefer_not')),
  voiding_diary TEXT CHECK (voiding_diary IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 3: Mobility & Safety Support
  safe_positioning TEXT CHECK (safe_positioning IN ('comfortable', 'support_needed', 'prefer_not')),
  transfer_assistance TEXT CHECK (transfer_assistance IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 4: Kitchen Care & Cleaning
  dish_washing TEXT CHECK (dish_washing IN ('comfortable', 'support_needed', 'prefer_not')),
  kitchen_cleaning TEXT CHECK (kitchen_cleaning IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 5: Meal Preparation & Food Handling
  basic_meal_cooking TEXT CHECK (basic_meal_cooking IN ('comfortable', 'support_needed', 'prefer_not')),
  cultural_meals TEXT CHECK (cultural_meals IN ('comfortable', 'support_needed', 'prefer_not')),
  meat_handling TEXT CHECK (meat_handling IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 6: Housekeeping & Tidying
  bed_linen_changing TEXT CHECK (bed_linen_changing IN ('comfortable', 'support_needed', 'prefer_not')),
  bathroom_cleaning TEXT CHECK (bathroom_cleaning IN ('comfortable', 'support_needed', 'prefer_not')),
  dusting_cleaning TEXT CHECK (dusting_cleaning IN ('comfortable', 'support_needed', 'prefer_not')),
  floor_cleaning TEXT CHECK (floor_cleaning IN ('comfortable', 'support_needed', 'prefer_not')),
  surface_cleaning TEXT CHECK (surface_cleaning IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 7: Laundry & Clothing Care
  laundry_care TEXT CHECK (laundry_care IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 8: Organizing & Personal Belongings
  organizing_items TEXT CHECK (organizing_items IN ('comfortable', 'support_needed', 'prefer_not')),
  safety_accessibility TEXT CHECK (safety_accessibility IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 9: Health & Safety Practices
  proper_handwashing TEXT CHECK (proper_handwashing IN ('comfortable', 'support_needed', 'prefer_not')),
  glove_usage TEXT CHECK (glove_usage IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 10: Waste & Recycling Practices
  trash_removal TEXT CHECK (trash_removal IN ('comfortable', 'support_needed', 'prefer_not')),
  recycling_sorting TEXT CHECK (recycling_sorting IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 11: Pet Comfort Levels
  working_with_cats TEXT CHECK (working_with_cats IN ('comfortable', 'not_comfortable')),
  working_with_dogs TEXT CHECK (working_with_dogs IN ('comfortable', 'not_comfortable')),
  
  -- Section 12: Cognitive Support
  memory_prompts TEXT CHECK (memory_prompts IN ('comfortable', 'support_needed', 'prefer_not')),
  dementia_support TEXT CHECK (dementia_support IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 13: Medication Support
  medication_reminders TEXT CHECK (medication_reminders IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 14: Mobility Monitoring
  fall_risk_identification TEXT CHECK (fall_risk_identification IN ('comfortable', 'support_needed', 'prefer_not')),
  mobility_change_reporting TEXT CHECK (mobility_change_reporting IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 15: Communication Support
  translation_apps TEXT CHECK (translation_apps IN ('comfortable', 'support_needed', 'prefer_not')),
  speech_hearing_support TEXT CHECK (speech_hearing_support IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 16: Emotional Intelligence
  companionship_support TEXT CHECK (companionship_support IN ('comfortable', 'support_needed', 'prefer_not')),
  distress_recognition TEXT CHECK (distress_recognition IN ('comfortable', 'support_needed', 'prefer_not')),
  
  -- Section 17: Special Notes
  special_notes TEXT,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'reviewed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_psw_assessments_email ON psw_competency_assessments(email);
CREATE INDEX IF NOT EXISTS idx_psw_assessments_caregiver_app_id ON psw_competency_assessments(caregiver_application_id);
CREATE INDEX IF NOT EXISTS idx_psw_assessments_status ON psw_competency_assessments(status);
CREATE INDEX IF NOT EXISTS idx_psw_assessments_created_at ON psw_competency_assessments(created_at);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_psw_assessments_updated_at 
    BEFORE UPDATE ON psw_competency_assessments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'PSW competency assessments table created successfully!' as status; 