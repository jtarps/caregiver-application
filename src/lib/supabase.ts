import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types (MVP)
export interface Intake {
  id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  postal_code?: string
  gender?: string
  medical_conditions?: string
  medications?: string
  allergies?: string
  mobility_level?: string
  care_requirements?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relationship?: string
  insurance_provider?: string
  insurance_number?: string
  preferred_start_date?: string
  preferred_schedule?: string
  preferred_time?: string
  duration_per_visit?: string
  additional_notes?: string
  admin_notes?: string
  assigned_caregiver_id?: string
  status: 'pending' | 'approved' | 'rejected' | 'assigned'
  created_at: string
  client_id?: string
  source: 'admin' | 'booking'
}

export interface Client {
  id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  phone?: string
  email?: string
  address?: string
  status: 'active' | 'inactive' | 'discharged'
  notes?: string
}

export interface FamilyMember {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  is_primary_contact: boolean
  client_id: string
  notes?: string
}

export interface Caregiver {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  status: 'pending' | 'active' | 'inactive'
  certifications?: string[]
  notes?: string
}

export interface Shift {
  id: string
  client_id: string
  caregiver_id: string
  scheduled_date: string // YYYY-MM-DD
  start_time: string // HH:MM
  end_time: string // HH:MM
  service_type: string
  hourly_rate?: number
  status: 'assigned' | 'checked_in' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  admin_notes?: string
  // Optionally, add created_at if used elsewhere
  created_at?: string
}

export interface Message {
  id: string
  client_id: string
  sender_id: string
  sender_type: 'family' | 'caregiver' | 'admin'
  recipient_id?: string
  message: string
  created_at: string
}

// PSW Competency Assessment Types
export interface PSWCompetencyAssessment {
  id: string
  assessment_id: string
  caregiver_application_id?: string // Link to caregiver application
  first_name: string
  last_name: string
  email: string
  phone: string
  
  // Section 1: Personal Care & Hygiene
  brushing_teeth: 'comfortable' | 'support_needed' | 'prefer_not'
  dentures_support: 'comfortable' | 'support_needed' | 'prefer_not'
  bathing_assistance: 'comfortable' | 'support_needed' | 'prefer_not'
  skin_condition_check: 'comfortable' | 'support_needed' | 'prefer_not'
  dressing_assistance: 'comfortable' | 'support_needed' | 'prefer_not'
  nail_clipping: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 2: Bowel & Bladder Support
  toileting_assistance: 'comfortable' | 'support_needed' | 'prefer_not'
  digital_stimulation: 'comfortable' | 'support_needed' | 'prefer_not'
  catheter_care: 'comfortable' | 'support_needed' | 'prefer_not'
  voiding_diary: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 3: Mobility & Safety Support
  safe_positioning: 'comfortable' | 'support_needed' | 'prefer_not'
  transfer_assistance: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 4: Kitchen Care & Cleaning
  dish_washing: 'comfortable' | 'support_needed' | 'prefer_not'
  kitchen_cleaning: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 5: Meal Preparation & Food Handling
  basic_meal_cooking: 'comfortable' | 'support_needed' | 'prefer_not'
  cultural_meals: 'comfortable' | 'support_needed' | 'prefer_not'
  meat_handling: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 6: Housekeeping & Tidying
  bed_linen_changing: 'comfortable' | 'support_needed' | 'prefer_not'
  bathroom_cleaning: 'comfortable' | 'support_needed' | 'prefer_not'
  dusting_cleaning: 'comfortable' | 'support_needed' | 'prefer_not'
  floor_cleaning: 'comfortable' | 'support_needed' | 'prefer_not'
  surface_cleaning: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 7: Laundry & Clothing Care
  laundry_care: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 8: Organizing & Personal Belongings
  organizing_items: 'comfortable' | 'support_needed' | 'prefer_not'
  safety_accessibility: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 9: Health & Safety Practices
  proper_handwashing: 'comfortable' | 'support_needed' | 'prefer_not'
  glove_usage: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 10: Waste & Recycling Practices
  trash_removal: 'comfortable' | 'support_needed' | 'prefer_not'
  recycling_sorting: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 11: Pet Comfort Levels
  working_with_cats: 'comfortable' | 'not_comfortable'
  working_with_dogs: 'comfortable' | 'not_comfortable'
  
  // Section 12: Cognitive Support
  memory_prompts: 'comfortable' | 'support_needed' | 'prefer_not'
  dementia_support: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 13: Medication Support
  medication_reminders: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 14: Mobility Monitoring
  fall_risk_identification: 'comfortable' | 'support_needed' | 'prefer_not'
  mobility_change_reporting: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 15: Communication Support
  translation_apps: 'comfortable' | 'support_needed' | 'prefer_not'
  speech_hearing_support: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 16: Emotional Intelligence
  companionship_support: 'comfortable' | 'support_needed' | 'prefer_not'
  distress_recognition: 'comfortable' | 'support_needed' | 'prefer_not'
  
  // Section 17: Special Notes
  special_notes?: string
  
  status: 'pending' | 'completed' | 'reviewed'
  created_at: string
  updated_at?: string
}
