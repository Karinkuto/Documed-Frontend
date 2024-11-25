import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, FileText, Database, Users } from "lucide-react"

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  period: string;
  icon: React.ReactNode;
}

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Last Visit" 
        value="May 24, 2024" 
        change="+2.1%" 
        period="Regular checkup" 
        icon={<Calendar className="h-4 w-4" />} 
      />
      <StatCard 
        title="Documents" 
        value="1" 
        change="+100%" 
        period="New vaccination record" 
        icon={<FileText className="h-4 w-4" />} 
      />
      <StatCard 
        title="Active Prescriptions" 
        value="1" 
        change="+0%" 
        period="Amoxicillin treatment" 
        icon={<Database className="h-4 w-4" />} 
      />
      <StatCard 
        title="Activities" 
        value="5" 
        change="+25%" 
        period="Recent activities" 
        icon={<Users className="h-4 w-4" />} 
      />
    </div>
  )
}

function StatCard({ title, value, change, period, icon }: StatCardProps) {
  const isPositive = change.startsWith('+')
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={isPositive ? 'text-[#7EC143]' : 'text-red-500'}>{change}</span> {period}
        </p>
      </CardContent>
    </Card>
  )
}
