import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { medicalRecordService } from "@/services/medicalRecordService";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const records = await medicalRecordService.searchRecords(query);
      setSearchResults(records);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm z-10 h-20 flex items-center px-4">
      <div className="flex-shrink-0 w-64 flex items-center">
        <img src="/logo.svg" alt="Documed Logo" className="w-10 h-10 mr-4" />
        <h1 className="text-xl font-bold text-gray-900">DOCUMED</h1>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-[65%] max-w-2xl">
          <Button
            variant="outline"
            className="w-full justify-start text-sm text-muted-foreground"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Search medical records...
          </Button>
        </div>
      </div>

      <div className="flex-shrink-0 w-64 flex items-center justify-end space-x-4 pr-6">
        <NotificationsDropdown />
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search medical records..."
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults.map((record) => (
            <CommandGroup key={record.id} heading="Medical Records">
              <CommandItem
                onSelect={() => {
                  navigate(`/medical-profile/${record.id}`);
                  setOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{record.patientName}</span>
                  <span className="text-sm text-muted-foreground">
                    {record.diagnosis}
                  </span>
                </div>
              </CommandItem>
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </header>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
