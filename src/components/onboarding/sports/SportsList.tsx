
import React from "react";
import { cn } from "@/lib/utils";
import { 
  CircleDot,
  Trophy,
  Activity,
  Waves,
  TimerReset,
  Bike,
  Flame,
  Flag
} from "lucide-react";

interface Sport {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const sportsList: Sport[] = [
  { id: "football", name: "Football", icon: <CircleDot className="w-4 h-4" /> },
  { id: "basketball", name: "Basketball", icon: <CircleDot className="w-4 h-4" /> },
  { id: "cricket", name: "Cricket", icon: <Trophy className="w-4 h-4" /> },
  { id: "tennis", name: "Tennis", icon: <Activity className="w-4 h-4" /> },
  { id: "badminton", name: "Badminton", icon: <Activity className="w-4 h-4" /> },
  { id: "table_tennis", name: "Table Tennis", icon: <Activity className="w-4 h-4" /> },
  { id: "volleyball", name: "Volleyball", icon: <CircleDot className="w-4 h-4" /> },
  { id: "swimming", name: "Swimming", icon: <Waves className="w-4 h-4" /> },
  { id: "running", name: "Running", icon: <TimerReset className="w-4 h-4" /> },
  { id: "cycling", name: "Cycling", icon: <Bike className="w-4 h-4" /> },
  { id: "yoga", name: "Yoga", icon: <Flame className="w-4 h-4" /> },
  { id: "golf", name: "Golf", icon: <Flag className="w-4 h-4" /> },
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
