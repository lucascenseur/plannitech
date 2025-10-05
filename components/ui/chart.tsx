"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  type?: "bar" | "line" | "pie";
  className?: string;
}

export function Chart({ 
  title, 
  description, 
  data, 
  type = "bar", 
  className 
}: ChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {type === "bar" && (
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      item.color || "bg-blue-500"
                    )}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {type === "line" && (
          <div className="space-y-2">
            <div className="flex items-end space-x-1 h-32">
              {data.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 rounded-t transition-all duration-300",
                    item.color || "bg-blue-500"
                  )}
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              {data.map((item, index) => (
                <span key={index}>{item.label}</span>
              ))}
            </div>
          </div>
        )}

        {type === "pie" && (
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                />
                {data.map((item, index) => {
                  const percentage = (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100;
                  const circumference = 2 * Math.PI * 56;
                  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = data.slice(0, index).reduce((sum, d) => {
                    const p = (d.value / data.reduce((s, di) => s + di.value, 0)) * 100;
                    return sum - (p / 100) * circumference;
                  }, 0);

                  return (
                    <circle
                      key={index}
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke={item.color || "#3b82f6"}
                      strokeWidth="16"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  trend = "neutral", 
  className 
}: MetricCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-sm ${trendColors[trend]}`}>
              {change}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

