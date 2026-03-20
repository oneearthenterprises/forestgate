/**
 * Allocates guests (adults and children) into rooms based on capacity rules:
 * Rule A: Max 2 adults + 2 children per room.
 * Rule B: Max 3 adults per room (requires extra bedding).
 * 
 * @param {number} adults - Total number of adults.
 * @param {number} children - Total number of children.
 * @param {number} basePrice - Base rate for the room.
 * @param {number} beddingCharge - Additional charge for rooms with 3 adults.
 * @returns {Object} - Allocation details including room breakdown, total rooms, and total price.
 */
export function allocateRooms(adults, children, basePrice, beddingCharge = 1500) {
  if (adults < 1) {
    throw new Error("At least 1 adult is required");
  }

  let remainingAdults = adults;
  let remainingChildren = children;
  let rooms = [];

  while (remainingAdults > 0 || remainingChildren > 0) {
    let currentRoom = { adults: 0, children: 0, extraBedding: false, price: basePrice };

    // Rule B: Can we fit 3 adults? 
    // Usually, we prioritize 2+2 (Rule A) for families, but if we have many adults, we use Rule B.
    // If only 1 adult left, he gets a room.
    // If 3 adults left and no children, we can use Rule B.
    
    if (remainingAdults >= 3 && (remainingChildren === 0 || remainingAdults > remainingChildren)) {
      currentRoom.adults = 3;
      currentRoom.extraBedding = true;
      currentRoom.price += beddingCharge;
      remainingAdults -= 3;
    } else {
      // Rule A: Max 2 Adults
      currentRoom.adults = Math.min(2, remainingAdults);
      remainingAdults -= currentRoom.adults;

      // Max 2 Children
      currentRoom.children = Math.min(2, remainingChildren);
      remainingChildren -= currentRoom.children;
    }

    rooms.push(currentRoom);
  }

  // Calculate Total Price with 10% discount for subsequent rooms
  let totalPrice = 0;
  const allocatedRooms = rooms.map((room, index) => {
    let roomPrice = room.price;
    if (index > 0) {
      // 10% discount on the base part of the room price for additional rooms
      const basePart = room.extraBedding ? roomPrice - beddingCharge : roomPrice;
      roomPrice = (basePart * 0.9) + (room.extraBedding ? beddingCharge : 0);
    }
    totalPrice += roomPrice;
    return { ...room, price: roomPrice };
  });

  return {
    allocatedRooms,
    totalRooms: allocatedRooms.length,
    totalPrice,
  };
}
