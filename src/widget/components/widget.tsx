import { useContext } from 'react';
import { WidgetContext } from '../lib/context';

export function Widget() {
  const { isOpen, setIsOpen } = useContext(WidgetContext);

  if (!isOpen) {
    return (
      <button
        className="widget-button"
        onClick={() => setIsOpen(true)}
      >
        Réserver
      </button>
    );
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3>Booking widget</h3>
        <button
          onClick={() => setIsOpen(false)}
        >
         X 
        </button>
      </div>

      <div className="widget-content">
        {/* Your widget content goes here */}
      </div>
    </div>
  );
}
