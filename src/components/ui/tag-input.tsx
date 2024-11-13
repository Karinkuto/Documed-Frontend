import React, { KeyboardEvent, useState } from 'react';
import { X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({ 
  value = [], 
  onChange, 
  placeholder = "Add tag...",
  maxTags = 10 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue) && value.length < maxTags) {
      onChange([...value, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary"
          >
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length >= maxTags ? "Max tags reached" : placeholder}
          disabled={value.length >= maxTags}
        />
        <Button 
          type="button"
          onClick={addTag}
          disabled={!inputValue.trim() || value.length >= maxTags}
        >
          Add
        </Button>
      </div>
    </div>
  );
} 