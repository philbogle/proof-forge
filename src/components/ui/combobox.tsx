// src/components/ui/combobox.tsx
"use client"

import * as React from "react"
import { PlusCircle } from "lucide-react"
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
    onAddNew?: (value: string) => void;
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
    onAddNew,
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
        <CommandEmpty>
            {onAddNew && value ? (
                <CommandItem
                    value={value}
                    onSelect={() => onAddNew(value)}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <PlusCircle className="h-4 w-4" />
                    Add "{value}"
                </CommandItem>
            ) : (
                <div className="py-6 text-center text-sm">{emptyMessage}</div>
            )}
        </CommandEmpty>
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
