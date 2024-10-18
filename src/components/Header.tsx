import { Bell } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Header() {
  return (
    <header className="bg-white shadow-sm z-10 h-20 flex items-center px-4">
      <div className="flex-shrink-0 w-64 flex items-center">
        <img src="/logo.svg" alt="Documed Logo" className="w-12 h-12 mr-3" />
        <h1 className="text-xl font-bold text-gray-900">DOCUMED</h1>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-[65%] max-w-2xl">
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-full"
          />
        </div>
      </div>
      <div className="flex-shrink-0 w-64 flex items-center justify-end">
        <Bell className="text-gray-500 h-5 w-5 mr-8" />
      </div>
    </header>
  )
}
