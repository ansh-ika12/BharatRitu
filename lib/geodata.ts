export interface Locality {
  name: string
  district: string
  state: string
  lat: number
  lng: number
}

// A small gazetteer of major Indian cities/localities used to resolve a
// citizen report's typed location (or nearest-match a GPS point) to a
// district/state for filtering. Stands in for the GeoNames / India Post
// gazetteer described in the full WeatherPulse design.
export const INDIAN_LOCALITIES: Locality[] = [
  { name: 'Andheri', district: 'Mumbai Suburban', state: 'Maharashtra', lat: 19.1197, lng: 72.8468 },
  { name: 'Bandra', district: 'Mumbai Suburban', state: 'Maharashtra', lat: 19.06, lng: 72.83 },
  { name: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', lat: 19.076, lng: 72.8777 },
  { name: 'Kaziranga', district: 'Golaghat', state: 'Assam', lat: 26.6, lng: 93.4 },
  { name: 'Dibrugarh', district: 'Dibrugarh', state: 'Assam', lat: 27.48, lng: 94.9 },
  { name: 'Guwahati', district: 'Kamrup Metropolitan', state: 'Assam', lat: 26.1445, lng: 91.7362 },
  { name: 'Civil Lines', district: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.45, lng: 81.84 },
  { name: 'Prayagraj', district: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
  { name: 'Hazratganj', district: 'Lucknow', state: 'Uttar Pradesh', lat: 26.85, lng: 80.94 },
  { name: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Agra', district: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { name: 'Kanpur', district: 'Kanpur Nagar', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  { name: 'Noida', district: 'Gautam Buddh Nagar', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.391 },
  { name: 'Ghaziabad', district: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
  { name: 'Bikaner', district: 'Bikaner', state: 'Rajasthan', lat: 28.02, lng: 73.31 },
  { name: 'Jodhpur City', district: 'Jodhpur', state: 'Rajasthan', lat: 26.29, lng: 73.02 },
  { name: 'Jodhpur', district: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
  { name: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Salt Lake', district: 'Kolkata', state: 'West Bengal', lat: 22.58, lng: 88.42 },
  { name: 'Howrah Bridge', district: 'Howrah', state: 'West Bengal', lat: 22.585, lng: 88.34 },
  { name: 'Kolkata', district: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Connaught Place', district: 'New Delhi', state: 'Delhi', lat: 28.63, lng: 77.22 },
  { name: 'New Delhi', district: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209 },
  { name: 'Gurugram', district: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266 },
  { name: 'Faridabad', district: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178 },
  { name: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { name: 'Marina Beach', district: 'Chennai', state: 'Tamil Nadu', lat: 13.05, lng: 80.28 },
  { name: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { name: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { name: 'Kochi', district: 'Ernakulam', state: 'Kerala', lat: 9.93, lng: 76.26 },
  { name: 'Fort Kochi', district: 'Ernakulam', state: 'Kerala', lat: 9.96, lng: 76.24 },
  { name: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
  { name: 'Vidisha Road', district: 'Bhopal', state: 'Madhya Pradesh', lat: 23.25, lng: 77.4 },
  { name: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Indore', district: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { name: 'Whitefield', district: 'Bengaluru', state: 'Karnataka', lat: 12.97, lng: 77.75 },
  { name: 'Bengaluru', district: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Mysuru', district: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { name: 'Patna City', district: 'Patna', state: 'Bihar', lat: 25.6, lng: 85.14 },
  { name: 'Patna', district: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { name: 'Puri Beach Road', district: 'Puri', state: 'Odisha', lat: 19.8, lng: 85.83 },
  { name: 'Puri', district: 'Puri', state: 'Odisha', lat: 19.8135, lng: 85.8312 },
  { name: 'Bhubaneswar', district: 'Khordha', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
  { name: 'GT Road', district: 'Amritsar', state: 'Punjab', lat: 31.63, lng: 74.87 },
  { name: 'Amritsar', district: 'Amritsar', state: 'Punjab', lat: 31.634, lng: 74.8723 },
  { name: 'Kutch', district: 'Bhuj', state: 'Gujarat', lat: 23.24, lng: 69.67 },
  { name: 'Bhuj', district: 'Bhuj', state: 'Gujarat', lat: 23.2419, lng: 69.6669 },
  { name: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Surat', district: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  { name: 'Vadodara', district: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
  { name: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867 },
  { name: 'Vijayawada', district: 'NTR', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.648 },
  { name: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { name: 'Pune', district: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { name: 'Nashik', district: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'Raipur', district: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296 },
  { name: 'Ranchi', district: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 },
  { name: 'Shimla', district: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
  { name: 'Dehradun', district: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322 },
  { name: 'Srinagar', district: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973 },
  { name: 'Panaji', district: 'North Goa', state: 'Goa', lat: 15.4909, lng: 73.8278 },
  { name: 'Gandhinagar', district: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369 },
]

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function nearestLocality(lat: number, lng: number): Locality {
  let best = INDIAN_LOCALITIES[0]
  let bestDist = Infinity
  for (const loc of INDIAN_LOCALITIES) {
    const d = haversineKm(lat, lng, loc.lat, loc.lng)
    if (d < bestDist) {
      bestDist = d
      best = loc
    }
  }
  return best
}

export function findLocalityByName(name: string): Locality | null {
  const q = name.trim().toLowerCase()
  if (!q) return null
  const exact = INDIAN_LOCALITIES.find((l) => l.name.toLowerCase() === q)
  if (exact) return exact
  const partial = INDIAN_LOCALITIES.find(
    (l) => l.name.toLowerCase().includes(q) || q.includes(l.name.toLowerCase())
  )
  return partial ?? null
}
