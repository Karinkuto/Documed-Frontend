import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType?: 'increase' | 'decrease';
}

export function StatCard({ title, value, change, changeType = 'increase' }: StatCardProps) {
  const isPositive = changeType === 'increase';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          <div
            className={`flex items-center ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="ml-1 text-sm font-medium">{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
