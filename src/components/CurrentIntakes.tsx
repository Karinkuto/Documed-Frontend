import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, GraduationCap, MoreHorizontal, Image as ImageIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CurrentIntakes() {
  return (
    <Card className="w-full h-[470px]">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-xl font-bold">Current Intakes</CardTitle>
        <Select defaultValue="october">
          <SelectTrigger className="w-[140px] h-8 text-sm">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="october">October</SelectItem>
            <SelectItem value="november">November</SelectItem>
            <SelectItem value="december">December</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <ScrollArea className="h-[calc(100%-5rem)]">
        <CardContent className="space-y-3 pr-4">
          <IntakeItem
            id="CD 18/23-A"
            dueDate="Oct 10, 2024"
            dueTime="7:41 AM"
            peopleCount={9}
            graduateCount={2}
            tag="Image"
            tagColor="bg-yellow-100 text-yellow-800"
            progress={50}
          />
          <IntakeItem
            id="SL 108/23-C"
            dueDate="Jun 19, 2024"
            dueTime="11:41 PM"
            peopleCount={99}
            graduateCount={12}
            tag="Sick Leave"
            tagColor="bg-purple-100 text-purple-800"
            progress={64}
          />
          <IntakeItem
            id="VAC 18/23-A"
            dueDate="Jun 10, 2024"
            dueTime="9:41 AM"
            peopleCount={99}
            graduateCount={12}
            tag="Certificate"
            tagColor="bg-blue-100 text-blue-800"
            progress={30}
          />
        </CardContent>
      </ScrollArea>
    </Card>
  )
}

function IntakeItem({ id, dueDate, dueTime, peopleCount, graduateCount, tag, tagColor, progress }) {
  return (
    <Card className="relative hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-700">#{id}</span>
            <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${tagColor}`}>
              {tag === "Image" && <ImageIcon size={12} className="mr-1" />}
              {tag}
            </span>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Users size={14} className="text-green-500" />
              <span className="text-sm font-medium text-gray-700">{peopleCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GraduationCap size={14} className="text-red-500" />
              <span className="text-sm font-medium text-gray-700">{graduateCount}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Due: <span className="font-semibold text-gray-700">{dueDate}</span> at <span className="text-blue-500">{dueTime}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-black h-1 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-xs font-semibold text-gray-700 min-w-[28px]">{progress}%</span>
        </div>
      </CardContent>
    </Card>
  )
}
