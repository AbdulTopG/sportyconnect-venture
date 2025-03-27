
import React from "react";
import { cn } from "@/lib/utils";
import { 
  Football, 
  Basketball, 
  Tennis, 
  Badminton, 
  Swimming, 
  Running, 
  Bike, 
  Yoga, 
  Golf 
} from "lucide-react";

interface Sport {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const sportsList: Sport[] = [
  { id: "football", name: "Football", icon: <Football className="w-6 h-6" /> },
  { id: "basketball", name: "Basketball", icon: <Basketball className="w-6 h-6" /> },
  { id: "cricket", name: "Cricket", icon: <Football className="w-6 h-6" /> }, // Using Football as placeholder
  { id: "tennis", name: "Tennis", icon: <Tennis className="w-6 h-6" /> },
  { id: "badminton", name: "Badminton", icon: <Badminton className="w-6 h-6" /> },
  { id: "table_tennis", name: "Table Tennis", icon: <Tennis className="w-6 h-6" /> }, // Using Tennis as placeholder
  { id: "volleyball", name: "Volleyball", icon: <Basketball className="w-6 h-6" /> }, // Using Basketball as placeholder
  { id: "swimming", name: "Swimming", icon: <Swimming className="w-6 h-6" /> },
  { id: "running", name: "Running", icon: <Running className="w-6 h-6" /> },
  { id: "cycling", name: "Cycling", icon: <Bike className="w-6 h-6" /> },
  { id: "yoga", name: "Yoga", icon: <Yoga className="w-6 h-6" /> },
  { id: "golf", name: "Golf", icon: <Golf className="w-6 h-6" /> },
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
