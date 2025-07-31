"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import DashboardStats from "@/components/dashboard-stats";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  FileText,
} from "lucide-react";

interface Application {
  id: string;
  application_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  social_insurance_number: string;
  has_driver_license: boolean;
  legally_eligible_employment: boolean;
  weekly_availability: number;
  previously_applied: boolean;
  source_of_information: string;
  completed_program: string;
  school_attended: string;
  experience_years: number;
  certifications: string[];
  specializations: string[];
  languages: string[];
  employment_history: any[];
  professional_references: any[];
  emergency_contact_name: string;
  emergency_contact_phone: string;
  criminal_conviction_last_5_years: boolean;
  criminal_conviction_details: string;
  ability_perform_job_requirements: boolean;
  ability_perform_details: string;
  specialized_skills: string;
  operated_equipment: string;
  hourly_rate_expectation: number;
  why_interested: string;
  previous_experience: string;
  documents: any[];
  certification_truthfulness: boolean;
  authorization_background_check: boolean;
  understanding_at_will_employment: boolean;
  acknowledgment_application_validity: boolean;
  digital_signature: string;
  signature_date: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
}

export default function AdminPortal() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("caregiver_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications");
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.phone.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (
    applicationId: string,
    status: string,
    notes?: string
  ) => {
    try {
      const { error } = await supabase
        .from("caregiver_applications")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: "admin", // In real app, get from auth
          review_notes: notes,
        })
        .eq("id", applicationId);

      if (error) {
        console.error("Error updating application:", error);
        toast.error("Failed to update application status");
        return;
      }

      toast.success(`Application ${status}`);
      fetchApplications();
      setSelectedApplication(null);
      setReviewNotes("");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update application status");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
      under_review: { color: "bg-blue-100 text-blue-800", icon: Eye },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Haven at Home - HR Management Portal
              </h1>
              <p className="text-gray-600">
                Review and manage caregiver applications
              </p>
            </div>

            {/* Stats */}
            <DashboardStats applications={applications} />

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Applications</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Label htmlFor="status">Filter by Status</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">
                          Under Review
                        </SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Applications List */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Applications ({filteredApplications.length})
                </h2>
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <Card
                      key={application.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedApplication?.id === application.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedApplication(application)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {application.first_name} {application.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {application.email}
                            </p>
                          </div>
                          {getStatusBadge(application.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {application.phone}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(application.created_at)}
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-500">
                          Experience: {application.experience_years} years •
                          Availability: {application.weekly_availability}{" "}
                          hrs/week
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Application Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Application Details
                </h2>
                {selectedApplication ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Personal Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Name:</span>
                              <p>
                                {selectedApplication.first_name}{" "}
                                {selectedApplication.last_name}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Email:</span>
                              <p>{selectedApplication.email}</p>
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span>
                              <p>{selectedApplication.phone}</p>
                            </div>
                            <div>
                              <span className="font-medium">
                                Date of Birth:
                              </span>
                              <p>{selectedApplication.date_of_birth}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Address:</span>
                              <p>{selectedApplication.address}</p>
                            </div>
                          </div>
                        </div>

                        {/* Education & Experience */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Education & Experience
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Program:</span>
                              <p>{selectedApplication.completed_program}</p>
                            </div>
                            <div>
                              <span className="font-medium">School:</span>
                              <p>{selectedApplication.school_attended}</p>
                            </div>
                            <div>
                              <span className="font-medium">Experience:</span>
                              <p>
                                {selectedApplication.experience_years} years
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Availability:</span>
                              <p>
                                {selectedApplication.weekly_availability}{" "}
                                hours/week
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Skills & Credentials */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Skills & Credentials
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">
                                Specialized Skills:
                              </span>
                              <p>{selectedApplication.specialized_skills}</p>
                            </div>
                            <div>
                              <span className="font-medium">
                                Equipment Experience:
                              </span>
                              <p>{selectedApplication.operated_equipment}</p>
                            </div>
                            <div>
                              <span className="font-medium">
                                Hourly Rate Expectation:
                              </span>
                              <p>
                                ${selectedApplication.hourly_rate_expectation}
                                /hour
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Review Actions */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Review Actions
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="reviewNotes">Review Notes</Label>
                              <textarea
                                id="reviewNotes"
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                className="w-full p-2 border rounded-md mt-1"
                                rows={3}
                                placeholder="Add review notes..."
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  updateApplicationStatus(
                                    selectedApplication.id,
                                    "approved",
                                    reviewNotes
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() =>
                                  updateApplicationStatus(
                                    selectedApplication.id,
                                    "rejected",
                                    reviewNotes
                                  )
                                }
                                variant="destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                onClick={() =>
                                  updateApplicationStatus(
                                    selectedApplication.id,
                                    "under_review",
                                    reviewNotes
                                  )
                                }
                                variant="outline"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Mark for Review
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Select an application to view details</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
