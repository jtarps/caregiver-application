"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import DashboardStats from "@/components/dashboard-stats";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Application {
  id: string;
  application_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  updated_at?: string;
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
  const [statusFilter, setStatusFilter] = useState("all");
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
        toast.error("Failed to fetch applications");
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.phone.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      const { error } = await supabase
        .from("caregiver_applications")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", applicationId);

      if (error) {
        console.error("Error updating application:", error);
        toast.error("Failed to update application status");
        return;
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast.success("Application status updated successfully");
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Failed to update application status");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            HR Management Portal
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Review and manage caregiver applications
          </p>
        </div>

        <DashboardStats applications={applications} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Filters and Applications List */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4 sm:p-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search">Search</Label>
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
                  <div className="sm:w-48">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Applications List */}
                <div className="space-y-3 sm:space-y-4">
                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No applications found</p>
                    </div>
                  ) : (
                    filteredApplications.map((application) => (
                      <div
                        key={application.id}
                        className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm sm:text-base">
                                {application.first_name[0]}
                                {application.last_name[0]}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm sm:text-base">
                                {application.first_name} {application.last_name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {application.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={`${getStatusColor(application.status)} text-xs`}
                            >
                              {getStatusIcon(application.status)}
                              <span className="ml-1 capitalize">
                                {application.status}
                              </span>
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-1">
            {selectedApplication ? (
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">
                      Application Details
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedApplication(null)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">
                        Name
                      </Label>
                      <p className="text-sm sm:text-base text-gray-900">
                        {selectedApplication.first_name}{" "}
                        {selectedApplication.last_name}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <p className="text-sm sm:text-base text-gray-900">
                        {selectedApplication.email}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">
                        Phone
                      </Label>
                      <p className="text-sm sm:text-base text-gray-900">
                        {selectedApplication.phone}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">
                        Status
                      </Label>
                      <Badge
                        className={`${getStatusColor(selectedApplication.status)} text-xs`}
                      >
                        {getStatusIcon(selectedApplication.status)}
                        <span className="ml-1 capitalize">
                          {selectedApplication.status}
                        </span>
                      </Badge>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">
                        Application ID
                      </Label>
                      <p className="text-xs sm:text-sm text-gray-600 font-mono">
                        {selectedApplication.application_id}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">
                        Submitted
                      </Label>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {new Date(
                          selectedApplication.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Status Update */}
                    <div className="border-t pt-4">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                        Update Status
                      </Label>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                          size="sm"
                          variant={
                            selectedApplication.status === "approved"
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            updateApplicationStatus(
                              selectedApplication.id,
                              "approved"
                            )
                          }
                          className="flex-1"
                        >
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="text-xs sm:text-sm">Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            selectedApplication.status === "rejected"
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            updateApplicationStatus(
                              selectedApplication.id,
                              "rejected"
                            )
                          }
                          className="flex-1"
                        >
                          <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="text-xs sm:text-sm">Reject</span>
                        </Button>
                      </div>
                    </div>

                    {/* Review Notes */}
                    <div>
                      <Label
                        htmlFor="reviewNotes"
                        className="text-xs sm:text-sm font-medium text-gray-700"
                      >
                        Review Notes
                      </Label>
                      <Textarea
                        id="reviewNotes"
                        placeholder="Add review notes..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="mt-1 text-xs sm:text-sm"
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center text-gray-500">
                    <Eye className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm sm:text-base">Select an application to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
