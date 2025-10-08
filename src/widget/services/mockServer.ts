import data from './mockData.json';

export interface Slots {
  id: number;
  date: string;
  capacity: number;
  remaining: number;
}

let slots: Slots[] = data.slots_available;

async function getSlots(): Promise<Slots[]> {
  const invalidSlot = data.slots_available.find(slot => slot.remaining > slot.capacity);
  if (invalidSlot)
    throw new Error('JSON error: remaining > capacity for slot ' + invalidSlot.id);

  const now = new Date();

  const avalaibleSlots = data.slots_available.filter(slot => {
    const slotDate = new Date(slot.date);
    const exceeding = new Date(slotDate);
    exceeding.setHours(17, 30, 0, 0);
    return now < exceeding && slotDate > now;
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!avalaibleSlots)
        return reject(new Error("No slot available"));
      resolve(avalaibleSlots), 300
    });
  }); 
}

async function bookSlot(slotId: number): Promise<Slots> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const slot = slots.find((s) => s.id === slotId);
      if (!slot)
        return reject(new Error("Slot not found"));
      if (slot.remaining <= 0)
        return reject(new Error("Full slot"));
      slot.remaining -= 1;
      resolve(slot);
    }, 100);
  });
}

async function failBooking(slotId: number): Promise<number> {
  return new Promise((resolve) => {
    console.log("Payment failure");
    setTimeout(() => resolve(slotId), 3000);
  });
}

export { getSlots, bookSlot, failBooking };
