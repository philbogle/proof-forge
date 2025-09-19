// src/components/ui/combobox.tsx
"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ScrollArea } from "./scroll-area"

interface ComboboxProps {
    options: readonly string[];
    value: string;
    onValueChange: (value: string) => void;
    onSelect: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    className?: string;
}

export function Combobox({ 
    options, 
    value, 
    onValueChange,
    onSelect,
    placeholder = "Select an option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No option found.",
    className,
}: ComboboxProps) {
  const [filteredOptions, setFilteredOptions] = React.useState<readonly string[]>(options);

  React.useEffect(() => {
    if (value) {
      setFilteredOptions(
        options.filter(option => 
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [value, options]);

  return (
    <Command className={cn("rounded-lg border shadow-md", className)} shouldFilter={false}>
      <CommandInput 
        placeholder={searchPlaceholder}
        value={value}
        onValueChange={onValueChange}
      />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        <ScrollArea className="h-72">
          <CommandGroup>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={onSelect}
              >
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </Command>
  )
}
