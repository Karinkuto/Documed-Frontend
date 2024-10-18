import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RecentActivities() {
  return (
    <Card className="h-[470px]">
      <CardHeader>
        <CardTitle>Recents</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] relative">
        <Tabs defaultValue="all" className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="joined">Join</TabsTrigger>
            <TabsTrigger value="uploaded">Upload</TabsTrigger>
            <TabsTrigger value="deleted">Delete</TabsTrigger>
          </TabsList>
          <div className="relative h-[calc(100%-40px)]">
            {['all', 'joined', 'uploaded', 'deleted'].map((tabValue) => (
              <TabsContent 
                key={tabValue}
                value={tabValue} 
                className="h-full"
              >
                <ScrollArea className="h-full">
                  <ActivityList type={tabValue === 'all' ? 'all' : tabValue} />
                </ScrollArea>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ActivityList({ type = "all" }) {
  const activities = [
    { name: "Gebeyehu Saychemir", action: "joined", date: "12.09.2019", time: "12:53 PM" },
    { name: "Anis Mola", action: "uploaded", date: "11.09.2019", time: "10:30 AM" },
    { name: "John Doe", action: "deleted", date: "10.09.2019", time: "09:15 AM" },
    { name: "Jane Smith", action: "joined", date: "09.09.2019", time: "14:20 PM" },
    { name: "Alex Johnson", action: "uploaded", date: "08.09.2019", time: "11:45 AM" },
    { name: "Sarah Williams", action: "deleted", date: "07.09.2019", time: "16:30 PM" },
  ]

  const filteredActivities = type === "all" 
    ? activities 
    : activities.filter(activity => activity.action === type)

  const getActionBorderColor = (action: string) => {
    switch (action) {
      case 'joined': return 'border-[#7EC143]'
      case 'uploaded': return 'border-blue-400'
      case 'deleted': return 'border-red-400'
      default: return 'border-gray-400'
    }
  }

  return (
    <div className="pr-4">
      {filteredActivities.map((activity, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between py-4 border-b last:border-b-0"
        >
          <div className="flex items-center space-x-3 flex-grow mr-2">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
              <AvatarFallback>{activity.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <span className="text-sm font-medium break-words">{activity.name}</span>
              <div className="flex items-center mt-1">
                <span className={`text-xs font-semibold text-gray-600 border-l-2 pl-1 ${getActionBorderColor(activity.action)}`}>
                  {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm text-gray-900 font-medium">{activity.date}</p>
            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
