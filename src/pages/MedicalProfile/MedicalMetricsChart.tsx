import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Calendar } from "lucide-react";

interface MetricData {
  date: string;
  weight: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bloodSugar: number;
  cholesterol: number;
}

interface MetricInfo {
  name: string;
  color: string;
  unit: string;
  description: string;
}

interface MetricsConfig {
  [key: string]: MetricInfo;
}

// Mock data for medical metrics
const data: MetricData[] = [
  {
    date: "2024-01",
    weight: 70,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    bloodSugar: 95,
    cholesterol: 180,
  },
  {
    date: "2024-02",
    weight: 69.5,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 78,
    bloodSugar: 92,
    cholesterol: 175,
  },
  {
    date: "2024-03",
    weight: 69,
    bloodPressureSystolic: 122,
    bloodPressureDiastolic: 82,
    bloodSugar: 94,
    cholesterol: 178,
  },
  {
    date: "2024-04",
    weight: 68.5,
    bloodPressureSystolic: 119,
    bloodPressureDiastolic: 79,
    bloodSugar: 91,
    cholesterol: 172,
  },
];

const metrics: MetricsConfig = {
  weight: {
    name: "Weight",
    color: "#8b5cf6",
    unit: "kg",
    description: "Weight measurements from check-ups",
  },
  bloodPressure: {
    name: "Blood Pressure",
    color: "#3b82f6",
    unit: "mmHg",
    description: "Systolic/Diastolic readings",
  },
  bloodSugar: {
    name: "Blood Sugar",
    color: "#ef4444",
    unit: "mg/dL",
    description: "Fasting blood glucose levels",
  },
  cholesterol: {
    name: "Cholesterol",
    color: "#10b981",
    unit: "mg/dL",
    description: "Total cholesterol levels",
  },
};

const MedicalMetricsChart = () => {
  const [timeRange, setTimeRange] = React.useState("6m");
  const [selectedMetric, setSelectedMetric] = React.useState("weight");

  const getLatestValue = (metricKey: string) => {
    const lastRecord = data[data.length - 1];
    if (metricKey === "bloodPressure") {
      return `${lastRecord.bloodPressureSystolic}/${lastRecord.bloodPressureDiastolic}`;
    }
    return lastRecord[metricKey as keyof MetricData];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Medical Metrics</h2>
          <p className="text-sm text-gray-500">
            Track your health metrics from medical check-ups
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(metrics).map(([key, { name }]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="2y">Last 2 Years</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(metrics).map(([key, { name, color, unit, description }]) => (
          <Card
            key={key}
            className={`cursor-pointer hover:border-primary transition-colors ${
              selectedMetric === key ? "border-primary" : ""
            }`}
            onClick={() => setSelectedMetric(key)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-gray-500">{name}</div>
                <div className="text-2xl font-semibold">
                  {getLatestValue(key)}
                  <span className="text-sm text-gray-500 ml-1">{unit}</span>
                </div>
                <div className="text-xs text-gray-400">{description}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last updated: {data[data.length - 1].date}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historical Data
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedMetric === "bloodPressure" ? (
                <>
                  <Line
                    type="monotone"
                    name="Systolic"
                    dataKey="bloodPressureSystolic"
                    stroke={metrics.bloodPressure.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    name="Diastolic"
                    dataKey="bloodPressureDiastolic"
                    stroke={`${metrics.bloodPressure.color}88`}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={metrics[selectedMetric].color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalMetricsChart; 