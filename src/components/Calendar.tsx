import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { getDay } from "date-fns"
import 'react-datepicker/dist/react-datepicker.css'

const isSelectable = (date: Date) => {
  const today = new Date() < date;
  const isMonday = getDay(date) !== 1;
  const isWednesday = getDay(date) !== 3;
  const isFridday = getDay(date) !== 5;
  const isSunday = getDay(date) !== 7;
  return today && isMonday && isWednesday && isFridday && isSunday;
}

// Ne pas pouvoir sélectionner la date si l'heure est passée

function Calendar() {
  let handleColor = (time) => {
    return time.getHours() > 12 ? "text-success": "text-error";
  };

  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <div>
      <DatePicker
        showIcon
        showTimeSelect
	timeIntervals={180}
        minTime={new Date(0, 0, 0, 9, 0)}
        maxTime={new Date(0, 0, 0, 20, 0)}
        selected={date}
        onChange={(date) => setDate(date)}
        filterDate={isSelectable}
        dateFormat="MMMM d, yyyy h:mmaa"
        timeClassName={handleColor}
        inline
        holidays={[
           { date: "2025-11-01", holidayName:"Toussaint" },
           { date: "2025-11-11", holidayName:"Armistice" },
           { date: "2025-12-24", holidayName:"Réveillon de Noël" },
           { date: "2025-12-25", holidayName:"Noël" },
           { date: "2025-12-31", holidayName:"Réveillon du jour de l'An" },
           { date: "2026-01-01", holidayName:"Jour de l'An" },
           { date: "2026-05-01", holidayName:"Fête du travail" },
        ]}
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
