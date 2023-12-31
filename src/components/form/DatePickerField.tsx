"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerFieldProps {
  label: string;
  name: string;
  error?: string;
  setDate: (date: Date) => void;
  disabled?: boolean;
  defaultDate?: Date;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  name,
  error,
  setDate,
  disabled,
  defaultDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultDate ?? new Date()
  );

  return (
    <div className="flex flex-col mb-3">
      <label className="font-semibold" htmlFor={name}>
        {label}
      </label>

      <DatePicker
        selected={selectedDate}
        disabled={disabled}
        onChange={(date) => {
          if (date) {
            setDate(date);
            setSelectedDate(date);
          }
        }}
        className="h-12 w-full bg-gray-100 mt-4 rounded-[10px] px-5 outline-0 focus:ring-2 focus:ring-black disabled:text-gray-500 disabled:cursor-not-allowed"
      />

      <span
        className={cn("text-red-700 text-xs mt-2 h-2", {
          "opacity-1": error,
          "opacity-0": !error,
        })}
      >
        {error ?? ""}
      </span>
    </div>
  );
};

export default DatePickerField;
