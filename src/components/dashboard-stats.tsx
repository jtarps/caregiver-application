"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  created_at: string;
}

interface DashboardStatsProps {
  applications: Application[];
}

export default function DashboardStats({ applications }: DashboardStatsProps) {
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  ).length;
  const underReviewApplications = applications.filter(
    (app) => app.status === "under_review"
  ).length;
  const approvedApplications = applications.filter(
    (app) => app.status === "approved"
  ).length;
  const rejectedApplications = applications.filter(
    (app) => app.status === "rejected"
  ).length;

  const averageExperience =
    applications.length > 0
      ? Math.round(
          applications.reduce(
            (sum, app) => sum + (app.experience_years || 0),
            0
          ) / applications.length
        )
      : 0;

  const averageHourlyRate =
    applications.length > 0
      ? Math.round(
          applications.reduce(
            (sum, app) => sum + (app.hourly_rate_expectation || 0),
            0
          ) / applications.length
        )
      : 0;

  const thisMonthApplications = applications.filter((app) => {
    const appDate = new Date(app.created_at);
    const now = new Date();
    return (
      appDate.getMonth() === now.getMonth() &&
      appDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingApplications}
              </p>
              <p className="text-xs text-gray-500">
                {totalApplications > 0
                  ? Math.round((pendingApplications / totalApplications) * 100)
                  : 0}
                % of total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {underReviewApplications}
              </p>
              <p className="text-xs text-gray-500">
                {totalApplications > 0
                  ? Math.round(
                      (underReviewApplications / totalApplications) * 100
                    )
                  : 0}
                % of total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {approvedApplications}
              </p>
              <p className="text-xs text-gray-500">
                {totalApplications > 0
                  ? Math.round((approvedApplications / totalApplications) * 100)
                  : 0}
                % of total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {rejectedApplications}
              </p>
              <p className="text-xs text-gray-500">
                {totalApplications > 0
                  ? Math.round((rejectedApplications / totalApplications) * 100)
                  : 0}
                % of total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Applications
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalApplications}
              </p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {thisMonthApplications}
              </p>
              <p className="text-xs text-gray-500">New applications</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Avg Experience
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {averageExperience} years
              </p>
              <p className="text-xs text-gray-500">Across all applicants</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                ${averageHourlyRate}/hr
              </p>
              <p className="text-xs text-gray-500">Expected hourly rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
