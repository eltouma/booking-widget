import { useContext } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { WidgetContext } from '../lib/context';
import Form from './Form';

export function Widget() {
  const { isOpen, setIsOpen } = useContext(WidgetContext);

  if (!isOpen) {
    return (
      <button
        className="widget-button"
        onClick={() => setIsOpen(true)}
      >
        Réserver un atelier
      </button>
    );
  }

  return (
    <div className="widget-container">
      <div className="widget-header flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <div className="flex text-[#FAF8E6] bg-[#bdc6d1] p-2 rounded-full transition-all">
            <CiCalendar />
          </div>
          <h1 className="text-2xl font-bold uppercase text-[#6C757D]">Réservation</h1>
        </div>
        <button onClick={() => setIsOpen(false)} className="cursor-pointer">
          X
        </button>
      </div>
      <div className="widget-content">
        <Form />
      </div>
    </div>
  );
}
