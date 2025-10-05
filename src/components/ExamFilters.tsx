import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface ExamFiltersProps {
  filterType: "today" | "week" | "nextWeek" | "custom";
  setFilterType: (type: "today" | "week" | "nextWeek" | "custom") => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

export const ExamFilters = ({
  filterType,
  setFilterType,
  selectedDate,
  setSelectedDate,
}: ExamFiltersProps) => {
  return (
    <div className="mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          variant={filterType === "today" ? "default" : "outline"}
          onClick={() => setFilterType("today")}
          className="transition-bounce"
        >
          Today's Exams
        </Button>
        <Button
          variant={filterType === "week" ? "default" : "outline"}
          onClick={() => setFilterType("week")}
          className="transition-bounce"
        >
          This Week
        </Button>
        <Button
          variant={filterType === "nextWeek" ? "default" : "outline"}
          onClick={() => setFilterType("nextWeek")}
          className="transition-bounce"
        >
          Next Week
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={filterType === "custom" ? "default" : "outline"}
              className="transition-bounce"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              {selectedDate && filterType === "custom"
                ? format(selectedDate, "PPP")
                : "Select Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setFilterType("custom");
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
