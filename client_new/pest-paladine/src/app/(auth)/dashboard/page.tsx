"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { MetricCard } from "../../../components/MetricCard";
import { VisualCard } from "../../../components/VisualCard";
import { Clock, MousePointer, Rat, Timer } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/dashboard";

export default function Home() {
  const { getToken } = useAuth(); // ✅ Get token from Clerk
  const [dashboardData, setDashboardData] = useState({
    totalDetections: 0,
    mostFrequentSpecies: "N/A",
    mostDetectionCamera: "N/A",
    latestDetection: "N/A",
    peakActivityData: [],
    pestTypeData: [],
    dailyDetectionTrend: [],
    cameraData: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard analytics data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getToken(); // ✅ Get auth token

      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Use token in headers
        },
      });

      setDashboardData({
        totalDetections: response.data.totalDetections,
        mostFrequentSpecies: response.data.mostFrequentSpecies !== "N/A"
          ? response.data.mostFrequentSpecies
          : "N/A",
        mostDetectionCamera: response.data.mostDetectionCamera !== "N/A"
          ? response.data.mostDetectionCamera
          : "N/A",
        latestDetection: response.data.latestDetection
          ? formatTimeAgo(response.data.latestDetection)
          : "No Recent Activity",
        peakActivityData: response.data.peakActivityData || [],
        pestTypeData: response.data.pestTypeData || [],
        dailyDetectionTrend: response.data.dailyDetectionTrend || [],
        cameraData: response.data.cameraData || [],
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to format timestamps as "X min ago", "X hr ago", or "X days ago"
  const formatTimeAgo = (timestamp: string) => {
    console.log("Timestamp: " + timestamp);
    if (!timestamp) return "N/A";

    const now = new Date();
    const detectionTime = new Date(timestamp);

    if (isNaN(detectionTime.getTime())) return "N/A";

    const diffInSeconds = Math.max(
      0,
      Math.floor((now.getTime() - detectionTime.getTime()) / 1000)
    );
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInSeconds / 3600);
    const diffInDays = Math.floor(diffInSeconds / 86400);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hr ago`;

    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 scroll-m-20 text-xl font-bold tracking-tight">
          Today's Data
        </h1>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={MousePointer}
            title="Total Detection"
            value={
              loading ? "Loading..." : dashboardData.totalDetections.toString()
            }
          />
          <MetricCard
            icon={Timer}
            title="Most Detections Camera"
            value={loading ? "Loading..." : dashboardData.mostDetectionCamera}
          />
          <MetricCard
            icon={Rat}
            title="Most Frequent Species"
            value={loading ? "Loading..." : dashboardData.mostFrequentSpecies}
          />
          <MetricCard
            icon={Clock}
            title="Latest Detection"
            value={loading ? "Loading..." : dashboardData.latestDetection}
          />
        </div>

        <h2 className="mb-8 mt-12 scroll-m-20 text-xl font-bold tracking-tight">
          Past 7 Days Analysis
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <VisualCard
            title="Peak Activity Times"
            description="The most active time periods in the week"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.peakActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4ade80"
                  fill="#86efac"
                />
              </AreaChart>
            </ResponsiveContainer>
          </VisualCard>

          <VisualCard
            title="Pest Type Distribution"
            description="Top 5 Most Common Pests"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.pestTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} - ${value}%`}
                >
                  {dashboardData.pestTypeData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        ["#4ade80", "#86efac", "#6ee7b7", "#a5f3fc", "#bef264"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </VisualCard>

          <VisualCard
            title="Daily Detection Trend"
            description="Detection count per day in the past 7 days"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.dailyDetectionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4ade80"
                  fill="#86efac"
                />
              </AreaChart>
            </ResponsiveContainer>
          </VisualCard>

          <VisualCard
            title="Camera Distribution"
            description="Top 5 Most Detection Cameras"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.cameraData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} - ${value}%`}
                >
                  {dashboardData.cameraData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        ["#4ade80", "#86efac", "#6ee7b7", "#a5f3fc", "#bef264"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </VisualCard>
        </div>
      </div>
    </div>
  );
}
