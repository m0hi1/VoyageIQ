export const SelectTravelesList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A solo traveler",
    icon: "✈️",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travelers in a relationship",
    icon: "🥂",
    people: "2",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of family members",
    icon: "🏠",
    people: "3 to 5 people",
  },
  {
    id: 4,
    title: "Friends",
    desc: "Thrilling with friends",
    icon: "👫",
    people: "5 to 10 people",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Budget",
    desc: "Stay concious with your budget",
    icon: "🫰",
    people: "1",
  },
  {
    id: 2,
    title: "Mid-Range",
    desc: "Keep cost down with moderate budget",
    icon: "💰",
    people: "2",
  },

  {
    id: 3,
    title: "Luxury",
    desc: "Don't worry about cost",
    icon: "💸",
    people: "5 to 10 people",
  },
];

export function buildTravelPrompt({ location, days, groupType, budgetLevel }) {
  return `Generate a ${days}-day travel itinerary for a ${groupType} visiting ${location} on a ${budgetLevel} budget.

Include:
- A list of 2–3 recommended hotels with: hotelName, address, priceRange, coordinates (latitude, longitude), rating (1–5), and a short description.
- A day-wise itinerary:
  - For each place include:
    - placeName
    - placeDetails (short description)
    - geoCoordinates (latitude, longitude)
    - ticketPriceINR
    - bestTimeToVisit (Morning | Afternoon | Evening)
    - timeToTravelFromPreviousPlaceMin
- Do not use placeholder values like "[data not found]" or "[choose a town]".
- Try to provide realistic values based on the actual place, or closely estimated values when real ones aren’t available.

Return only valid JSON in the format:
{
   "location": "[location]",
  "days": [
    {
      "day": 1,
      "places": [
        {
          "placeName": "PLACE NAME",
          "placeDetails": "Brief description of the place",
          "coordinates": { "latitude": XX.XXXX, "longitude": YY.YYYY },
          "ticketPriceINR": XX,
          "bestTimeToVisit": "Morning | Afternoon | Evening",
          "timeToTravelFromPreviousPlaceMin": XX
        },
        ...
      ]
    },
    ...
  ]
}`;
}
