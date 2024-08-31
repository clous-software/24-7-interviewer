"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DateRange, SelectRangeEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  selected?: DateRange; // Keep DateRange for controlling selected dates (date range)
  onSelect?: SelectRangeEventHandler; // Keep SelectRangeEventHandler for handling date selection (date range)
} & React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  ...props
}: CalendarProps) {

  const handleSelect: SelectRangeEventHandler = (range, selectedDay, activeModifiers, e) => {
    if (range?.from) {
      // Ensure the from date is fixed to today's date
      range.from = new Date();
    }
    if (onSelect) {
      onSelect(range, selectedDay, activeModifiers, e);
    }
  };

  return (
    <div className="relative">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3 text-sm", className)}
        selected={selected} 
        onSelect={handleSelect} // Updated handler to ensure today's date is fixed as from
        mode="range" // Set the mode to range for date range selection
        disabled={{ before: new Date() }} // Disable dates before today
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: " font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 bg-opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-sm"
          ),
          day_selected:
            "bg-primary text-secondary text-sm hover:bg-primary focus:bg-primary",
          day_today: "bg-accent text-accent-foreground text-sm",
          day_outside: "text-muted-foreground bg-opacity-50 text-sm",
          day_disabled: "text-muted-foreground bg-opacity-50 text-sm",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-gray-foreground text-sm",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
