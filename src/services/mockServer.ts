import data from './mockData.json'

async function getSlot() {
  console.log("Coucou");
  return data.slots_available;
}

export default getSlot;
