
import React from 'react';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Clock } from 'lucide-react';

type DateTimeFieldsProps = {
  date: Date | null;
  time: string;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ 
  date, 
  time, 
  onDateChange, 
  onTimeChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={onDateChange}
              initialFocus
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <Label htmlFor="time">Time *</Label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            id="time" 
            name="time" 
            type="time"
            value={time} 
            onChange={onTimeChange} 
            className="pl-10"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimeFields;
