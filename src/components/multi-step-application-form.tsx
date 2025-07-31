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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Upload, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Types for form data
interface EmploymentHistory {
  companyName: string;
  startDate: string;
  endDate: string;
  jobTitle: string;
  responsibilities: string;
  reasonForLeaving: string;
}

interface ProfessionalReference {
  fullName: string;
  phone: string;
  email: string;
  positionAndCompany: string;
}

interface DocumentUpload {
  type: string;
  file: File;
  url?: string;
}

interface ApplicationFormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  socialInsuranceNumber: string;
  hasDriverLicense: boolean;
  legallyEligibleEmployment: boolean;
  weeklyAvailability: number;
  previouslyApplied: boolean;
  sourceOfInformation: string;

  // Step 2: Education & Experience
  completedProgram: string;
  schoolAttended: string;
  experienceYears: number;
  certifications: string[];
  specializations: string[];
  languages: string[];

  // Step 3: Employment History
  employmentHistory: EmploymentHistory[];

  // Step 4: Professional References
  professionalReferences: ProfessionalReference[];

  // Step 5: Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;

  // Step 6: General & Legal
  criminalConvictionLast5Years: boolean;
  criminalConvictionDetails: string;
  abilityPerformJobRequirements: boolean;
  abilityPerformDetails: string;

  // Step 7: Credentials & Skills
  specializedSkills: string;
  operatedEquipment: string;
  hourlyRateExpectation: number;
  whyInterested: string;
  previousExperience: string;

  // Step 8: Document Uploads
  documents: DocumentUpload[];

  // Step 9: Final Declaration
  certificationTruthfulness: boolean;
  authorizationBackgroundCheck: boolean;
  understandingAtWillEmployment: boolean;
  acknowledgmentApplicationValidity: boolean;
  digitalSignature: string;
  signatureDate: string;
}

const initialFormData: ApplicationFormData = {
  // Step 1: Personal Information
  firstName: "",
  lastName: "",
  address: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  socialInsuranceNumber: "",
  hasDriverLicense: false,
  legallyEligibleEmployment: false,
  weeklyAvailability: 0,
  previouslyApplied: false,
  sourceOfInformation: "",

  // Step 2: Education & Experience
  completedProgram: "",
  schoolAttended: "",
  experienceYears: 0,
  certifications: [],
  specializations: [],
  languages: [],

  // Step 3: Employment History
  employmentHistory: [],

  // Step 4: Professional References
  professionalReferences: [],

  // Step 5: Emergency Contact
  emergencyContactName: "",
  emergencyContactPhone: "",

  // Step 6: General & Legal
  criminalConvictionLast5Years: false,
  criminalConvictionDetails: "",
  abilityPerformJobRequirements: false,
  abilityPerformDetails: "",

  // Step 7: Credentials & Skills
  specializedSkills: "",
  operatedEquipment: "",
  hourlyRateExpectation: 0,
  whyInterested: "",
  previousExperience: "",

  // Step 8: Document Uploads
  documents: [],

  // Step 9: Final Declaration
  certificationTruthfulness: false,
  authorizationBackgroundCheck: false,
  understandingAtWillEmployment: false,
  acknowledgmentApplicationValidity: false,
  digitalSignature: "",
  signatureDate: "",
};

const sourceOptions = [
  "Website",
  "Social Media",
  "Job Board",
  "Referral",
  "Advertisement",
  "Other",
];

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

  const totalSteps = 9;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof ApplicationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const regenerateApplicationId = () => {
    const generateNewId = () => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const sessionId = Math.random().toString(36).substring(2, 8);
      return `haven_${timestamp}_${randomStr}_${sessionId}`;
    };

    const newId = generateNewId();
    setApplicationId(newId);
    toast.success("Application ID regenerated successfully");
  };

  const addEmploymentHistory = () => {
    const newEmployment: EmploymentHistory = {
      companyName: "",
      startDate: "",
      endDate: "",
      jobTitle: "",
      responsibilities: "",
      reasonForLeaving: "",
    };
    updateFormData("employmentHistory", [
      ...formData.employmentHistory,
      newEmployment,
    ]);
  };

  const updateEmploymentHistory = (
    index: number,
    field: keyof EmploymentHistory,
    value: string
  ) => {
    const updated = [...formData.employmentHistory];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("employmentHistory", updated);
  };

  const removeEmploymentHistory = (index: number) => {
    const updated = formData.employmentHistory.filter((_, i) => i !== index);
    updateFormData("employmentHistory", updated);
  };

  const addProfessionalReference = () => {
    const newReference: ProfessionalReference = {
      fullName: "",
      phone: "",
      email: "",
      positionAndCompany: "",
    };
    updateFormData("professionalReferences", [
      ...formData.professionalReferences,
      newReference,
    ]);
  };

  const updateProfessionalReference = (
    index: number,
    field: keyof ProfessionalReference,
    value: string
  ) => {
    const updated = [...formData.professionalReferences];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("professionalReferences", updated);
  };

  const removeProfessionalReference = (index: number) => {
    const updated = formData.professionalReferences.filter(
      (_, i) => i !== index
    );
    updateFormData("professionalReferences", updated);
  };

  const handleFileUpload = async (type: string, file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      toast.error("File size must be less than 2MB");
      return;
    }

    if (!applicationId) {
      toast.error("Application ID not ready. Please try again.");
      return;
    }

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `applications/${applicationId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("caregiver-documents")
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("caregiver-documents")
        .getPublicUrl(data.path);

      const newDocument: DocumentUpload = {
        type,
        file,
        url: publicUrlData.publicUrl,
      };

      updateFormData("documents", [...formData.documents, newDocument]);
      toast.success("Document uploaded successfully");
    } catch (error: unknown) {
      console.error("Error uploading file:", error);

      if (error?.statusCode === 403) {
        toast.error(
          "Upload failed: Storage permissions not configured. Please contact support."
        );
      } else if (error?.statusCode === 400) {
        toast.error(
          "Upload failed: Invalid file or file too large. Please try again."
        );
      } else {
        toast.error("Failed to upload document. Please try again.");
      }
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.address
        );
      case 2:
        return !!(
          formData.completedProgram &&
          formData.schoolAttended &&
          formData.experienceYears > 0
        );
      case 3:
        return (
          formData.employmentHistory.length > 0 &&
          formData.employmentHistory.every(
            (emp) => emp.companyName && emp.jobTitle
          )
        );
      case 4:
        return (
          formData.professionalReferences.length > 0 &&
          formData.professionalReferences.every(
            (ref) => ref.fullName && ref.phone
          )
        );
      case 5:
        return !!(
          formData.emergencyContactName && formData.emergencyContactPhone
        );
      case 6:
        return true; // Optional fields
      case 7:
        return true; // Optional fields
      case 8:
        return formData.documents.length > 0; // At least one document required
      case 9:
        return !!(
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
        application_id: applicationId, // Add the unique application ID
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: "", // Will be extracted from address
        postal_code: "", // Will be extracted from address
        date_of_birth: formData.dateOfBirth,
        social_insurance_number: formData.socialInsuranceNumber,
        has_driver_license: formData.hasDriverLicense,
        legally_eligible_employment: formData.legallyEligibleEmployment,
        weekly_availability: formData.weeklyAvailability,
        previously_applied: formData.previouslyApplied,
        source_of_information: formData.sourceOfInformation,
        completed_program: formData.completedProgram,
        school_attended: formData.schoolAttended,
        experience_years: formData.experienceYears,
        certifications: formData.certifications,
        specializations: formData.specializations,
        languages: formData.languages,
        employment_history: formData.employmentHistory,
        professional_references: formData.professionalReferences,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        criminal_conviction_last_5_years: formData.criminalConvictionLast5Years,
        criminal_conviction_details: formData.criminalConvictionDetails,
        ability_perform_job_requirements:
          formData.abilityPerformJobRequirements,
        ability_perform_details: formData.abilityPerformDetails,
        specialized_skills: formData.specializedSkills,
        operated_equipment: formData.operatedEquipment,
        hourly_rate_expectation: formData.hourlyRateExpectation,
        why_interested: formData.whyInterested,
        previous_experience: formData.previousExperience,
        documents: formData.documents.map((doc) => ({
          type: doc.type,
          url: doc.url,
          filename: doc.file.name,
          uploaded_at: new Date().toISOString(),
        })),
        certification_truthfulness: formData.certificationTruthfulness,
        authorization_background_check: formData.authorizationBackgroundCheck,
        understanding_at_will_employment:
          formData.understandingAtWillEmployment,
        acknowledgment_application_validity:
          formData.acknowledgmentApplicationValidity,
        digital_signature: formData.digitalSignature,
        signature_date: formData.signatureDate,
        status: "pending",
      };

      console.log("Submitting application with ID:", applicationId);
      console.log("Application data:", applicationData);

      // Check if Supabase is configured
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        toast.error("Database not configured. Please contact support.");
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
        Personal Information
      </h3>
      <p className="text-gray-600 text-sm sm:text-base">
        Please provide your personal information. All fields marked with an
        asterisk (*) are required.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.first_name}
            onChange={(e) => updateFormData("first_name", e.target.value)}
            placeholder="First Name"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.last_name}
            onChange={(e) => updateFormData("last_name", e.target.value)}
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
        <div className="sm:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => updateFormData("address", e.target.value)}
            placeholder="Full Address"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => updateFormData("date_of_birth", e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="sin">Social Insurance Number *</Label>
          <Input
            id="sin"
            value={formData.social_insurance_number}
            onChange={(e) => updateFormData("social_insurance_number", e.target.value)}
            placeholder="XXX-XXX-XXX"
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
        Education & Experience
      </h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="completedProgram">Completed Program *</Label>
          <Input
            id="completedProgram"
            value={formData.completedProgram}
            onChange={(e) => updateFormData("completedProgram", e.target.value)}
            placeholder="e.g., PSW Certificate, Nursing Diploma"
            required
          />
        </div>
        <div>
          <Label htmlFor="schoolAttended">School Attended *</Label>
          <Input
            id="schoolAttended"
            value={formData.schoolAttended}
            onChange={(e) => updateFormData("schoolAttended", e.target.value)}
            placeholder="Institution name"
            required
          />
        </div>
        <div>
          <Label htmlFor="experienceYears">Years of Experience *</Label>
          <Input
            id="experienceYears"
            type="number"
            min="0"
            max="50"
            value={formData.experienceYears}
            onChange={(e) =>
              updateFormData("experienceYears", parseInt(e.target.value) || 0)
            }
            placeholder="Number of years"
            required
          />
        </div>
        <div>
          <Label htmlFor="certifications">Certifications</Label>
          <Textarea
            id="certifications"
            value={rawCertifications}
            onChange={(e) => {
              const value = e.target.value;
              setRawCertifications(value);
              const items = value.split(",").map((item) => item.trim());
              updateFormData("certifications", items);
            }}
            placeholder="e.g., CPR, First Aid, PSW Certificate (separate with commas)"
          />
        </div>
        <div>
          <Label htmlFor="specializations">Specializations</Label>
          <Textarea
            id="specializations"
            value={rawSpecializations}
            onChange={(e) => {
              const value = e.target.value;
              setRawSpecializations(value);
              const items = value.split(",").map((item) => item.trim());
              updateFormData("specializations", items);
            }}
            placeholder="e.g., Dementia Care, Palliative Care, Pediatric Care (separate with commas)"
          />
        </div>
        <div>
          <Label htmlFor="languages">Languages Spoken</Label>
          <Textarea
            id="languages"
            value={rawLanguages}
            onChange={(e) => {
              const value = e.target.value;
              setRawLanguages(value);
              const items = value.split(",").map((item) => item.trim());
              updateFormData("languages", items);
            }}
            placeholder="e.g., English, French, Spanish (separate with commas)"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Employment History
      </h3>
      <div className="space-y-6">
        {formData.employmentHistory.map((employment, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Employment #{index + 1}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEmploymentHistory(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name *</Label>
                  <Input
                    value={employment.companyName}
                    onChange={(e) =>
                      updateEmploymentHistory(
                        index,
                        "companyName",
                        e.target.value
                      )
                    }
                    placeholder="Company name"
                    required
                  />
                </div>
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    value={employment.jobTitle}
                    onChange={(e) =>
                      updateEmploymentHistory(index, "jobTitle", e.target.value)
                    }
                    placeholder="Job title"
                    required
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    min="1900-01-01"
                    max={new Date().toISOString().split("T")[0]}
                    value={employment.startDate}
                    onChange={(e) =>
                      updateEmploymentHistory(
                        index,
                        "startDate",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    min="1900-01-01"
                    max={new Date().toISOString().split("T")[0]}
                    value={employment.endDate}
                    onChange={(e) =>
                      updateEmploymentHistory(index, "endDate", e.target.value)
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Job Responsibilities</Label>
                <Textarea
                  value={employment.responsibilities}
                  onChange={(e) =>
                    updateEmploymentHistory(
                      index,
                      "responsibilities",
                      e.target.value
                    )
                  }
                  placeholder="Describe your responsibilities"
                  rows={3}
                />
              </div>
              <div>
                <Label>Reason for Leaving</Label>
                <Input
                  value={employment.reasonForLeaving}
                  onChange={(e) =>
                    updateEmploymentHistory(
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
        <Button
          type="button"
          variant="outline"
          onClick={addEmploymentHistory}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employment History
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Professional References
      </h3>
      <div className="space-y-6">
        {formData.professionalReferences.map((reference, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reference #{index + 1}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeProfessionalReference(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    value={reference.fullName}
                    onChange={(e) =>
                      updateProfessionalReference(
                        index,
                        "fullName",
                        e.target.value
                      )
                    }
                    placeholder="Reference's full name"
                    required
                  />
                </div>
                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    value={reference.phone}
                    onChange={(e) =>
                      updateProfessionalReference(
                        index,
                        "phone",
                        e.target.value
                      )
                    }
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={reference.email}
                    onChange={(e) =>
                      updateProfessionalReference(
                        index,
                        "email",
                        e.target.value
                      )
                    }
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label>Position and Company</Label>
                  <Input
                    value={reference.positionAndCompany}
                    onChange={(e) =>
                      updateProfessionalReference(
                        index,
                        "positionAndCompany",
                        e.target.value
                      )
                    }
                    placeholder="e.g., Manager at ABC Company"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addProfessionalReference}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Professional Reference
        </Button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Emergency Contact
      </h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="emergencyContactName">Full Name *</Label>
          <Input
            id="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={(e) =>
              updateFormData("emergencyContactName", e.target.value)
            }
            placeholder="Emergency contact's full name"
            required
          />
        </div>
        <div>
          <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
          <Input
            id="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={(e) =>
              updateFormData("emergencyContactPhone", e.target.value)
            }
            placeholder="(555) 123-4567"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        General & Legal
      </h3>
      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="criminalConvictionLast5Years"
              checked={formData.criminalConvictionLast5Years}
              onCheckedChange={(checked) =>
                updateFormData("criminalConvictionLast5Years", checked)
              }
            />
            <Label htmlFor="criminalConvictionLast5Years">
              Criminal Conviction in Last 5 Years
            </Label>
          </div>
          {formData.criminalConvictionLast5Years && (
            <Textarea
              value={formData.criminalConvictionDetails}
              onChange={(e) =>
                updateFormData("criminalConvictionDetails", e.target.value)
              }
              placeholder="Please provide details..."
              rows={3}
            />
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="abilityPerformJobRequirements"
              checked={formData.abilityPerformJobRequirements}
              onCheckedChange={(checked) =>
                updateFormData("abilityPerformJobRequirements", checked)
              }
            />
            <Label htmlFor="abilityPerformJobRequirements">
              Ability to Perform Job Requirements
            </Label>
          </div>
          {formData.abilityPerformJobRequirements && (
            <Textarea
              value={formData.abilityPerformDetails}
              onChange={(e) =>
                updateFormData("abilityPerformDetails", e.target.value)
              }
              placeholder="Please provide details..."
              rows={3}
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Credentials & Skills
      </h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="specializedSkills">
            Specialized Skills/Credentials
          </Label>
          <Textarea
            id="specializedSkills"
            value={formData.specializedSkills}
            onChange={(e) =>
              updateFormData("specializedSkills", e.target.value)
            }
            placeholder="List any specialized skills or credentials..."
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="operatedEquipment">Operated Equipment</Label>
          <Textarea
            id="operatedEquipment"
            value={formData.operatedEquipment}
            onChange={(e) =>
              updateFormData("operatedEquipment", e.target.value)
            }
            placeholder="List any medical equipment you're trained to operate..."
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="hourlyRateExpectation">
            Expected Hourly Rate ($)
          </Label>
          <Input
            id="hourlyRateExpectation"
            type="number"
            min="0"
            step="0.01"
            value={formData.hourlyRateExpectation}
            onChange={(e) =>
              updateFormData(
                "hourlyRateExpectation",
                parseFloat(e.target.value) || 0
              )
            }
            placeholder="e.g., 25.00"
          />
        </div>
        <div>
          <Label htmlFor="whyInterested">
            Why are you interested in this position?
          </Label>
          <Textarea
            id="whyInterested"
            value={formData.whyInterested}
            onChange={(e) => updateFormData("whyInterested", e.target.value)}
            placeholder="Tell us why you're interested in joining our team..."
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="previousExperience">
            Previous Experience Summary
          </Label>
          <Textarea
            id="previousExperience"
            value={formData.previousExperience}
            onChange={(e) =>
              updateFormData("previousExperience", e.target.value)
            }
            placeholder="Brief summary of your relevant experience..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Document Uploads
      </h3>
      <p className="text-gray-600">
        Please provide your personal information. All fields marked with an
        asterisk (*) are required.
      </p>
      <div className="space-y-4">
        {documentTypes.map((docType) => (
          <div key={docType.key} className="border rounded-lg p-4">
            <Label className="font-medium">{docType.label}</Label>
            <div className="mt-2">
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(docType.key, file);
                  }
                }}
                className="hidden"
                ref={(el) => {
                  fileInputRefs.current[docType.key] = el;
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRefs.current[docType.key]?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload {docType.label}
              </Button>
            </div>
            {formData.documents.some((doc) => doc.type === docType.key) && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <FileText className="h-4 w-4 mr-2" />
                Document uploaded
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep9 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-200 pb-2">
        Final Declaration
      </h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="certificationTruthfulness"
            checked={formData.certificationTruthfulness}
            onCheckedChange={(checked) =>
              updateFormData("certificationTruthfulness", checked)
            }
            required
          />
          <Label htmlFor="certificationTruthfulness" className="text-sm">
            I certify that all information provided in this application is true
            and complete to the best of my knowledge.
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="authorizationBackgroundCheck"
            checked={formData.authorizationBackgroundCheck}
            onCheckedChange={(checked) =>
              updateFormData("authorizationBackgroundCheck", checked)
            }
            required
          />
          <Label htmlFor="authorizationBackgroundCheck" className="text-sm">
            I authorize the company to conduct a background check as part of the
            application process.
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="understandingAtWillEmployment"
            checked={formData.understandingAtWillEmployment}
            onCheckedChange={(checked) =>
              updateFormData("understandingAtWillEmployment", checked)
            }
            required
          />
          <Label htmlFor="understandingAtWillEmployment" className="text-sm">
            I understand that employment is at-will and can be terminated at any
            time by either party.
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="acknowledgmentApplicationValidity"
            checked={formData.acknowledgmentApplicationValidity}
            onCheckedChange={(checked) =>
              updateFormData("acknowledgmentApplicationValidity", checked)
            }
            required
          />
          <Label
            htmlFor="acknowledgmentApplicationValidity"
            className="text-sm"
          >
            I acknowledge that this application will remain valid for 90 days
            from the date of submission.
          </Label>
        </div>
        <div>
          <Label htmlFor="digitalSignature">Digital Signature *</Label>
          <Input
            id="digitalSignature"
            value={formData.digitalSignature}
            onChange={(e) => updateFormData("digitalSignature", e.target.value)}
            placeholder="Type your full name as signature"
            required
          />
        </div>
        <div>
          <Label htmlFor="signatureDate">Date *</Label>
          <Input
            id="signatureDate"
            type="date"
            min="1900-01-01"
            max={new Date().toISOString().split("T")[0]}
            value={formData.signatureDate}
            onChange={(e) => updateFormData("signatureDate", e.target.value)}
            required
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
        return renderStep7();
      case 8:
        return renderStep8();
      case 9:
        return renderStep9();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-blue-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold">Haven at Home</h2>
              <p className="text-blue-100 text-sm sm:text-base">Caregiver Application Form</p>
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
                  className="bg-blue-600 hover:bg-blue-700 text-white order-1 sm:order-2"
                >
                  {currentStep === 1
                    ? "Personal Information"
                    : currentStep === 2
                    ? "Contact Information"
                    : currentStep === 3
                    ? "Education & Experience"
                    : currentStep === 4
                    ? "Skills & Availability"
                    : currentStep === 5
                    ? "Background & References"
                    : currentStep === 6
                    ? "Documents & Agreements"
                    : "Submit Application"}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={submitApplication}
                  disabled={isSubmitting || !validateStep(currentStep)}
                  className="bg-green-600 hover:bg-green-700 text-white order-1 sm:order-2"
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
