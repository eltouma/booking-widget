import { useEffect, useState } from 'react';
import { DatePicker, registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';
import { getSlots } from '../services/mockServer';
import type { Slots } from '../services/mockServer';
//import '../styles/daysStyles.css';

registerLocale("fr", fr);

type CalendarProps = {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
};

type Holiday = {
  date: string;
  holidayName: string;
};

function Calendar({ selectedDate, onChange }: CalendarProps) {
  const [ availableSlots, setAvailableSlots ] = useState<Slots[]>([]);

  useEffect(() => {
    const fetchSlots = async () => {
      const slots = await getSlots();
      console.log("dates =", slots);
      setAvailableSlots(slots);
    };
    fetchSlots();
  }, []);

  const availableDays = Array.from(
    new Set(availableSlots.map(slot => new Date(slot.date).toDateString()))
  ).map(d => new Date(d));

  const filterDate = (date: Date) => {
    return availableDays.some(availableDay => availableDay.toDateString() === date.toDateString());
  };

  const getDayClassName = (date: Date) => {
    const holidays = [
      new Date("2025-11-01"),
      new Date("2025-11-11"),
      new Date("2025-12-24"),
      new Date("2025-12-25"),
      new Date("2025-12-31"),
      new Date("2026-01-01"),
      new Date("2026-05-01"),
    ];
    if (holidays.some((h) => h.toDateString() == date.toDateString()))
      return 'day-holiday';

    const slot = availableSlots.find(s => new Date(s.date).toDateString() == date.toDateString());
    if (!slot)
      return '';
    if (slot.remaining === 0)
      return 'day-full';
    if (slot.remaining <= 3)
      return 'day-limited';
    return 'day-available';
  };

  const holidays: Holiday[] = [
    { date: "2025-11-01", holidayName:"Toussaint" },
    { date: "2025-11-01", holidayName:"Toussaint" },
    { date: "2025-11-11", holidayName:"Armistice" },
    { date: "2025-12-24", holidayName:"Réveillon de Noël" },
    { date: "2025-12-25", holidayName:"Noël" },
    { date: "2025-12-31", holidayName:"Réveillon du jour de l'An" },
    { date: "2026-01-01", holidayName:"Jour de l'An" },
    { date: "2026-05-01", holidayName:"Fête du travail" },
  ];

  return (
    <div>
      <DatePicker
        showIcon
        selected={selectedDate}
        onChange={onChange}
        dateFormat="dd MMMM yyyy, HH:mm"
        inline
        filterDate={filterDate}
        dayClassName={getDayClassName}
        holidays={holidays}
        locale="fr"
        excludeDates={[
          new Date("2025-11-01"),
          new Date("2025-11-11"),
          new Date("2025-12-24"),
          new Date("2025-12-25"),
          new Date("2025-12-31"),
          new Date("2026-01-01"),
          new Date("2026-05-01"),
        ]}
      /> 
    </div>
  );
}

export default Calendar
