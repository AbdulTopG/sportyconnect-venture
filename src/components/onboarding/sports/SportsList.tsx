
import React from "react";
import { cn } from "@/lib/utils";

interface Sport {
  id: string;
  name: string;
  icon: string;
}

export const sportsList: Sport[] = [
  { id: "football", name: "Football", icon: "⚽" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
  { id: "badminton", name: "Badminton", icon: "🏸" },
  { id: "table_tennis", name: "Table Tennis", icon: "🏓" },
  { id: "volleyball", name: "Volleyball", icon: "🏐" },
  { id: "swimming", name: "Swimming", icon: "🏊" },
  { id: "running", name: "Running", icon: "🏃" },
  { id: "cycling", name: "Cycling", icon: "🚴" },
  { id: "yoga", name: "Yoga", icon: "🧘" },
  { id: "golf", name: "Golf", icon: "⛳" },
];

interface SportCardProps {
  sport: Sport;
  isSelected: boolean;
  isPrimary?: boolean;
  onClick: () => void;
}

export const SportCard: React.FC<SportCardProps> = ({ sport, isSelected, isPrimary, onClick }) => {
  return (
    <div
      className={cn(
        "border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all hover:border-sportyfi-orange",
        isSelected 
          ? "border-2 border-sportyfi-orange bg-orange-50"
          : "border-gray-200"
      )}
      onClick={onClick}
    >
      <div className="text-2xl">{sport.icon}</div>
      <div className="font-medium">{sport.name}</div>
    </div>
  );
};
