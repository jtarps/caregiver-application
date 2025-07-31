"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  X,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Types for form data
interface WorkExperience {
  employerName: string;
  employerPhone: string;
  isCurrentlyWorking: boolean;
  mayContact: boolean;
  jobTitle: string;
  duration: string;
  reasonForLeaving: string;
}

interface ApplicationFormData {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Step 2: Upload Documents
  resume: File | null;
  cprCertificate: File | null;
  pswCertificate: File | null;
  additionalCertifications: File | null;

  // Step 3: Quick Eligibility Check
  legallyEligibleCanada: boolean;
  age18OrOlder: boolean;
  hasDriverLicense: boolean;
  hasReliableCar: boolean;
  canLiveInCare: boolean;
  isInternationalStudent: boolean;
  previouslyApplied: boolean;
  canPerformDuties: boolean;

  // Step 4: Qualifications
  hasPSWCertificate: boolean;
  completedPlacementHours: boolean;
  hasCPRFirstAid: boolean;
  isCanadianRN: boolean;
  isRNStudent: boolean;
  isForeignRN: boolean;

  // Step 5: Criminal & Physical Fitness
  criminalConviction5Years: boolean;
  criminalConvictionDetails: string;
  physicallyCapable: boolean;
  physicalLimitations: string;

  // Step 6: Languages
  languages: string[];

  // Step 7: Work Experience
  hasCaregivingExperience: boolean;
  workExperience: WorkExperience[];

  // Step 8: Availability
  workTypes: string[];
  availableDays: string[];
  availableMornings: boolean;
  availableAfternoons: boolean;
  availableEvenings: boolean;
  availableOvernight: boolean;
  availableWeekends: boolean;
  availableHolidays: boolean;
  preferredShiftLength: string;
  startDate: string;
  startDateOther: string;
  hoursPerWeek: string;
  preferredLocations: string[];

  // Final Declarations
  certificationTruthfulness: boolean;
  authorizationBackgroundCheck: boolean;
  understandingAtWillEmployment: boolean;
  acknowledgmentApplicationValidity: boolean;
  digitalSignature: string;
  signatureDate: string;
}

const initialFormData: ApplicationFormData = {
  // Step 1: Basic Info
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  // Step 2: Upload Documents
  resume: null,
  cprCertificate: null,
  pswCertificate: null,
  additionalCertifications: null,

  // Step 3: Quick Eligibility Check
  legallyEligibleCanada: false,
  age18OrOlder: false,
  hasDriverLicense: false,
  hasReliableCar: false,
  canLiveInCare: false,
  isInternationalStudent: false,
  previouslyApplied: false,
  canPerformDuties: false,

  // Step 4: Qualifications
  hasPSWCertificate: false,
  completedPlacementHours: false,
  hasCPRFirstAid: false,
  isCanadianRN: false,
  isRNStudent: false,
  isForeignRN: false,

  // Step 5: Criminal & Physical Fitness
  criminalConviction5Years: false,
  criminalConvictionDetails: "",
  physicallyCapable: false,
  physicalLimitations: "",

  // Step 6: Languages
  languages: [],

  // Step 7: Work Experience
  hasCaregivingExperience: false,
  workExperience: [],

  // Step 8: Availability
  workTypes: [],
  availableDays: [],
  availableMornings: false,
  availableAfternoons: false,
  availableEvenings: false,
  availableOvernight: false,
  availableWeekends: false,
  availableHolidays: false,
  preferredShiftLength: "",
  startDate: "",
  startDateOther: "",
  hoursPerWeek: "",
  preferredLocations: [],

  // Final Declarations
  certificationTruthfulness: false,
  authorizationBackgroundCheck: false,
  understandingAtWillEmployment: false,
  acknowledgmentApplicationValidity: false,
  digitalSignature: "",
  signatureDate: "",
};

const documentTypes = [
  { key: "driversLicense", label: "Driver's License (Front + License Number)" },
  { key: "workPermit", label: "Work Permit (if applicable)" },
  { key: "pswCertificate", label: "PSW Certificate/CNO/Proof of Education" },
  { key: "cprFirstAid", label: "Valid CPR and First Aid Certification" },
  { key: "vulnerableSectorCheck", label: "Valid Vulnerable Sector Check" },
  { key: "photo", label: "Photo with White Background" },
  { key: "resume", label: "Updated Resume" },
  { key: "immunizationRecords", label: "Immunization/Vaccination Records" },
  { key: "directDeposit", label: "Direct Deposit Authorization/Void Check" },
  { key: "sinDocumentation", label: "SIN Documentation" },
];

export default function MultiStepApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] =
    useState<ApplicationFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string>("");
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [rawCertifications, setRawCertifications] = useState<string>("");
  const [rawSpecializations, setRawSpecializations] = useState<string>("");
  const [rawLanguages, setRawLanguages] = useState<string>("");
  const router = useRouter();

  // Generate unique application ID when component mounts
  React.useEffect(() => {
    const generateUniqueId = () => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const sessionId = Math.random().toString(36).substring(2, 8);
      return `haven_${timestamp}_${randomStr}_${sessionId}`;
    };

    const id = generateUniqueId();
    setApplicationId(id);
  }, []);

  const totalSteps = 8;
  const progress = Math.min((currentStep / totalSteps) * 100, 100); // Ensure it doesn't exceed 100%

  // Debug logging
  console.log(
    `Current step: ${currentStep}, Total steps: ${totalSteps}, Progress: ${progress}%`
  );

  const updateFormData = (field: keyof ApplicationFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          employerName: "",
          employerPhone: "",
          isCurrentlyWorking: false,
          mayContact: false,
          jobTitle: "",
          duration: "",
          reasonForLeaving: "",
        },
      ],
    }));
  };

  const updateWorkExperience = (
    index: number,
    field: keyof WorkExperience,
    value: string | boolean
  ) => {
    const updated = [...formData.workExperience];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("workExperience", updated);
  };

  const removeWorkExperience = (index: number) => {
    const updated = formData.workExperience.filter((_, i) => i !== index);
    updateFormData("workExperience", updated);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone
        );
      case 2:
        return !!formData.resume; // Resume is required
      case 3:
        return !!(
          formData.legallyEligibleCanada &&
          formData.age18OrOlder &&
          formData.canPerformDuties
        );
      case 4:
        return true; // All qualifications are optional
      case 5:
        return true; // Criminal and physical fitness are required but can be "no"
      case 6:
        return formData.languages.length > 0; // At least one language required
      case 7:
        return true; // Work experience is optional
      case 8:
        return !!(
          formData.workTypes.length > 0 &&
          formData.availableDays.length > 0 &&
          formData.startDate &&
          formData.hoursPerWeek &&
          formData.certificationTruthfulness &&
          formData.authorizationBackgroundCheck &&
          formData.understandingAtWillEmployment &&
          formData.acknowledgmentApplicationValidity &&
          formData.digitalSignature &&
          formData.signatureDate
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submitApplication = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Additional validation for final submission
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error("Please complete all required personal information");
      return;
    }

    // Ensure application ID is set
    if (!applicationId) {
      toast.error(
        "Application ID not ready. Please refresh the page and try again."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        application_id: applicationId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        
        // Step 3: Quick Eligibility Check
        legally_eligible_canada: formData.legallyEligibleCanada,
        age_18_or_older: formData.age18OrOlder,
        has_driver_license: formData.hasDriverLicense,
        has_reliable_car: formData.hasReliableCar,
        can_live_in_care: formData.canLiveInCare,
        is_international_student: formData.isInternationalStudent,
        previously_applied: formData.previouslyApplied,
        can_perform_duties: formData.canPerformDuties,

        // Step 4: Qualifications
        has_psw_certificate: formData.hasPSWCertificate,
        completed_placement_hours: formData.completedPlacementHours,
        has_cpr_first_aid: formData.hasCPRFirstAid,
        is_canadian_rn: formData.isCanadianRN,
        is_rn_student: formData.isRNStudent,
        is_foreign_rn: formData.isForeignRN,

        // Step 5: Criminal & Physical Fitness
        criminal_conviction_5_years: formData.criminalConviction5Years,
        criminal_conviction_details: formData.criminalConvictionDetails,
        physically_capable: formData.physicallyCapable,
        physical_limitations: formData.physicalLimitations,

        // Step 6: Languages
        languages: formData.languages,

        // Step 7: Work Experience
        has_caregiving_experience: formData.hasCaregivingExperience,
        work_experience: formData.workExperience,

        // Step 8: Availability
        work_types: formData.workTypes,
        available_days: formData.availableDays,
        available_mornings: formData.availableMornings,
        available_afternoons: formData.availableAfternoons,
        available_evenings: formData.availableEvenings,
        available_overnight: formData.availableOvernight,
        available_weekends: formData.availableWeekends,
        available_holidays: formData.availableHolidays,
        preferred_shift_length: formData.preferredShiftLength,
        start_date: formData.startDate,
        start_date_other: formData.startDateOther,
        hours_per_week: formData.hoursPerWeek,
        preferred_locations: formData.preferredLocations,

        // Final Declarations
        certification_truthfulness: formData.certificationTruthfulness,
        authorization_background_check: formData.authorizationBackgroundCheck,
        understanding_at_will_employment: formData.understandingAtWillEmployment,
        acknowledgment_application_validity: formData.acknowledgmentApplicationValidity,
        digital_signature: formData.digitalSignature,
        signature_date: formData.signatureDate,
        status: "pending",
      };

      console.log("Submitting application with ID:", applicationId);
      console.log("Application data:", applicationData);

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
        .from("caregiver_applications")
        .insert([applicationData]);

      if (error) {
        console.error("Database error details:", error);

        // Handle specific error cases
        if (error.code === "23505" || error.code === "409") {
          if (
            error.message?.includes("email") ||
            error.details?.includes("email")
          ) {
            toast.error(
              "An application with this email address already exists. Please use a different email or contact us if you need to update your application."
            );
          } else if (
            error.message?.includes("application_id") ||
            error.details?.includes("application_id")
          ) {
            // Generate a new application ID and retry
            const generateNewId = () => {
              const timestamp = Date.now();
              const randomStr = Math.random().toString(36).substring(2, 15);
              const sessionId = Math.random().toString(36).substring(2, 8);
              return `haven_${timestamp}_${randomStr}_${sessionId}`;
            };

            const newId = generateNewId();
            setApplicationId(newId);
            toast.error(
              "Application ID conflict. Generated new ID. Please try submitting again."
            );
          } else {
            toast.error(
              "Duplicate entry detected. Please check your information and try again."
            );
          }
        } else if (error.code === "23514") {
          toast.error(
            "Invalid data provided. Please check all required fields."
          );
        } else if (error.code === "42501") {
          toast.error(
            "Permission denied. Please contact support if this issue persists."
          );
        } else {
          toast.error(`Submission failed: ${error.message || "Unknown error"}`);
        }

        return; // Don't throw error, just return to prevent further execution
      }

      // For development/testing, show success even if database fails
      if (process.env.NODE_ENV === "development" && error) {
        console.log("Development mode: Showing success despite database error");
        toast.success(
          "Application submitted successfully! (Development mode - database error ignored)"
        );
        setFormData(initialFormData);
        setCurrentStep(1);
        setRawCertifications("");
        setRawSpecializations("");
        setRawLanguages("");
        return;
      }

      toast.success(
        "Application submitted successfully! We'll be in touch soon."
      );
      setFormData(initialFormData);
      setCurrentStep(1);
      setRawCertifications("");
      setRawSpecializations("");
      setRawLanguages("");
      router.push(`/psw-assessment?applicationId=${applicationId}`);
    } catch (error: unknown) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Basic Info
      </h3>
      <p className="text-gray-600 text-sm sm:text-base">
        Please provide your basic information. All fields marked with an
        asterisk (*) are required.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
            placeholder="First Name"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            placeholder="Last Name"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="email@example.com"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            placeholder="(555) 123-4567"
            required
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Upload Documents
      </h3>
      <p className="text-gray-600 text-sm">
        Please upload your documents. Resume is required, other documents are optional.
      </p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="resume">Upload Resume *</Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) updateFormData("resume", file);
            }}
            className="mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Accepted formats: PDF, DOC, DOCX
          </p>
        </div>

        <div>
          <Label htmlFor="cprCertificate">Upload CPR/First Aid Certificate (Optional)</Label>
          <Input
            id="cprCertificate"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) updateFormData("cprCertificate", file);
            }}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="pswCertificate">Upload PSW or other Caregiving Certificate (Optional)</Label>
          <Input
            id="pswCertificate"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) updateFormData("pswCertificate", file);
            }}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="additionalCertifications">Upload Additional Certifications (Optional)</Label>
          <Input
            id="additionalCertifications"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) updateFormData("additionalCertifications", file);
            }}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Quick Eligibility Check
      </h3>
      <p className="text-gray-600 text-sm">
        Please answer these questions to help us determine your eligibility.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="legallyEligibleCanada"
            checked={formData.legallyEligibleCanada}
            onCheckedChange={(checked) =>
              updateFormData("legallyEligibleCanada", checked)
            }
          />
          <Label htmlFor="legallyEligibleCanada">
            Are you legally eligible to work in Canada?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="age18OrOlder"
            checked={formData.age18OrOlder}
            onCheckedChange={(checked) =>
              updateFormData("age18OrOlder", checked)
            }
          />
          <Label htmlFor="age18OrOlder">
            Are you 18 years of age or older?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasDriverLicense"
            checked={formData.hasDriverLicense}
            onCheckedChange={(checked) =>
              updateFormData("hasDriverLicense", checked)
            }
          />
          <Label htmlFor="hasDriverLicense">
            Do you have a valid driver's license?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasReliableCar"
            checked={formData.hasReliableCar}
            onCheckedChange={(checked) =>
              updateFormData("hasReliableCar", checked)
            }
          />
          <Label htmlFor="hasReliableCar">
            Do you have access to a reliable car for work?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="availableWeekends"
            checked={formData.availableWeekends}
            onCheckedChange={(checked) =>
              updateFormData("availableWeekends", checked)
            }
          />
          <Label htmlFor="availableWeekends">
            Are you available to work weekends?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="canLiveInCare"
            checked={formData.canLiveInCare}
            onCheckedChange={(checked) =>
              updateFormData("canLiveInCare", checked)
            }
          />
          <Label htmlFor="canLiveInCare">
            Are you able to work as a live-in caregiver?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isInternationalStudent"
            checked={formData.isInternationalStudent}
            onCheckedChange={(checked) =>
              updateFormData("isInternationalStudent", checked)
            }
          />
          <Label htmlFor="isInternationalStudent">
            Are you currently enrolled as an international student?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="previouslyApplied"
            checked={formData.previouslyApplied}
            onCheckedChange={(checked) =>
              updateFormData("previouslyApplied", checked)
            }
          />
          <Label htmlFor="previouslyApplied">
            Have you applied with us before?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="canPerformDuties"
            checked={formData.canPerformDuties}
            onCheckedChange={(checked) =>
              updateFormData("canPerformDuties", checked)
            }
          />
          <Label htmlFor="canPerformDuties">
            Are you able to perform the essential duties of this role without accommodations?
          </Label>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Qualifications
      </h3>
      <p className="text-gray-600 text-sm">
        Please indicate your qualifications and certifications.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasPSWCertificate"
            checked={formData.hasPSWCertificate}
            onCheckedChange={(checked) =>
              updateFormData("hasPSWCertificate", checked)
            }
          />
          <Label htmlFor="hasPSWCertificate">
            Do you have a PSW certificate?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="completedPlacementHours"
            checked={formData.completedPlacementHours}
            onCheckedChange={(checked) =>
              updateFormData("completedPlacementHours", checked)
            }
          />
          <Label htmlFor="completedPlacementHours">
            If you're a PSW student, have you completed placement hours?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasCPRFirstAid"
            checked={formData.hasCPRFirstAid}
            onCheckedChange={(checked) =>
              updateFormData("hasCPRFirstAid", checked)
            }
          />
          <Label htmlFor="hasCPRFirstAid">
            Do you have CPR/First Aid (Level C or BLS)?
          </Label>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">Nursing-related:</h4>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCanadianRN"
                checked={formData.isCanadianRN}
                onCheckedChange={(checked) =>
                  updateFormData("isCanadianRN", checked)
                }
              />
              <Label htmlFor="isCanadianRN">
                Are you a Canadian-qualified RN/RPN and registered with the CNO?
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRNStudent"
                checked={formData.isRNStudent}
                onCheckedChange={(checked) =>
                  updateFormData("isRNStudent", checked)
                }
              />
              <Label htmlFor="isRNStudent">
                Are you an RN/RPN student?
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isForeignRN"
                checked={formData.isForeignRN}
                onCheckedChange={(checked) =>
                  updateFormData("isForeignRN", checked)
                }
              />
              <Label htmlFor="isForeignRN">
                Are you a foreign-qualified registered nurse?
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Criminal & Physical Fitness
      </h3>
      <p className="text-gray-600 text-sm">
        Please answer these questions honestly. This information is confidential.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="criminalConviction5Years"
            checked={formData.criminalConviction5Years}
            onCheckedChange={(checked) =>
              updateFormData("criminalConviction5Years", checked)
            }
          />
          <Label htmlFor="criminalConviction5Years">
            Have you been convicted of a crime in the past 5 years?
          </Label>
        </div>

        {formData.criminalConviction5Years && (
          <div>
            <Label htmlFor="criminalConvictionDetails">
              Please provide details...
            </Label>
            <Textarea
              id="criminalConvictionDetails"
              value={formData.criminalConvictionDetails}
              onChange={(e) =>
                updateFormData("criminalConvictionDetails", e.target.value)
              }
              placeholder="Please provide details about the conviction..."
              className="mt-1"
              rows={3}
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="physicallyCapable"
            checked={formData.physicallyCapable}
            onCheckedChange={(checked) =>
              updateFormData("physicallyCapable", checked)
            }
          />
          <Label htmlFor="physicallyCapable">
            Are you physically capable of performing caregiving duties?
          </Label>
        </div>

        {!formData.physicallyCapable && (
          <div>
            <Label htmlFor="physicalLimitations">
              Please describe any limitations.
            </Label>
            <Textarea
              id="physicalLimitations"
              value={formData.physicalLimitations}
              onChange={(e) =>
                updateFormData("physicalLimitations", e.target.value)
              }
              placeholder="Please describe any physical limitations..."
              className="mt-1"
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Languages
      </h3>
      <p className="text-gray-600 text-sm">
        Please indicate what languages you speak.
      </p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="languages">What languages do you speak?</Label>
          <Textarea
            id="languages"
            value={formData.languages.join(", ")}
            onChange={(e) => {
              const value = e.target.value;
              const items = value.split(",").map((item) => item.trim());
              updateFormData("languages", items);
            }}
            placeholder="e.g., English, French, Spanish (separate with commas)"
            className="mt-1"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate languages with commas
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Work Experience
      </h3>
      <p className="text-gray-600 text-sm">
        Please tell us about your caregiving experience.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasCaregivingExperience"
            checked={formData.hasCaregivingExperience}
            onCheckedChange={(checked) =>
              updateFormData("hasCaregivingExperience", checked)
            }
          />
          <Label htmlFor="hasCaregivingExperience">
            Have you worked as a caregiver before?
          </Label>
        </div>

        {formData.hasCaregivingExperience && (
          <div className="space-y-6">
            {formData.workExperience.map((experience, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Caregiving Job #{index + 1}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeWorkExperience(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Employer Name *</Label>
                      <Input
                        value={experience.employerName}
                        onChange={(e) =>
                          updateWorkExperience(
                            index,
                            "employerName",
                            e.target.value
                          )
                        }
                        placeholder="Employer name"
                        required
                      />
                    </div>
                    <div>
                      <Label>Employer Phone *</Label>
                      <Input
                        value={experience.employerPhone}
                        onChange={(e) =>
                          updateWorkExperience(
                            index,
                            "employerPhone",
                            e.target.value
                          )
                        }
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`isCurrentlyWorking-${index}`}
                        checked={experience.isCurrentlyWorking}
                        onCheckedChange={(checked) =>
                          updateWorkExperience(
                            index,
                            "isCurrentlyWorking",
                            checked
                          )
                        }
                      />
                      <Label htmlFor={`isCurrentlyWorking-${index}`}>
                        Are you currently working here?
                      </Label>
                    </div>
                    
                    {experience.isCurrentlyWorking && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`mayContact-${index}`}
                          checked={experience.mayContact}
                          onCheckedChange={(checked) =>
                            updateWorkExperience(
                              index,
                              "mayContact",
                              checked
                            )
                          }
                        />
                        <Label htmlFor={`mayContact-${index}`}>
                          May we contact them?
                        </Label>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title *</Label>
                      <Select
                        value={experience.jobTitle}
                        onValueChange={(value) =>
                          updateWorkExperience(index, "jobTitle", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select job title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PSW">PSW</SelectItem>
                          <SelectItem value="Caregiver">Caregiver</SelectItem>
                          <SelectItem value="Nursing Assistant">Nursing Assistant</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Duration *</Label>
                      <Input
                        value={experience.duration}
                        onChange={(e) =>
                          updateWorkExperience(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Jan 2022 – Apr 2023"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Reason for Leaving</Label>
                    <Input
                      value={experience.reasonForLeaving}
                      onChange={(e) =>
                        updateWorkExperience(
                          index,
                          "reasonForLeaving",
                          e.target.value
                        )
                      }
                      placeholder="Reason for leaving"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {formData.workExperience.length < 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={addWorkExperience}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Caregiving Job
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Availability
      </h3>
      <p className="text-gray-600 text-sm">
        Please tell us about your availability and preferences.
      </p>
      
      <div className="space-y-6">
        <div>
          <Label>What type of work are you looking for?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {["Full-Time", "Part-Time", "Casual / On-Call", "Overnight Shifts", "Live-In Care"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`workType-${type}`}
                  checked={formData.workTypes.includes(type)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...formData.workTypes, type]
                      : formData.workTypes.filter((t) => t !== type);
                    updateFormData("workTypes", updated);
                  }}
                />
                <Label htmlFor={`workType-${type}`}>{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>What days are you available to work?</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`availableDay-${day}`}
                  checked={formData.availableDays.includes(day)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...formData.availableDays, day]
                      : formData.availableDays.filter((d) => d !== day);
                    updateFormData("availableDays", updated);
                  }}
                />
                <Label htmlFor={`availableDay-${day}`}>{day}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Are you available to work:</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {[
              { key: "availableMornings", label: "Mornings?" },
              { key: "availableAfternoons", label: "Afternoons?" },
              { key: "availableEvenings", label: "Evenings?" },
              { key: "availableOvernight", label: "Overnight?" },
              { key: "availableWeekends", label: "Weekends?" },
              { key: "availableHolidays", label: "Holidays?" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={formData[key as keyof ApplicationFormData] as boolean}
                  onCheckedChange={(checked) =>
                    updateFormData(key as keyof ApplicationFormData, checked)
                  }
                />
                <Label htmlFor={key}>{label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Preferred shift length?</Label>
          <Select
            value={formData.preferredShiftLength}
            onValueChange={(value) => updateFormData("preferredShiftLength", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select shift length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2-4 hours">2–4 hours</SelectItem>
              <SelectItem value="4-6 hours">4–6 hours</SelectItem>
              <SelectItem value="6-8 hours">6–8 hours</SelectItem>
              <SelectItem value="8-12 hours">8–12 hours</SelectItem>
              <SelectItem value="No preference">No preference</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>When can you start?</Label>
          <Select
            value={formData.startDate}
            onValueChange={(value) => updateFormData("startDate", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select start date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Immediately">Immediately</SelectItem>
              <SelectItem value="In 1 week">In 1 week</SelectItem>
              <SelectItem value="In 2 weeks">In 2 weeks</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          {formData.startDate === "Other" && (
            <Input
              value={formData.startDateOther}
              onChange={(e) => updateFormData("startDateOther", e.target.value)}
              placeholder="Please specify when you can start"
              className="mt-2"
            />
          )}
        </div>

        <div>
          <Label>Total hours per week you're available?</Label>
          <Select
            value={formData.hoursPerWeek}
            onValueChange={(value) => updateFormData("hoursPerWeek", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select hours per week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Less than 10">Less than 10</SelectItem>
              <SelectItem value="10-20">10–20</SelectItem>
              <SelectItem value="20-30">20–30</SelectItem>
              <SelectItem value="30+">30+</SelectItem>
              <SelectItem value="No preference">No preference</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Preferred Work Locations</Label>
          <Textarea
            value={formData.preferredLocations.join(", ")}
            onChange={(e) => {
              const value = e.target.value;
              const items = value.split(",").map((item) => item.trim());
              updateFormData("preferredLocations", items);
            }}
            placeholder="e.g., Toronto, Etobicoke, North York (separate with commas)"
            className="mt-1"
            rows={2}
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate locations with commas
          </p>
        </div>

        <Separator className="my-6" />
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-blue-900">Final Declarations</h4>
          <p className="text-gray-600 text-sm">
            Please read and acknowledge the following statements.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="certificationTruthfulness"
                checked={formData.certificationTruthfulness}
                onCheckedChange={(checked) =>
                  updateFormData("certificationTruthfulness", checked)
                }
              />
              <Label htmlFor="certificationTruthfulness" className="text-sm">
                I certify that all information provided in this application is true and complete to the best of my knowledge.
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="authorizationBackgroundCheck"
                checked={formData.authorizationBackgroundCheck}
                onCheckedChange={(checked) =>
                  updateFormData("authorizationBackgroundCheck", checked)
                }
              />
              <Label htmlFor="authorizationBackgroundCheck" className="text-sm">
                I authorize Haven at Home to conduct a background check and verify my qualifications.
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="understandingAtWillEmployment"
                checked={formData.understandingAtWillEmployment}
                onCheckedChange={(checked) =>
                  updateFormData("understandingAtWillEmployment", checked)
                }
              />
              <Label htmlFor="understandingAtWillEmployment" className="text-sm">
                I understand that employment is at-will and can be terminated at any time by either party.
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="acknowledgmentApplicationValidity"
                checked={formData.acknowledgmentApplicationValidity}
                onCheckedChange={(checked) =>
                  updateFormData("acknowledgmentApplicationValidity", checked)
                }
              />
              <Label htmlFor="acknowledgmentApplicationValidity" className="text-sm">
                I acknowledge that this application is valid for 90 days from the date of submission.
              </Label>
            </div>

            <div>
              <Label htmlFor="digitalSignature">Digital Signature *</Label>
              <Input
                id="digitalSignature"
                value={formData.digitalSignature}
                onChange={(e) => updateFormData("digitalSignature", e.target.value)}
                placeholder="Type your full name to sign"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="signatureDate">Date *</Label>
              <Input
                id="signatureDate"
                type="date"
                value={formData.signatureDate}
                onChange={(e) => updateFormData("signatureDate", e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>
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
        return renderStep7();
      case 8:
        return renderStep8();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-blue-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold">Haven at Home</h2>
              <p className="text-blue-100 text-sm sm:text-base">
                Caregiver Application Form
              </p>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm text-blue-100">
                <span className="font-medium">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="font-medium">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="w-full h-3" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6 bg-white p-4 sm:p-6">
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
                  className="flex-1 sm:flex-none order-2 sm:order-1"
                >
                  {currentStep === 1 && "Upload Documents"}
                  {currentStep === 2 && "Quick Eligibility Check"}
                  {currentStep === 3 && "Qualifications"}
                  {currentStep === 4 && "Criminal & Physical Fitness"}
                  {currentStep === 5 && "Languages"}
                  {currentStep === 6 && "Work Experience"}
                  {currentStep === 7 && "Availability"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none order-2 sm:order-1"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
