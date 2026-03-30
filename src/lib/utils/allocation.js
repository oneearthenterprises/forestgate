/**
 * Calculates the number of rooms and extra beddings required.
 * Rule: Bed max 2 adults + 1 child. Extra bedding (max 1) can take 1 additional adult OR child.
 * 
 * @param {number} numAdults - Total number of adults.
 * @param {number} numChildren - Total number of children.
 * @returns {Object} - Allocation details: { rooms, beddings, allocatedRooms }
 */
export function minRooms(numAdults = 0, numChildren = 0) {
  let rooms = 0;
  let totalBeddings = 0;
  let allocatedRooms = [];

  let adultsRemaining = numAdults;
  let childrenRemaining = numChildren;

  while (adultsRemaining > 0 || childrenRemaining > 0) {
    let adultsInRoom = 0;
    let childrenInRoom = 0;
    let beddingUsed = 0;

    // Step 1: Fill main bed (max 2 adults, 1 child)
    let bedAdults = Math.min(2, adultsRemaining);
    adultsInRoom += bedAdults;
    adultsRemaining -= bedAdults;

    let bedChildren = Math.min(1, childrenRemaining);
    childrenInRoom += bedChildren;
    childrenRemaining -= bedChildren;

    // Step 2: Fill extra bedding (1 adult OR 1 child)
    if (adultsRemaining > 0) {
      adultsInRoom += 1;
      adultsRemaining -= 1;
      beddingUsed = 1;
    } else if (childrenRemaining > 0) {
      childrenInRoom += 1;
      childrenRemaining -= 1;
      beddingUsed = 1;
    }

    totalBeddings += beddingUsed;
    rooms++;

    allocatedRooms.push({
      adults: adultsInRoom,
      children: childrenInRoom,
      extraBedding: beddingUsed > 0,
      beddingUsed: beddingUsed
    });
  }

  return {
    rooms: rooms,
    beddings: totalBeddings,
    allocatedRooms: allocatedRooms
  };
}

/**
 * Calculates the base cost for the rooms and beddings.
 */
export function countCost(rooms, beddings, roomCost, beddingCost) {
  return (rooms * roomCost) + (beddings * beddingCost);
}

/**
 * Returns the coupon discount percentage.
 */
export function getCouponDiscount(couponCode) {
  // Logic for checking couponCode can be added here
  return 10;
}

/**
 * Main cost manager function.
 */
export function costManager(numAdults, numChildren, couponCode, includeGst = false, roomCost, beddingCost) {
  const gstRate = 0.18;
  const { rooms, beddings } = minRooms(numAdults, numChildren);
  const totalRawCost = countCost(rooms, beddings, roomCost, beddingCost);
  
  const discount = getCouponDiscount(couponCode);
  const totalCostAfterDiscount = totalRawCost * (1 - discount / 100);

  if (!includeGst) return totalCostAfterDiscount;
  return totalCostAfterDiscount * (1 + gstRate);
}

/**
 * Wrapper for backward compatibility with the existing UI.
 */
export function allocateRooms(adults, children, basePrice, beddingCharge) {
  const result = minRooms(adults, children);
  
  // Calculate totalPrice using the costManager logic (raw cost before discount and GST for compatibility if needed)
  // Most UI components expect the raw total before taxes/discounts for breakdown.
  const totalPrice = countCost(result.rooms, result.beddings, basePrice, beddingCharge);

  return {
    allocatedRooms: result.allocatedRooms.map(r => ({ ...r, price: basePrice + (r.extraBedding ? beddingCharge : 0) })),
    totalRooms: result.rooms,
    totalBeddings: result.beddings,
    totalPrice: totalPrice,
  };
}
