"use client";

import React, { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

interface AssessmentData {
  // Personal Information
  first_name: string;
  last_name: string;
  email: string;
  phone: string;

  // Section 1: Personal Care & Hygiene
  brushing_teeth: string;
  dentures_support: string;
  bathing_assistance: string;
  skin_condition_check: string;
  dressing_assistance: string;
  nail_clipping: string;

  // Section 2: Bowel & Bladder Support
  toileting_assistance: string;
  digital_stimulation: string;
  catheter_care: string;
  voiding_diary: string;

  // Section 3: Mobility & Safety Support
  safe_positioning: string;
  transfer_assistance: string;

  // Section 4: Kitchen Care & Cleaning
  dish_washing: string;
  kitchen_cleaning: string;

  // Section 5: Meal Preparation & Food Handling
  basic_meal_cooking: string;
  cultural_meals: string;
  meat_handling: string;

  // Section 6: Housekeeping & Tidying
  bed_linen_changing: string;
  bathroom_cleaning: string;
  dusting_cleaning: string;
  floor_cleaning: string;
  surface_cleaning: string;

  // Section 7: Laundry & Clothing Care
  laundry_care: string;

  // Section 8: Organizing & Personal Belongings
  organizing_items: string;
  safety_accessibility: string;

  // Section 9: Health & Safety Practices
  proper_handwashing: string;
  glove_usage: string;

  // Section 10: Waste & Recycling Practices
  trash_removal: string;
  recycling_sorting: string;

  // Section 11: Pet Comfort Levels
  working_with_cats: string;
  working_with_dogs: string;

  // Section 12: Cognitive Support
  memory_prompts: string;
  dementia_support: string;

  // Section 13: Medication Support
  medication_reminders: string;

  // Section 14: Mobility Monitoring
  fall_risk_identification: string;
  mobility_change_reporting: string;

  // Section 15: Communication Support
  translation_apps: string;
  speech_hearing_support: string;

  // Section 16: Emotional Intelligence
  companionship_support: string;
  distress_recognition: string;

  // Section 17: Special Notes
  special_notes: string;
}

const initialAssessmentData: AssessmentData = {
  // Personal Information
  first_name: "",
  last_name: "",
  email: "",
  phone: "",

  // Section 1: Personal Care & Hygiene
  brushing_teeth: "",
  dentures_support: "",
  bathing_assistance: "",
  skin_condition_check: "",
  dressing_assistance: "",
  nail_clipping: "",

  // Section 2: Bowel & Bladder Support
  toileting_assistance: "",
  digital_stimulation: "",
  catheter_care: "",
  voiding_diary: "",

  // Section 3: Mobility & Safety Support
  safe_positioning: "",
  transfer_assistance: "",

  // Section 4: Kitchen Care & Cleaning
  dish_washing: "",
  kitchen_cleaning: "",

  // Section 5: Meal Preparation & Food Handling
  basic_meal_cooking: "",
  cultural_meals: "",
  meat_handling: "",

  // Section 6: Housekeeping & Tidying
  bed_linen_changing: "",
  bathroom_cleaning: "",
  dusting_cleaning: "",
  floor_cleaning: "",
  surface_cleaning: "",

  // Section 7: Laundry & Clothing Care
  laundry_care: "",

  // Section 8: Organizing & Personal Belongings
  organizing_items: "",
  safety_accessibility: "",

  // Section 9: Health & Safety Practices
  proper_handwashing: "",
  glove_usage: "",

  // Section 10: Waste & Recycling Practices
  trash_removal: "",
  recycling_sorting: "",

  // Section 11: Pet Comfort Levels
  working_with_cats: "",
  working_with_dogs: "",

  // Section 12: Cognitive Support
  memory_prompts: "",
  dementia_support: "",

  // Section 13: Medication Support
  medication_reminders: "",

  // Section 14: Mobility Monitoring
  fall_risk_identification: "",
  mobility_change_reporting: "",

  // Section 15: Communication Support
  translation_apps: "",
  speech_hearing_support: "",

  // Section 16: Emotional Intelligence
  companionship_support: "",
  distress_recognition: "",

  // Section 17: Special Notes
  special_notes: "",
};

function PSWCompetencyAssessmentContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>(
    initialAssessmentData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string>("");

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const searchParams = useSearchParams();
  const caregiverApplicationId = searchParams.get("applicationId");

  // Generate unique assessment ID when component mounts
  React.useEffect(() => {
    const generateUniqueId = () => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const sessionId = Math.random().toString(36).substring(2, 8);
      return `psw_${timestamp}_${randomStr}_${sessionId}`;
    };

    const id = generateUniqueId();
    setAssessmentId(id);
  }, []);

  // Get application ID from URL if available
  // const caregiverApplicationId = searchParams.get("applicationId"); // Moved outside useEffect

  const updateAssessmentData = (field: keyof AssessmentData, value: string) => {
    setAssessmentData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal Information
        return !!(
          assessmentData.first_name &&
          assessmentData.last_name &&
          assessmentData.email &&
          assessmentData.phone
        );
      case 2: // Personal Care & Hygiene
        return !!(
          assessmentData.brushing_teeth &&
          assessmentData.dentures_support &&
          assessmentData.bathing_assistance &&
          assessmentData.skin_condition_check &&
          assessmentData.dressing_assistance &&
          assessmentData.nail_clipping
        );
      case 3: // Bowel & Bladder Support
        return !!(
          assessmentData.toileting_assistance &&
          assessmentData.digital_stimulation &&
          assessmentData.catheter_care &&
          assessmentData.voiding_diary
        );
      case 4: // Mobility & Safety Support
        return !!(
          assessmentData.safe_positioning && assessmentData.transfer_assistance
        );
      case 5: // Kitchen Care & Cleaning
        return !!(
          assessmentData.dish_washing && assessmentData.kitchen_cleaning
        );
      case 6: // Meal Preparation & Food Handling
        return !!(
          assessmentData.basic_meal_cooking &&
          assessmentData.cultural_meals &&
          assessmentData.meat_handling
        );
      case 7: // Housekeeping, Laundry & Organizing (Combined)
        return !!(
          assessmentData.bed_linen_changing &&
          assessmentData.bathroom_cleaning &&
          assessmentData.dusting_cleaning &&
          assessmentData.floor_cleaning &&
          assessmentData.surface_cleaning &&
          assessmentData.laundry_care &&
          assessmentData.organizing_items &&
          assessmentData.safety_accessibility
        );
      case 8: // Health, Safety & Support Skills (Combined)
        return !!(
          assessmentData.proper_handwashing &&
          assessmentData.glove_usage &&
          assessmentData.trash_removal &&
          assessmentData.recycling_sorting &&
          assessmentData.working_with_cats &&
          assessmentData.working_with_dogs &&
          assessmentData.memory_prompts &&
          assessmentData.dementia_support &&
          assessmentData.medication_reminders &&
          assessmentData.fall_risk_identification &&
          assessmentData.mobility_change_reporting &&
          assessmentData.translation_apps &&
          assessmentData.speech_hearing_support &&
          assessmentData.companionship_support &&
          assessmentData.distress_recognition
        );
      // Note: special_notes is optional, so it's not included in validation
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast.error("Please complete all required fields before proceeding");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submitAssessment = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const assessmentPayload = {
        assessment_id: assessmentId,
        caregiver_application_id: caregiverApplicationId, // Link to caregiver application
        first_name: assessmentData.first_name,
        last_name: assessmentData.last_name,
        email: assessmentData.email,
        phone: assessmentData.phone,

        // Section 1: Personal Care & Hygiene
        brushing_teeth: assessmentData.brushing_teeth,
        dentures_support: assessmentData.dentures_support,
        bathing_assistance: assessmentData.bathing_assistance,
        skin_condition_check: assessmentData.skin_condition_check,
        dressing_assistance: assessmentData.dressing_assistance,
        nail_clipping: assessmentData.nail_clipping,

        // Section 2: Bowel & Bladder Support
        toileting_assistance: assessmentData.toileting_assistance,
        digital_stimulation: assessmentData.digital_stimulation,
        catheter_care: assessmentData.catheter_care,
        voiding_diary: assessmentData.voiding_diary,

        // Section 3: Mobility & Safety Support
        safe_positioning: assessmentData.safe_positioning,
        transfer_assistance: assessmentData.transfer_assistance,

        // Section 4: Kitchen Care & Cleaning
        dish_washing: assessmentData.dish_washing,
        kitchen_cleaning: assessmentData.kitchen_cleaning,

        // Section 5: Meal Preparation & Food Handling
        basic_meal_cooking: assessmentData.basic_meal_cooking,
        cultural_meals: assessmentData.cultural_meals,
        meat_handling: assessmentData.meat_handling,

        // Section 6: Housekeeping & Tidying
        bed_linen_changing: assessmentData.bed_linen_changing,
        bathroom_cleaning: assessmentData.bathroom_cleaning,
        dusting_cleaning: assessmentData.dusting_cleaning,
        floor_cleaning: assessmentData.floor_cleaning,
        surface_cleaning: assessmentData.surface_cleaning,

        // Section 7: Laundry & Clothing Care
        laundry_care: assessmentData.laundry_care,

        // Section 8: Organizing & Personal Belongings
        organizing_items: assessmentData.organizing_items,
        safety_accessibility: assessmentData.safety_accessibility,

        // Section 9: Health & Safety Practices
        proper_handwashing: assessmentData.proper_handwashing,
        glove_usage: assessmentData.glove_usage,

        // Section 10: Waste & Recycling Practices
        trash_removal: assessmentData.trash_removal,
        recycling_sorting: assessmentData.recycling_sorting,

        // Section 11: Pet Comfort Levels
        working_with_cats: assessmentData.working_with_cats,
        working_with_dogs: assessmentData.working_with_dogs,

        // Section 12: Cognitive Support
        memory_prompts: assessmentData.memory_prompts,
        dementia_support: assessmentData.dementia_support,

        // Section 13: Medication Support
        medication_reminders: assessmentData.medication_reminders,

        // Section 14: Mobility Monitoring
        fall_risk_identification: assessmentData.fall_risk_identification,
        mobility_change_reporting: assessmentData.mobility_change_reporting,

        // Section 15: Communication Support
        translation_apps: assessmentData.translation_apps,
        speech_hearing_support: assessmentData.speech_hearing_support,

        // Section 16: Emotional Intelligence
        companionship_support: assessmentData.companionship_support,
        distress_recognition: assessmentData.distress_recognition,

        // Section 17: Special Notes
        special_notes: assessmentData.special_notes,

        status: "completed",
      };

      console.log("Submitting assessment with ID:", assessmentId);
      console.log("Assessment data:", assessmentPayload);

      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        toast.error("Database not configured. Please contact support.");
        return;
      }

      if (!supabase) {
        toast.error("Database connection failed. Please try again.");
        return;
      }

      const { error } = await supabase
        .from("psw_competency_assessments")
        .insert([assessmentPayload]);

      if (error) {
        console.error("Database error details:", error);
        toast.error(`Submission failed: ${error.message || "Unknown error"}`);
        return;
      }

      toast.success("PSW Competency Assessment submitted successfully!");
      setAssessmentData(initialAssessmentData);
      setCurrentStep(1);
      if (caregiverApplicationId) {
        toast.success(
          "Your assessment has been linked to your caregiver application!"
        );
      }
    } catch (error: unknown) {
      console.error("Error submitting assessment:", error);
      toast.error("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCompetencyQuestion = (
    field: keyof AssessmentData,
    question: string,
    options: { value: string; label: string; icon: React.ReactNode }[]
  ) => (
    <div className="space-y-3">
      <Label className="text-base font-semibold text-gray-900">
        {question}
      </Label>
      <RadioGroup
        value={assessmentData[field]}
        onValueChange={(value) => updateAssessmentData(field, value)}
        className="space-y-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${field}-${option.value}`}
            />
            <Label
              htmlFor={`${field}-${option.value}`}
              className="flex items-center space-x-2 cursor-pointer"
            >
              {option.icon}
              <span>{option.label}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        👤 Personal Info
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={assessmentData.first_name}
            onChange={(e) => updateAssessmentData("first_name", e.target.value)}
            placeholder="First Name"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={assessmentData.last_name}
            onChange={(e) => updateAssessmentData("last_name", e.target.value)}
            placeholder="Last Name"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={assessmentData.email}
            onChange={(e) => updateAssessmentData("email", e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={assessmentData.phone}
            onChange={(e) => updateAssessmentData("phone", e.target.value)}
            placeholder="(555) 123-4567"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        🧼 Personal Care & Hygiene
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Each task uses: ✅ Comfortable performing 🧠 Would like support/training
        🙅 Prefer not to do this task
      </p>
      <div className="space-y-6">
        {renderCompetencyQuestion(
          "brushing_teeth",
          "Helping with brushing teeth",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "dentures_support",
          "Supporting with dentures",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "bathing_assistance",
          "Assisting with bathing (bed, shower, chair)",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "skin_condition_check",
          "Checking skin condition",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "dressing_assistance",
          "Helping clients dress",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "nail_clipping",
          "Clipping nails (non-diabetic only)",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        🚽 Bowel & Bladder Support
      </h3>
      <div className="space-y-6">
        {renderCompetencyQuestion(
          "toileting_assistance",
          "Helping with bathroom use",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "digital_stimulation",
          "Providing bowel stimulation",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion("catheter_care", "Supporting catheter care", [
          {
            value: "comfortable",
            label: "Comfortable performing",
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          },
          {
            value: "support_needed",
            label: "Would like support/training",
            icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
          },
          {
            value: "prefer_not",
            label: "Prefer not to do this task",
            icon: <XCircle className="h-4 w-4 text-red-600" />,
          },
        ])}
        {renderCompetencyQuestion("voiding_diary", "Tracking bathroom habits", [
          {
            value: "comfortable",
            label: "Comfortable performing",
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          },
          {
            value: "support_needed",
            label: "Would like support/training",
            icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
          },
          {
            value: "prefer_not",
            label: "Prefer not to do this task",
            icon: <XCircle className="h-4 w-4 text-red-600" />,
          },
        ])}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        🛌 Mobility & Safety Support
      </h3>
      <div className="space-y-6">
        {renderCompetencyQuestion(
          "safe_positioning",
          "Positioning clients safely (bed/chair)",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "transfer_assistance",
          "Helping with transfers (e.g. Hoyer lift)",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        🍽️ Kitchen Care & Cleaning
      </h3>
      <div className="space-y-6">
        {renderCompetencyQuestion(
          "dish_washing",
          "Washing dishes (by hand or machine)",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "kitchen_cleaning",
          "Wiping kitchen counters and appliances",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        🍲 Meal Preparation & Food Handling
      </h3>
      <div className="space-y-6">
        {renderCompetencyQuestion(
          "basic_meal_cooking",
          "Cooking simple meals",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "cultural_meals",
          "Cooking vegetarian or cultural meals",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "meat_handling",
          "Handling meat for meals (pork/beef/chicken)",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
      </div>
    </div>
  );

  const renderStep7Combined = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        🧹 Housekeeping & Tidying
      </h3>
      <div className="space-y-6">
        {renderCompetencyQuestion("bed_linen_changing", "Changing bed sheets", [
          {
            value: "comfortable",
            label: "Comfortable performing",
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          },
          {
            value: "support_needed",
            label: "Would like support/training",
            icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
          },
          {
            value: "prefer_not",
            label: "Prefer not to do this task",
            icon: <XCircle className="h-4 w-4 text-red-600" />,
          },
        ])}
        {renderCompetencyQuestion(
          "bathroom_cleaning",
          "Cleaning the bathroom",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "dusting_cleaning",
          "Dusting and surface cleaning",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "floor_cleaning",
          "Cleaning floors (sweep/mop/vacuum)",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "surface_cleaning",
          "Wiping kitchen counters and appliances",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion("laundry_care", "Doing laundry", [
          {
            value: "comfortable",
            label: "Comfortable performing",
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          },
          {
            value: "support_needed",
            label: "Would like support/training",
            icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
          },
          {
            value: "prefer_not",
            label: "Prefer not to do this task",
            icon: <XCircle className="h-4 w-4 text-red-600" />,
          },
        ])}
        {renderCompetencyQuestion(
          "organizing_items",
          "Tidying and organizing items",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "safety_accessibility",
          "Making items accessible for safety",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
      </div>
    </div>
  );

  const renderStep8Combined = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        🧪 Health & Safety Practices
      </h3>
      <div className="space-y-6">
        {renderCompetencyQuestion(
          "proper_handwashing",
          "Washing hands properly",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion("glove_usage", "Using gloves safely", [
          {
            value: "comfortable",
            label: "Comfortable performing",
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          },
          {
            value: "support_needed",
            label: "Would like support/training",
            icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
          },
          {
            value: "prefer_not",
            label: "Prefer not to do this task",
            icon: <XCircle className="h-4 w-4 text-red-600" />,
          },
        ])}
        {renderCompetencyQuestion("trash_removal", "Taking out trash", [
          {
            value: "comfortable",
            label: "Comfortable performing",
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          },
          {
            value: "support_needed",
            label: "Would like support/training",
            icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
          },
          {
            value: "prefer_not",
            label: "Prefer not to do this task",
            icon: <XCircle className="h-4 w-4 text-red-600" />,
          },
        ])}
        {renderCompetencyQuestion(
          "recycling_sorting",
          "Handling recycling and compost",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "working_with_cats",
          "Okay working around cats",
          [
            {
              value: "comfortable",
              label: "Comfortable",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "not_comfortable",
              label: "Not comfortable",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "working_with_dogs",
          "Okay working around dogs",
          [
            {
              value: "comfortable",
              label: "Comfortable",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "not_comfortable",
              label: "Not comfortable",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "memory_prompts",
          "Providing memory prompts/reminders",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "dementia_support",
          "Supporting clients with dementia",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "medication_reminders",
          "Assisting with reminders (non-administration)",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "fall_risk_identification",
          "Identifying fall risks",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "mobility_change_reporting",
          "Reporting changes in gait or mobility",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "translation_apps",
          "Using translation apps / non-verbal cues",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "speech_hearing_support",
          "Understanding speech or hearing impairment needs",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "companionship_support",
          "Supporting client mood (companionship, anxiety, grief)",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {renderCompetencyQuestion(
          "distress_recognition",
          "Recognizing signs of isolation or distress",
          [
            {
              value: "comfortable",
              label: "Comfortable performing",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            },
            {
              value: "support_needed",
              label: "Would like support/training",
              icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
            },
            {
              value: "prefer_not",
              label: "Prefer not to do this task",
              icon: <XCircle className="h-4 w-4 text-red-600" />,
            },
          ]
        )}
        {/* Special Notes */}
        <div>
          <Label
            htmlFor="specialNotes"
            className="text-base font-semibold text-gray-900"
          >
            Feel free to share any caregiving tasks you&apos;d like more support
            with, or anything unique about your caregiving style.
          </Label>
          <Textarea
            id="specialNotes"
            value={assessmentData.special_notes}
            onChange={(e) =>
              updateAssessmentData("special_notes", e.target.value)
            }
            placeholder="Share any additional thoughts, training needs, or unique aspects of your caregiving approach..."
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      case 7:
        return renderStep7Combined();
      case 8:
        return renderStep8Combined();
      default:
        return <div>Step {currentStep}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-blue-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-lg sm:text-2xl text-center text-blue-900">
              Haven at Home - PSW Competency Assessment
            </CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-medium">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="font-medium text-blue-600">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="w-full h-3" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6 bg-white p-4 sm:p-6">
            {/* Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-900 text-sm leading-relaxed">
                This form helps us get to know your strengths and the areas
                where you&apos;d appreciate more support. It&apos;s not a test —
                we&apos;re here to learn with you, grow together, and build a
                respectful working relationship. Answer what feels true to your
                experience.
              </p>
            </div>

            {renderStep()}

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 order-2 sm:order-1"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="bg-blue-600 hover:bg-blue-700 text-white order-1 sm:order-2"
                >
                  {currentStep === 1
                    ? "Personal Information"
                    : currentStep === 2
                    ? "Personal Care & Hygiene"
                    : currentStep === 3
                    ? "Bowel & Bladder Support"
                    : currentStep === 4
                    ? "Mobility & Safety Support"
                    : currentStep === 5
                    ? "Kitchen Care & Cleaning"
                    : currentStep === 6
                    ? "Meal Preparation & Food Handling"
                    : currentStep === 7
                    ? "Housekeeping, Laundry & Organizing"
                    : "Health, Safety & Support Skills"}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={submitAssessment}
                  disabled={isSubmitting || !validateStep(currentStep)}
                  className="bg-green-600 hover:bg-green-700 text-white order-1 sm:order-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit Assessment"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PSWCompetencyAssessment() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4 sm:py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-100 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading assessment...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <PSWCompetencyAssessmentContent />
    </Suspense>
  );
}
