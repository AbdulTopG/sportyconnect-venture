
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Sun className={cn("h-4 w-4", isDark ? "text-muted-foreground" : "text-amber-500")} />
      <Switch 
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className={cn("h-4 w-4", isDark ? "text-blue-400" : "text-muted-foreground")} />
    </div>
  );
};

export default ThemeToggle;
