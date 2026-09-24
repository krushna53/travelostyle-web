"use client";

import { toast } from "sonner";

// Single source of truth for the "compare cart": the up-to-3 trips stored
// under the "compareTrips" localStorage key. Every "Add to Compare" button,
// the global CompareTripsModal and the /comparison page go through here.
// Changes are broadcast with window events so anything showing the cart
// (card "Added" state, the open modal) stays in sync without a context.

export const MAX_COMPARE_TRIPS = 3;

const STORAGE_KEY = "compareTrips";
export const COMPARE_CHANGED_EVENT = "compare:changed";
export const COMPARE_OPEN_EVENT = "compare:open";

export function getCompareTrips() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setCompareTrips(trips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  window.dispatchEvent(new Event(COMPARE_CHANGED_EVENT));
}

export function isTripInCompare(tripId) {
  return getCompareTrips().some((item) => item.id === tripId);
}

export function removeTripFromCompare(tripId) {
  setCompareTrips(getCompareTrips().filter((trip) => trip.id !== tripId));
}

export function clearCompareTrips() {
  setCompareTrips([]);
}

// Opens the site-wide compare modal (mounted once in CompareModalHost).
export function openCompareModal() {
  window.dispatchEvent(new Event(COMPARE_OPEN_EVENT));
}

// Adds a JourneyCard-shaped trip to the cart and opens the compare modal.
// Returns true when the trip was added.
export function addTripToCompare(trip) {
  const existingTrips = getCompareTrips();

  if (existingTrips.some((item) => item.id === trip.id)) {
    toast("Trip already added to comparison");
    openCompareModal();
    return false;
  }

  if (existingTrips.length >= MAX_COMPARE_TRIPS) {
    toast("Please remove a trip from cart to add another");
    openCompareModal();
    return false;
  }

  const compareTrip = {
    id: trip.id,
    title: trip.title,
    image: trip.image,
    days: trip.days,
    duration: trip.days,
    destinations: trip.destinations,
    offer: trip.offer,
    price: `$${Number(trip.price).toLocaleString()}`,
    viewTripUrl: trip.viewTripUrl,
    itinerary: [],
    stays: [],
    region: trip.region || "",
    travelMode: "-",
  };

  setCompareTrips([...existingTrips, compareTrip]);
  openCompareModal();
  return true;
}
