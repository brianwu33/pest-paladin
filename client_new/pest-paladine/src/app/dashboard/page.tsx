"use client";

import { CardMetric } from "./components/ui/card-metric";
import { CardChart } from "./components/ui/card-chart";
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

const dailyData = [
  { date: "2.12", count: 1 },
  { date: "2.13", count: 2 },
  { date: "2.14", count: 2 },
  { date: "2.15", count: 4 },
  { date: "2.16", count: 2 },
  { date: "2.17", count: 3 },
  { date: "2.18", count: 4 },
];

const peakActivityData = [
  { time: "8AM", count: 1 },
  { time: "12PM", count: 0 },
  { time: "4PM", count: 2 },
  { time: "8PM", count: 0 },
  { time: "12AM", count: 0 },
  { time: "4AM", count: 0 },
];

const pestTypeData = [
  { name: "Pest 1", value: 35, color: "#4ade80" },
  { name: "Pest 2", value: 31, color: "#86efac" },
  { name: "Pest 3", value: 23, color: "#6ee7b7" },
  { name: "Pest 4", value: 15, color: "#a5f3fc" },
  { name: "Pest 5", value: 7, color: "#bef264" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 scroll-m-20 text-4xl font-bold tracking-tight">
          Today's Data
        </h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CardMetric
            icon={MousePointer}
            title="Total Detection"
            value="2"
          />
          <CardMetric
            icon={Timer}
            title="Average Pest Duration"
            value="3 min 16 sec"
          />
          <CardMetric
            icon={Rat}
            title="Most Frequent Species"
            value="Rat"
          />
          <CardMetric
            icon={Clock}
            title="Latest Detection"
            value="7 min ago"
          />
        </div>

        <h2 className="mb-6 mt-12 scroll-m-20 text-3xl font-semibold tracking-tight">
          Past 7 Days Analysis
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CardChart
            title="Peak Activity Times"
            description="The most active time periods in the week"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peakActivityData}>
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
          </CardChart>

          <CardChart
            title="Pest Type Distribution"
            description="Most Common Pests seen in your garden"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pestTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} - ${value}%`}
                >
                  {pestTypeData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardChart>

          <CardChart
            title="Daily Detection Trend"
            description="Detection count per day in the past 7 days"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
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
          </CardChart>

          <CardChart
            title="Location Distribution"
            description="The most detected areas"
          >
            <div className="flex h-full items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1577979749830-f1d742b96791?auto=format&fit=crop&q=80&w=1000"
                alt="Garden Map"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          </CardChart>
        </div>
      </div>
    </div>
  );
}