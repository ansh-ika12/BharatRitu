import { EventType, ReportStatus } from './constants'
import { CredibilityBreakdown } from './credibility'

export interface Report {
  id: string
  eventType: EventType
  status: ReportStatus
  credibility: number
  locality: string
  district: string
  state: string
  lat: number
  lng: number
  source: string
  reportCount: number
  authorCount: number
  text: string
  minutesAgo: number
  credibilityBreakdown?: CredibilityBreakdown
  verificationNote?: string
}

export const MOCK_REPORTS: Report[] = [
  { id: 'r1', eventType: 'rainfall', status: 'verified', credibility: 0.92, locality: 'Andheri', district: 'Mumbai Suburban', state: 'Maharashtra', lat: 19.1197, lng: 72.8468, source: 'Citizen report', reportCount: 34, authorCount: 21, text: 'Heavy waterlogging near Andheri subway after continuous rain since morning.', minutesAgo: 6 },
  { id: 'r2', eventType: 'flood', status: 'verified', credibility: 0.88, locality: 'Kaziranga', district: 'Golaghat', state: 'Assam', lat: 26.6, lng: 93.4, source: 'Reddit', reportCount: 51, authorCount: 39, text: 'Brahmaputra water levels rising fast, low-lying villages flooded.', minutesAgo: 14 },
  { id: 'r3', eventType: 'heatwave', status: 'under_review', credibility: 0.55, locality: 'Civil Lines', district: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.45, lng: 81.84, source: 'News RSS', reportCount: 9, authorCount: 7, text: 'Temperatures crossing 45°C, hospitals reporting heatstroke cases.', minutesAgo: 22 },
  { id: 'r4', eventType: 'dust_storm', status: 'verified', credibility: 0.81, locality: 'Bikaner', district: 'Bikaner', state: 'Rajasthan', lat: 28.02, lng: 73.31, source: 'YouTube', reportCount: 18, authorCount: 12, text: 'Visibility dropped sharply as a dust storm swept through the city.', minutesAgo: 9 },
  { id: 'r5', eventType: 'thunderstorm', status: 'verified', credibility: 0.9, locality: 'Salt Lake', district: 'Kolkata', state: 'West Bengal', lat: 22.58, lng: 88.42, source: 'Citizen report', reportCount: 27, authorCount: 19, text: 'Loud thunder and lightning strikes reported, trees uprooted.', minutesAgo: 3 },
  { id: 'r6', eventType: 'fog', status: 'verified', credibility: 0.76, locality: 'Connaught Place', district: 'New Delhi', state: 'Delhi', lat: 28.63, lng: 77.22, source: 'News RSS', reportCount: 14, authorCount: 10, text: 'Dense fog reduces visibility to under 50 metres, flights delayed.', minutesAgo: 40 },
  { id: 'r7', eventType: 'strong_wind', status: 'under_review', credibility: 0.48, locality: 'Marina Beach', district: 'Chennai', state: 'Tamil Nadu', lat: 13.05, lng: 80.28, source: 'Reddit', reportCount: 6, authorCount: 5, text: 'Strong winds along the coast, fishing boats advised to stay ashore.', minutesAgo: 18 },
  { id: 'r8', eventType: 'rainfall', status: 'flagged', credibility: 0.18, locality: 'Hazratganj', district: 'Lucknow', state: 'Uttar Pradesh', lat: 26.85, lng: 80.94, source: 'X (unverified)', reportCount: 4, authorCount: 1, text: '"Hazratganj completely flooded" — image traced back to an older monsoon photo.', minutesAgo: 27 },
  { id: 'r9', eventType: 'flood', status: 'verified', credibility: 0.85, locality: 'Kochi', district: 'Ernakulam', state: 'Kerala', lat: 9.93, lng: 76.26, source: 'Citizen report', reportCount: 22, authorCount: 16, text: 'Backwaters overflowing into residential lanes near Kochi.', minutesAgo: 11 },
  { id: 'r10', eventType: 'heatwave', status: 'verified', credibility: 0.79, locality: 'Vidisha Road', district: 'Bhopal', state: 'Madhya Pradesh', lat: 23.25, lng: 77.4, source: 'News RSS', reportCount: 13, authorCount: 9, text: 'Peak afternoon temperatures pushing past 42°C for the third day.', minutesAgo: 33 },
  { id: 'r11', eventType: 'thunderstorm', status: 'under_review', credibility: 0.6, locality: 'Whitefield', district: 'Bengaluru', state: 'Karnataka', lat: 12.97, lng: 77.75, source: 'Reddit', reportCount: 8, authorCount: 6, text: 'Sudden hailstorm alongside thunder in the eastern suburbs.', minutesAgo: 5 },
  { id: 'r12', eventType: 'rainfall', status: 'verified', credibility: 0.94, locality: 'Patna City', district: 'Patna', state: 'Bihar', lat: 25.6, lng: 85.14, source: 'Citizen report', reportCount: 29, authorCount: 20, text: 'Continuous rain since last night, several roads waterlogged.', minutesAgo: 2 },
  { id: 'r13', eventType: 'rainfall', status: 'verified', credibility: 0.87, locality: 'Bandra', district: 'Mumbai Suburban', state: 'Maharashtra', lat: 19.06, lng: 72.83, source: 'Citizen report', reportCount: 16, authorCount: 11, text: 'Steady rain through the afternoon, minor waterlogging near the station.', minutesAgo: 130 },
  { id: 'r14', eventType: 'flood', status: 'under_review', credibility: 0.52, locality: 'Dibrugarh', district: 'Dibrugarh', state: 'Assam', lat: 27.48, lng: 94.9, source: 'News RSS', reportCount: 7, authorCount: 5, text: 'River levels approaching the danger mark, embankment being monitored.', minutesAgo: 200 },
  { id: 'r15', eventType: 'heatwave', status: 'verified', credibility: 0.83, locality: 'Jodhpur City', district: 'Jodhpur', state: 'Rajasthan', lat: 26.29, lng: 73.02, source: 'Citizen report', reportCount: 11, authorCount: 8, text: 'Second consecutive day above 44°C, advisories issued for outdoor work.', minutesAgo: 260 },
  { id: 'r16', eventType: 'strong_wind', status: 'verified', credibility: 0.8, locality: 'Puri Beach Road', district: 'Puri', state: 'Odisha', lat: 19.8, lng: 85.83, source: 'Citizen report', reportCount: 15, authorCount: 10, text: 'Strong onshore winds toppling temporary stalls along the coast road.', minutesAgo: 320 },
  { id: 'r17', eventType: 'fog', status: 'verified', credibility: 0.72, locality: 'GT Road', district: 'Amritsar', state: 'Punjab', lat: 31.63, lng: 74.87, source: 'News RSS', reportCount: 10, authorCount: 8, text: 'Thick fog since early morning, highway visibility below 100m.', minutesAgo: 400 },
  { id: 'r18', eventType: 'thunderstorm', status: 'flagged', credibility: 0.15, locality: 'Howrah Bridge', district: 'Howrah', state: 'West Bengal', lat: 22.585, lng: 88.34, source: 'X (unverified)', reportCount: 3, authorCount: 1, text: 'Claim of "record hailstorm" traced to footage from a different country.', minutesAgo: 480 },
  { id: 'r19', eventType: 'dust_storm', status: 'under_review', credibility: 0.58, locality: 'Kutch', district: 'Bhuj', state: 'Gujarat', lat: 23.24, lng: 69.67, source: 'Reddit', reportCount: 6, authorCount: 4, text: 'Low visibility reported near the salt flats due to blowing dust.', minutesAgo: 560 },
  { id: 'r20', eventType: 'rainfall', status: 'verified', credibility: 0.9, locality: 'Fort Kochi', district: 'Ernakulam', state: 'Kerala', lat: 9.96, lng: 76.24, source: 'Citizen report', reportCount: 20, authorCount: 14, text: 'Pre-monsoon showers picking up intensity through the evening.', minutesAgo: 620 },
]