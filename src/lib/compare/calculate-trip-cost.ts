import { getFlightEstimate, getTravelStyleCosts } from "@/lib/data/destinations";
import { getOriginCode } from "@/lib/compare/url-params";
import { toDestinationTravelStyle, type CompareDestination, type CompareParams, type DestinationTripCost } from "@/lib/compare/types";

export function calculateTripCost(destination: CompareDestination, params: CompareParams): DestinationTripCost {
  const travelStyle = toDestinationTravelStyle(params.style);
  const dailyCosts = getTravelStyleCosts(destination, travelStyle);
  const flightAverage = getFlightEstimate(destination, getOriginCode(params.origin)).average;
  const flightUnavailable = flightAverage <= 0;

  const breakdown = {
    flights: flightUnavailable ? null : flightAverage * params.travelers,
    accommodation: dailyCosts.accommodation * params.days * params.travelers,
    food: dailyCosts.food * params.days * params.travelers,
    localTransportation: dailyCosts.localTransport * params.days * params.travelers,
    activities: dailyCosts.activities * params.days * params.travelers,
    extras: dailyCosts.misc * params.days * params.travelers,
  };
  const variableTotal =
    breakdown.accommodation + breakdown.food + breakdown.localTransportation + breakdown.activities + breakdown.extras;
  const total = breakdown.flights === null ? null : Math.round(breakdown.flights + variableTotal);

  return {
    destination,
    breakdown,
    total,
    dailyLocalCost:
      dailyCosts.accommodation + dailyCosts.food + dailyCosts.localTransport + dailyCosts.activities + dailyCosts.misc,
    costPerDay: total === null ? null : Math.round(total / params.days),
    costPerTraveler: total === null ? null : Math.round(total / params.travelers),
    flightUnavailable,
  };
}
