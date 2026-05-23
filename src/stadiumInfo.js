/**
 * Stadium reference data for the 16 World Cup 2026 venues.
 * Keyed by lowercase substring matchers so we can resolve the AI's stadium
 * string (which may be "SoFi Stadium", "Los Angeles Stadium", or
 * "Los Angeles Stadium (SoFi)") via lookupStadium().
 */
const STADIUMS = [
  {
    match: ['metlife', 'new york new jersey', 'east rutherford'],
    name: 'MetLife Stadium (New York New Jersey Stadium)',
    capacity: '82,500',
    opened: '2010',
    history: 'Home of the NFL Giants and Jets. Hosted WrestleMania 29 and Copa America Centenario 2016 final. Selected for the 2026 World Cup Final on July 19, 2026.',
    surroundings: 'Sits in the Meadowlands Sports Complex with American Dream mall next door (100+ stores, indoor ski slope, water park). 7 miles west of Midtown Manhattan.',
    traffic: 'Heavy congestion on NJ Turnpike and Route 3 on match days. NJ Transit runs dedicated trains from Secaucus Junction (15 min from Penn Station). Lot parking sells out 3+ hours pre-match.',
    nearby: ['American Dream Mall', 'Liberty State Park (15 min)', 'Manhattan skyline views from Weehawken'],
  },
  {
    match: ['sofi', 'los angeles stadium', 'inglewood'],
    name: 'SoFi Stadium (Los Angeles Stadium)',
    capacity: '70,000',
    opened: '2020',
    history: 'Home of the LA Rams and Chargers. Hosted Super Bowl LVI (2022), the College Football Playoff Championship, and the 2026 Olympics opening ceremony. Will host quarterfinal in 2026.',
    surroundings: 'Anchor of the 300-acre Hollywood Park entertainment district. The Forum, Intuit Dome (Clippers), and the YouTube Theater are all on-site.',
    traffic: 'Notorious LA traffic on I-405 and I-110. Metro K Line stops at Downtown Inglewood (10-min walk). Rideshare zones on Prairie Ave; on-site parking is pricey and pre-book essential.',
    nearby: ['The Forum', 'Intuit Dome', 'Hollywood Park Casino', 'LAX (4 miles)'],
  },
  {
    match: ['at&t stadium', 'dallas stadium', 'arlington'],
    name: 'AT&T Stadium (Dallas Stadium)',
    capacity: '94,000',
    opened: '2009',
    history: 'Home of the Dallas Cowboys — "Jerry World." Largest venue at the 2026 tournament. Hosted Super Bowl XLV, multiple College Football Playoff games, and WrestleMania 32 (which set the venue\'s all-time attendance record at 101,763).',
    surroundings: 'Arlington Entertainment District: Globe Life Field (Texas Rangers) is next door, Six Flags Over Texas is across the highway, and Texas Live! has bars and restaurants on the same block.',
    traffic: 'I-30 backs up severely 2 hours pre-match. No light rail — rideshare or driving only. Trinity Metro runs game-day shuttles from Fort Worth. Lots open 5+ hours early.',
    nearby: ['Globe Life Field', 'Six Flags Over Texas', 'Texas Live!', 'Dallas/Fort Worth Airport (20 min)'],
  },
  {
    match: ['mercedes-benz', 'mercedes benz', 'atlanta stadium'],
    name: 'Mercedes-Benz Stadium (Atlanta Stadium)',
    capacity: '75,000',
    opened: '2017',
    history: 'Home of Atlanta Falcons and Atlanta United FC. Hosted Super Bowl LIII (2019) and the 2018 & 2025 College Football Championships. Famous for its retractable "camera aperture" roof.',
    surroundings: 'Downtown Atlanta. Centennial Olympic Park, the Georgia Aquarium, and the World of Coca-Cola are all within a 5-minute walk.',
    traffic: 'MARTA rail (GWCC/CNN Center station) drops you 2 blocks from the gate — by far the best option. Driving I-75/85 downtown is gridlocked pre-match.',
    nearby: ['Centennial Olympic Park', 'Georgia Aquarium', 'World of Coca-Cola', 'CNN Center', 'State Farm Arena'],
  },
  {
    match: ['hard rock', 'miami stadium', 'miami gardens'],
    name: 'Hard Rock Stadium (Miami Stadium)',
    capacity: '65,000',
    opened: '1987',
    history: 'Home of the Miami Dolphins and the Miami Open tennis tournament. Hosted six Super Bowls, the 2024 & 2026 Copa America Final, and the F1 Miami Grand Prix circuit wraps the venue.',
    surroundings: 'Miami Gardens, 15 miles north of Miami Beach. Not walkable — purely a stadium complex with parking lots. The Hard Rock Live concert venue is on-site.',
    traffic: 'I-95 and Florida Turnpike both jam pre-match. Tri-Rail station at Opa-Locka requires a shuttle. Most fans drive or rideshare; allow 90 min from South Beach.',
    nearby: ['Aventura Mall (15 min)', 'Sun Life Stadium concert venue', 'Miami Beach (30+ min)', 'Calder Casino (5 min)'],
  },
  {
    match: ['arrowhead', 'kansas city stadium'],
    name: 'Arrowhead Stadium (Kansas City Stadium)',
    capacity: '76,000',
    opened: '1972',
    history: 'Home of the 3-time Super Bowl champion Kansas City Chiefs. Holds the Guinness World Record for loudest outdoor stadium (142.2 dB, 2014). Hosted the 1976 MLB All-Star Game and AFC Championship games.',
    surroundings: 'Truman Sports Complex, paired with Kauffman Stadium (Royals) next door. Surrounded by parking — not pedestrian-friendly. Downtown KC is 10 miles west.',
    traffic: 'I-70 access only. No rail. Tailgating is the regional sport — lots open 4 hours early and pre-game in lots is a destination in itself. Allow 2 hours from downtown on match days.',
    nearby: ['Kauffman Stadium', 'Power & Light District downtown (20 min)', 'Country Club Plaza (20 min)', 'KC BBQ joints (Joe\'s, Q39, Gates)'],
  },
  {
    match: ["levi's", 'san francisco bay area', 'santa clara'],
    name: "Levi's Stadium (San Francisco Bay Area Stadium)",
    capacity: '68,500',
    opened: '2014',
    history: 'Home of the San Francisco 49ers. Hosted Super Bowl 50 (2016), the College Football National Championship, and the 2026 Copa America. First major American sports venue to achieve LEED Gold certification.',
    surroundings: 'Santa Clara, in the heart of Silicon Valley — Apple Park, Nvidia HQ, and Intel\'s campus are within 5 miles. Great America amusement park is next door.',
    traffic: 'VTA light rail stops directly at the stadium. Caltrain (Mountain View) + VTA shuttle works from San Francisco. Driving US-101 is rough 90+ min before kickoff.',
    nearby: ["California's Great America", 'Santana Row (high-end shopping, 10 min)', 'Apple Park Visitor Center', 'Computer History Museum'],
  },
  {
    match: ['lincoln financial', 'philadelphia stadium'],
    name: 'Lincoln Financial Field (Philadelphia Stadium)',
    capacity: '69,000',
    opened: '2003',
    history: 'Home of the Philadelphia Eagles. Hosted the 2003 MLS Cup, multiple Army-Navy games, and the famous 2017 NFC Championship snow game. Will host group stage and Round of 16 in 2026.',
    surroundings: 'South Philly Sports Complex with Citizens Bank Park (Phillies) and Wells Fargo Center (76ers, Flyers) on the same block. Xfinity Live! entertainment district sits in the middle.',
    traffic: 'SEPTA Broad Street Line ends at NRG Station, a 10-minute walk to the stadium — the best way in. Driving I-95 is congested but workable.',
    nearby: ['Citizens Bank Park', 'Wells Fargo Center', 'Xfinity Live!', "Pat's & Geno's cheesesteaks (10 min)", 'Independence Hall (15 min)'],
  },
  {
    match: ['nrg stadium', 'houston stadium'],
    name: 'NRG Stadium (Houston Stadium)',
    capacity: '72,000',
    opened: '2002',
    history: 'Home of the Houston Texans and the Houston Livestock Show and Rodeo (world\'s largest). First NFL stadium with a retractable roof. Hosted Super Bowls XXXVIII and LI (the Patriots\' 28-3 comeback).',
    surroundings: 'NRG Park complex with the historic Astrodome ("the 8th Wonder of the World") right next door. The Medical Center, Hermann Park, and the Houston Zoo are within 3 miles.',
    traffic: 'METRORail Red Line stops at Stadium Park/Astrodome — direct, 25 min from downtown. Loop 610 driving is slow pre-kickoff. Parking is plentiful but rideshare drop-offs are far from gates.',
    nearby: ['Astrodome (exterior tours)', 'Hermann Park & Houston Zoo', 'Museum District (10 min)', 'NASA Johnson Space Center (30 min)'],
  },
  {
    match: ['gillette', 'boston stadium', 'foxborough'],
    name: 'Gillette Stadium (Boston Stadium)',
    capacity: '65,000',
    opened: '2002',
    history: 'Home of the 6-time Super Bowl champion New England Patriots and the New England Revolution (MLS). Hosted the 2026 Copa America Final. The "Lighthouse" tower at the north end is the stadium\'s signature feature.',
    surroundings: 'Patriot Place, an open-air shopping/dining complex with 80+ stores, a Showcase Cinema de Lux, and the Patriots Hall of Fame surrounds the stadium.',
    traffic: 'Foxborough is 30 miles south of Boston. MBTA runs special Patriots Train shuttles from South Station and Providence on event days. Driving I-93 → I-95 takes 1+ hour from Boston.',
    nearby: ['Patriot Place', 'Bass Pro Shops', 'Patriots Hall of Fame', 'Providence, RI (20 min south)', 'Boston (60 min north)'],
  },
  {
    match: ['lumen field', 'seattle stadium'],
    name: 'Lumen Field (Seattle Stadium)',
    capacity: '68,000',
    opened: '2002',
    history: 'Home of the Seattle Seahawks and Seattle Sounders FC (one of MLS\'s loudest crowds). The Seahawks held the Guinness loudest-crowd record (137.6 dB, 2013). Hosted the 2009 MLS Cup and multiple international friendlies.',
    surroundings: 'Adjacent to T-Mobile Park (Mariners) and Pioneer Square. Downtown Seattle, Pike Place Market, and the waterfront are all within a 15-minute walk.',
    traffic: 'Link light rail at Stadium Station drops you at the gate. SEA-TAC airport to stadium = 35 min by Link. Avoid driving I-5 during rush hour.',
    nearby: ['Pike Place Market', 'Space Needle (10 min)', 'Pioneer Square', 'T-Mobile Park', 'Waterfront ferries to Bainbridge'],
  },
  {
    match: ['bmo field', 'toronto stadium'],
    name: 'BMO Field (Toronto Stadium)',
    capacity: '45,000 (expanded for WC)',
    opened: '2007',
    history: 'Home of Toronto FC (MLS) and the Toronto Argonauts (CFL). Hosted the 2010 & 2017 MLS Cup Finals. Originally Canada\'s first soccer-specific stadium; capacity expanded with temporary seating for the World Cup.',
    surroundings: 'Exhibition Place on Toronto\'s waterfront. Ontario Place, Princes\' Gates, and the Liberty Village neighborhood (bars, restaurants) are all walkable.',
    traffic: 'GO Train\'s Exhibition Station is 5 min walk. The 509/511 streetcars run directly from Union Station downtown (15 min). Driving Lakeshore Blvd is slow on event days.',
    nearby: ['CN Tower (15 min)', 'Ripley\'s Aquarium', 'Liberty Village', 'Ontario Place', 'Distillery District (20 min)'],
  },
  {
    match: ['bc place', 'vancouver stadium'],
    name: 'BC Place (Vancouver Stadium)',
    capacity: '54,500',
    opened: '1983 (renovated 2011)',
    history: 'Home of BC Lions (CFL) and Vancouver Whitecaps (MLS). Hosted the 2010 Winter Olympics opening and closing ceremonies and the 2015 FIFA Women\'s World Cup Final. Iconic retractable cable-supported roof.',
    surroundings: 'Downtown Vancouver, on the edge of Yaletown and False Creek. Rogers Arena (Canucks) is next door. Granville Island, Gastown, and Robson Street shopping are all a short walk.',
    traffic: 'SkyTrain Stadium-Chinatown station is at the front door. Vancouver International Airport is 25 min on the Canada Line. Driving downtown is doable but parking is expensive.',
    nearby: ['Rogers Arena', 'Yaletown', 'Granville Island Market', 'Gastown steam clock', 'Stanley Park (15 min)'],
  },
  {
    match: ['azteca', 'banorte', 'mexico city stadium'],
    name: 'Estadio Azteca / Banorte (Mexico City Stadium)',
    capacity: '87,000',
    opened: '1966',
    history: 'The only stadium to host THREE World Cup tournaments (1970, 1986, 2026) and the only one to host two World Cup Finals. Site of Maradona\'s "Hand of God" and "Goal of the Century" (1986) and Pelé\'s 1970 final win. Hosts the 2026 opening match.',
    surroundings: 'Coyoacán borough in southern Mexico City. Surrounded by residential neighborhoods. The Mercado de Coyoacán and Frida Kahlo Museum are 15 min north.',
    traffic: 'Mexico City Metro Línea 2 + Tren Ligero to Estadio Azteca station = direct. CDMX traffic is among the world\'s worst — never drive on match day. Allow 2 hours from Centro Histórico.',
    nearby: ['Frida Kahlo Museum (Coyoacán)', 'Xochimilco floating gardens (20 min)', 'UNAM campus murals', 'Estadio Olímpico Universitario'],
  },
  {
    match: ['akron', 'guadalajara', 'zapopan'],
    name: 'Estadio Akron (Estadio Guadalajara)',
    capacity: '49,800',
    opened: '2010',
    history: 'Home of Chivas de Guadalajara, Mexico\'s most popular club. Hosted the 2011 Pan American Games opening ceremony and multiple Liga MX finals. Distinctive cloud-like exterior shell design.',
    surroundings: 'Zapopan, in the Guadalajara metro area. The JVC Convention Center is next door. The historic center of Zapopan (Basílica de Zapopan) is 15 min east.',
    traffic: 'Mi Macro Periférico BRT runs near the venue. No metro line directly. Driving Av. Vallarta from central Guadalajara takes 30-45 min on match days.',
    nearby: ['Basílica de Zapopan', 'Tlaquepaque artisan district (20 min)', 'Guadalajara Cathedral (20 min)', 'Tequila town (90 min)'],
  },
  {
    match: ['bbva', 'monterrey', 'guadalupe'],
    name: 'Estadio BBVA (Estadio Monterrey)',
    capacity: '53,500',
    opened: '2015',
    history: 'Home of CF Monterrey ("Rayados"). Hosted the 2019 FIFA Club World Cup and multiple Liga MX finals. Known as "El Gigante de Acero" — the Steel Giant — for its industrial design that mirrors Monterrey\'s steel-industry heritage.',
    surroundings: 'Guadalupe, in the Monterrey metro area, set against the dramatic Cerro de la Silla mountain backdrop. Parque Fundidora (industrial-heritage park) is 15 min west.',
    traffic: 'No metro line — driving or rideshare only. Av. Pablo Livas access is heavily congested 2 hours pre-match. Allow 45 min from central Monterrey.',
    nearby: ['Parque Fundidora', 'Macroplaza (downtown Monterrey)', 'Cerro de la Silla viewpoints', 'Barrio Antiguo nightlife'],
  },
]

/**
 * Resolve a stadium string (e.g. "SoFi Stadium" or "Los Angeles Stadium (SoFi)")
 * to its info entry by checking against all matcher substrings.
 */
export function lookupStadium(stadiumString) {
  if (!stadiumString) return null
  const s = stadiumString.toLowerCase()
  return STADIUMS.find(entry => entry.match.some(m => s.includes(m))) || null
}

/**
 * Nearby points-of-interest (3 hotels + 3 restaurants) per stadium.
 * Coordinates are realistic offsets from each stadium for the demo map.
 */
const NEARBY = [
  {
    match: ['metlife', 'new york new jersey', 'east rutherford'],
    hotels: [
      { id: 'h-met-1', type: 'hotel', title: 'Hilton Meadowlands', lat: 40.8367, lng: -74.0716, details: { address: '2 Meadowlands Plaza, East Rutherford, NJ', pricePerNight: '$280/night', walkDistance: '1.2 mi to stadium', amenities: 'Pool, restaurant, free shuttle on match days', description: 'Closest full-service hotel to MetLife. Free shuttle to the stadium 4 hours before kickoff.' } },
      { id: 'h-met-2', type: 'hotel', title: 'Sheraton Lincoln Harbor', lat: 40.7745, lng: -74.0259, details: { address: '500 Harbor Blvd, Weehawken, NJ', pricePerNight: '$320/night', walkDistance: '8 mi (15 min by car)', amenities: 'Manhattan skyline views, gym, ferry to NYC', description: 'On the Hudson with NYC skyline views. NJ Transit bus to stadium.' } },
      { id: 'h-met-3', type: 'hotel', title: 'Hampton Inn Carlstadt', lat: 40.8378, lng: -74.0500, details: { address: '300 Washington Ave, Carlstadt, NJ', pricePerNight: '$180/night', walkDistance: '2 mi (10 min by car)', amenities: 'Free breakfast, parking, gym', description: 'Budget-friendly option just north of the Meadowlands.' } },
    ],
    restaurants: [
      { id: 'r-met-1', type: 'restaurant', title: 'Redd\'s Restaurant', lat: 40.8302, lng: -74.0815, details: { address: '317 Hackensack St, Carlstadt, NJ', cuisine: 'American steakhouse', hours: '11:30 AM – 11 PM', priceRange: '$$$', signature: 'Dry-aged ribeye, Sunday brunch' } },
      { id: 'r-met-2', type: 'restaurant', title: 'Park & Orchard', lat: 40.8243, lng: -74.0931, details: { address: '227 Park Ave, East Rutherford, NJ', cuisine: 'Eclectic / health-conscious', hours: '5 PM – 10 PM', priceRange: '$$', signature: 'Famous wine list, vegan-friendly' } },
      { id: 'r-met-3', type: 'restaurant', title: 'Il Villaggio', lat: 40.8275, lng: -74.0608, details: { address: '651 NJ-17, Carlstadt, NJ', cuisine: 'Italian', hours: '5 PM – 11 PM', priceRange: '$$$', signature: 'Classic red-sauce Italian, old-school waiters' } },
    ],
  },
  {
    match: ['sofi', 'los angeles stadium', 'inglewood'],
    hotels: [
      { id: 'h-sofi-1', type: 'hotel', title: 'Cambria Hotel LAX', lat: 33.9466, lng: -118.3640, details: { address: '199 Continental Blvd, El Segundo, CA', pricePerNight: '$240/night', walkDistance: '3 mi to SoFi', amenities: 'Rooftop bar, pool, gym', description: 'Modern hotel between LAX and SoFi, easy rideshare to the stadium.' } },
      { id: 'h-sofi-2', type: 'hotel', title: 'Renaissance LAX', lat: 33.9501, lng: -118.3796, details: { address: '9620 Airport Blvd, Los Angeles, CA', pricePerNight: '$310/night', walkDistance: '4 mi to SoFi', amenities: 'Pool, fitness center, on-site restaurant', description: 'Upscale chain right by LAX with shuttle service.' } },
      { id: 'h-sofi-3', type: 'hotel', title: 'Hyatt House LAX/Century', lat: 33.9608, lng: -118.3601, details: { address: '6261 W Century Blvd, Los Angeles, CA', pricePerNight: '$260/night', walkDistance: '2.5 mi to SoFi', amenities: 'Kitchenettes, free breakfast, pool', description: 'Extended-stay style, popular with families.' } },
    ],
    restaurants: [
      { id: 'r-sofi-1', type: 'restaurant', title: 'Three Weavers Brewing', lat: 33.9498, lng: -118.3490, details: { address: '1031 W Manchester Blvd, Inglewood, CA', cuisine: 'Craft brewery + food trucks', hours: '3 PM – 10 PM', priceRange: '$$', signature: 'Local IPAs, rotating taco trucks' } },
      { id: 'r-sofi-2', type: 'restaurant', title: 'Stuff I Eat', lat: 33.9610, lng: -118.3531, details: { address: '114 N Market St, Inglewood, CA', cuisine: 'Vegan soul food', hours: '11 AM – 8 PM', priceRange: '$$', signature: 'Macaroni & "cheese", smoothies' } },
      { id: 'r-sofi-3', type: 'restaurant', title: 'Dulan\'s Soul Food', lat: 33.9619, lng: -118.3338, details: { address: '202 E Manchester Blvd, Inglewood, CA', cuisine: 'Southern soul food', hours: '11 AM – 9 PM', priceRange: '$$', signature: 'Fried chicken, oxtails, cornbread' } },
    ],
  },
  {
    match: ['at&t stadium', 'dallas stadium', 'arlington'],
    hotels: [
      { id: 'h-att-1', type: 'hotel', title: 'Live! by Loews', lat: 32.7517, lng: -97.0848, details: { address: '1600 E Randol Mill Rd, Arlington, TX', pricePerNight: '$330/night', walkDistance: '0.5 mi (walkable)', amenities: 'Pool, spa, on-site dining at Texas Live!', description: 'Most walkable option — directly attached to Texas Live!' } },
      { id: 'h-att-2', type: 'hotel', title: 'Sheraton Arlington', lat: 32.7340, lng: -97.1077, details: { address: '1500 Convention Center Dr, Arlington, TX', pricePerNight: '$240/night', walkDistance: '1.5 mi to stadium', amenities: 'Pool, gym, restaurant', description: 'Near the convention center, easy shuttle to AT&T Stadium.' } },
      { id: 'h-att-3', type: 'hotel', title: 'Hilton Arlington', lat: 32.7261, lng: -97.0931, details: { address: '2401 E Lamar Blvd, Arlington, TX', pricePerNight: '$210/night', walkDistance: '2 mi to stadium', amenities: 'Pool, lounge, free parking', description: 'Solid mid-range option a short rideshare away.' } },
    ],
    restaurants: [
      { id: 'r-att-1', type: 'restaurant', title: 'Texas Live!', lat: 32.7493, lng: -97.0828, details: { address: '1650 E Randol Mill Rd, Arlington, TX', cuisine: 'Sports bar / multi-venue', hours: '11 AM – 2 AM', priceRange: '$$', signature: 'Pregame hub with Troy Aikman\'s, Live! Arena bars' } },
      { id: 'r-att-2', type: 'restaurant', title: 'Cartwright\'s Ranch House', lat: 32.7553, lng: -97.0788, details: { address: '4400 W Sublett Rd, Arlington, TX', cuisine: 'Texas BBQ / steaks', hours: '11 AM – 10 PM', priceRange: '$$', signature: 'Chicken-fried steak, brisket platter' } },
      { id: 'r-att-3', type: 'restaurant', title: 'Mariano\'s Hacienda', lat: 32.7382, lng: -97.0810, details: { address: '2614 Majesty Dr, Arlington, TX', cuisine: 'Tex-Mex', hours: '11 AM – 10 PM', priceRange: '$$', signature: 'Inventor of the frozen margarita machine' } },
    ],
  },
  {
    match: ['mercedes-benz', 'mercedes benz', 'atlanta stadium'],
    hotels: [
      { id: 'h-atl-1', type: 'hotel', title: 'Omni Atlanta CNN Center', lat: 33.7595, lng: -84.3957, details: { address: '100 CNN Center, Atlanta, GA', pricePerNight: '$290/night', walkDistance: '0.3 mi (walkable)', amenities: 'Two towers, pool, on-site dining', description: 'Connected to CNN Center, walkable to the stadium.' } },
      { id: 'h-atl-2', type: 'hotel', title: 'Embassy Suites Centennial', lat: 33.7635, lng: -84.3925, details: { address: '267 Marietta St NW, Atlanta, GA', pricePerNight: '$250/night', walkDistance: '0.5 mi', amenities: 'Free breakfast, evening reception, suites', description: 'All-suite hotel a few blocks from the stadium.' } },
      { id: 'h-atl-3', type: 'hotel', title: 'Hotel Indigo Downtown', lat: 33.7702, lng: -84.3858, details: { address: '230 Peachtree St NE, Atlanta, GA', pricePerNight: '$220/night', walkDistance: '0.8 mi', amenities: 'Boutique, rooftop bar, gym', description: 'Stylish boutique option in central downtown.' } },
    ],
    restaurants: [
      { id: 'r-atl-1', type: 'restaurant', title: 'STATS Brewpub', lat: 33.7560, lng: -84.3923, details: { address: '300 Marietta St NW, Atlanta, GA', cuisine: 'American sports bar', hours: '11 AM – 12 AM', priceRange: '$$', signature: 'Tabletop beer taps, wings' } },
      { id: 'r-atl-2', type: 'restaurant', title: 'Sweet Auburn BBQ', lat: 33.7560, lng: -84.3805, details: { address: '656 N Highland Ave NE, Atlanta, GA', cuisine: 'Southern BBQ + Asian fusion', hours: '11 AM – 9 PM', priceRange: '$$', signature: 'Brisket bahn mi, korean wings' } },
      { id: 'r-atl-3', type: 'restaurant', title: 'The Varsity', lat: 33.7706, lng: -84.3893, details: { address: '61 North Ave NW, Atlanta, GA', cuisine: 'American diner', hours: '10 AM – 11 PM', priceRange: '$', signature: 'World\'s largest drive-in; chili dogs, FO (frosted orange)' } },
    ],
  },
  {
    match: ['hard rock', 'miami stadium', 'miami gardens'],
    hotels: [
      { id: 'h-mia-1', type: 'hotel', title: 'Aloft Miami Doral', lat: 25.8211, lng: -80.3505, details: { address: '3702 NW 87th Ave, Doral, FL', pricePerNight: '$230/night', walkDistance: '11 mi (20 min)', amenities: 'Pool, bar, gym', description: 'Modern option between airport and stadium.' } },
      { id: 'h-mia-2', type: 'hotel', title: 'Hilton Miami Aventura', lat: 25.9582, lng: -80.1432, details: { address: '2885 NE 191st St, Aventura, FL', pricePerNight: '$310/night', walkDistance: '8 mi to stadium', amenities: 'Pool, restaurant, near Aventura Mall', description: 'Closest upscale option with mall access.' } },
      { id: 'h-mia-3', type: 'hotel', title: 'Holiday Inn Miami West', lat: 25.9070, lng: -80.3010, details: { address: '7677 W 19th Ave, Hialeah, FL', pricePerNight: '$180/night', walkDistance: '7 mi (15 min)', amenities: 'Pool, free breakfast, free parking', description: 'Budget-friendly mid-county option.' } },
    ],
    restaurants: [
      { id: 'r-mia-1', type: 'restaurant', title: 'Joe\'s Stone Crab', lat: 25.7681, lng: -80.1382, details: { address: '11 Washington Ave, Miami Beach, FL', cuisine: 'Seafood (institution)', hours: '5 PM – 10 PM (closed summer)', priceRange: '$$$$', signature: 'Stone crab claws, key lime pie' } },
      { id: 'r-mia-2', type: 'restaurant', title: 'Versailles Restaurant', lat: 25.7656, lng: -80.2575, details: { address: '3555 SW 8th St, Miami, FL', cuisine: 'Cuban', hours: '8 AM – 1 AM', priceRange: '$$', signature: 'Cubano sandwich, ropa vieja, cafecito window' } },
      { id: 'r-mia-3', type: 'restaurant', title: 'Pollos & Jarras', lat: 25.9700, lng: -80.1490, details: { address: '19501 Biscayne Blvd, Aventura, FL', cuisine: 'Peruvian rotisserie', hours: '11 AM – 10 PM', priceRange: '$$', signature: 'Pollo a la brasa, ceviche, pisco sours' } },
    ],
  },
  {
    match: ['arrowhead', 'kansas city stadium'],
    hotels: [
      { id: 'h-kc-1', type: 'hotel', title: 'Crossroads Hotel KC', lat: 39.0921, lng: -94.5853, details: { address: '2101 Central St, Kansas City, MO', pricePerNight: '$240/night', walkDistance: '10 mi (15 min)', amenities: 'Boutique, rooftop, in-house restaurant', description: 'Trendy boutique in Crossroads Arts District.' } },
      { id: 'h-kc-2', type: 'hotel', title: 'Hampton Inn KC East', lat: 39.0376, lng: -94.4922, details: { address: '7641 NE 38th St, Kansas City, MO', pricePerNight: '$160/night', walkDistance: '2 mi to stadium', amenities: 'Free breakfast, pool, parking', description: 'Closest Hampton Inn to the Truman Sports Complex.' } },
      { id: 'h-kc-3', type: 'hotel', title: 'Loews KC Downtown', lat: 39.1019, lng: -94.5837, details: { address: '1515 Wyandotte St, Kansas City, MO', pricePerNight: '$280/night', walkDistance: '10 mi (15 min)', amenities: 'Upscale, pool, near Power & Light', description: 'New downtown flagship near nightlife district.' } },
    ],
    restaurants: [
      { id: 'r-kc-1', type: 'restaurant', title: 'Joe\'s Kansas City BBQ', lat: 39.0772, lng: -94.6064, details: { address: '3002 W 47th Ave, Kansas City, KS', cuisine: 'Kansas City BBQ', hours: '11 AM – 9 PM', priceRange: '$$', signature: 'Z-Man sandwich, burnt ends — gas-station BBQ legend' } },
      { id: 'r-kc-2', type: 'restaurant', title: 'Q39', lat: 39.0566, lng: -94.5905, details: { address: '1000 W 39th St, Kansas City, MO', cuisine: 'Modern BBQ', hours: '11 AM – 10 PM', priceRange: '$$', signature: 'Burnt-end burger, smoked wings' } },
      { id: 'r-kc-3', type: 'restaurant', title: 'Gates Bar-B-Q', lat: 39.0344, lng: -94.5638, details: { address: '1325 E Emanuel Cleaver II Blvd, Kansas City, MO', cuisine: 'Kansas City BBQ', hours: '10 AM – 10 PM', priceRange: '$', signature: '"Hi, may I help you?" — classic KC sauce' } },
    ],
  },
  {
    match: ["levi's", 'san francisco bay area', 'santa clara'],
    hotels: [
      { id: 'h-lev-1', type: 'hotel', title: 'Hyatt Regency Santa Clara', lat: 37.4034, lng: -121.9743, details: { address: '5101 Great America Pkwy, Santa Clara, CA', pricePerNight: '$310/night', walkDistance: '0.5 mi (walkable)', amenities: 'Pool, restaurant, attached to convention center', description: 'Walking distance to Levi\'s — book early.' } },
      { id: 'h-lev-2', type: 'hotel', title: 'Marriott Santa Clara', lat: 37.4014, lng: -121.9831, details: { address: '2700 Mission College Blvd, Santa Clara, CA', pricePerNight: '$280/night', walkDistance: '0.6 mi', amenities: 'Pool, gym, on-site dining', description: 'Right by Great America park, very close to stadium.' } },
      { id: 'h-lev-3', type: 'hotel', title: 'Avatar Hotel Santa Clara', lat: 37.3823, lng: -121.9774, details: { address: '4200 Great America Pkwy, Santa Clara, CA', pricePerNight: '$220/night', walkDistance: '1.5 mi', amenities: 'Boutique, pool, free breakfast', description: 'Quirky boutique option, good value.' } },
    ],
    restaurants: [
      { id: 'r-lev-1', type: 'restaurant', title: 'Bourbon Steak (Levi\'s)', lat: 37.4034, lng: -121.9698, details: { address: '4900 Marie P DeBartolo Way, Santa Clara, CA', cuisine: 'Modern steakhouse', hours: '5 PM – 10 PM', priceRange: '$$$$', signature: 'Inside the stadium, by Michael Mina' } },
      { id: 'r-lev-2', type: 'restaurant', title: 'Santana Row', lat: 37.3217, lng: -121.9484, details: { address: '377 Santana Row, San Jose, CA', cuisine: 'Multi-restaurant district', hours: 'Varies (10 AM – 11 PM)', priceRange: '$$ – $$$$', signature: 'Outdoor European-style dining strip' } },
      { id: 'r-lev-3', type: 'restaurant', title: 'Pedro\'s Restaurant', lat: 37.3527, lng: -121.9802, details: { address: '3935 Freedom Cir, Santa Clara, CA', cuisine: 'Mexican', hours: '11 AM – 11 PM', priceRange: '$$', signature: 'Margarita pitchers, fajitas, since 1980' } },
    ],
  },
  {
    match: ['lincoln financial', 'philadelphia stadium'],
    hotels: [
      { id: 'h-phl-1', type: 'hotel', title: 'Holiday Inn Stadium', lat: 39.9094, lng: -75.1727, details: { address: '900 Packer Ave, Philadelphia, PA', pricePerNight: '$190/night', walkDistance: '0.6 mi (walkable)', amenities: 'Free breakfast, free parking, pool', description: 'The closest hotel to Lincoln Financial Field.' } },
      { id: 'h-phl-2', type: 'hotel', title: 'Aloft Philadelphia Downtown', lat: 39.9498, lng: -75.1700, details: { address: '101 N Broad St, Philadelphia, PA', pricePerNight: '$240/night', walkDistance: '4 mi (10 min by Broad St Line)', amenities: 'Modern, bar, gym', description: 'Center City option, easy SEPTA ride to stadium.' } },
      { id: 'h-phl-3', type: 'hotel', title: 'Sonesta Philadelphia', lat: 39.9533, lng: -75.1738, details: { address: '1800 Market St, Philadelphia, PA', pricePerNight: '$260/night', walkDistance: '4.5 mi', amenities: 'Pool, gym, downtown', description: 'Walkable to Rittenhouse Square and Reading Terminal.' } },
    ],
    restaurants: [
      { id: 'r-phl-1', type: 'restaurant', title: 'Pat\'s King of Steaks', lat: 39.9337, lng: -75.1592, details: { address: '1237 E Passyunk Ave, Philadelphia, PA', cuisine: 'Philly cheesesteaks', hours: '24 hours', priceRange: '$', signature: 'Original Philly cheesesteak (1930)' } },
      { id: 'r-phl-2', type: 'restaurant', title: 'Geno\'s Steaks', lat: 39.9335, lng: -75.1589, details: { address: '1219 S 9th St, Philadelphia, PA', cuisine: 'Philly cheesesteaks', hours: '24 hours', priceRange: '$', signature: 'Pat\'s rival, neon-lit corner across the street' } },
      { id: 'r-phl-3', type: 'restaurant', title: 'Xfinity Live!', lat: 39.9077, lng: -75.1716, details: { address: '1100 Pattison Ave, Philadelphia, PA', cuisine: 'Sports bar district', hours: '11 AM – 2 AM', priceRange: '$$', signature: 'NBC Sports Arena, PBR Bar, walking-distance pregame' } },
    ],
  },
  {
    match: ['nrg stadium', 'houston stadium'],
    hotels: [
      { id: 'h-hou-1', type: 'hotel', title: 'Holiday Inn NRG Park', lat: 29.6904, lng: -95.4145, details: { address: '8111 Kirby Dr, Houston, TX', pricePerNight: '$200/night', walkDistance: '0.6 mi (walkable)', amenities: 'Free shuttle to NRG, pool, free parking', description: 'Closest hotel to NRG Stadium with shuttle service.' } },
      { id: 'h-hou-2', type: 'hotel', title: 'Marriott Medical Center', lat: 29.7102, lng: -95.4031, details: { address: '6580 Fannin St, Houston, TX', pricePerNight: '$240/night', walkDistance: '2 mi (5 min METRORail)', amenities: 'Pool, gym, restaurant', description: 'Direct METRORail to stadium — Houston\'s best transit option.' } },
      { id: 'h-hou-3', type: 'hotel', title: 'Aloft Houston Downtown', lat: 29.7574, lng: -95.3622, details: { address: '820 Fannin St, Houston, TX', pricePerNight: '$220/night', walkDistance: '7 mi', amenities: 'Rooftop pool, modern, bar', description: 'Stylish downtown option, METRORail Red Line straight to NRG.' } },
    ],
    restaurants: [
      { id: 'r-hou-1', type: 'restaurant', title: 'The Breakfast Klub', lat: 29.7372, lng: -95.3815, details: { address: '3711 Travis St, Houston, TX', cuisine: 'Southern breakfast', hours: '7 AM – 2 PM', priceRange: '$$', signature: 'Chicken & waffles, katfish & grits' } },
      { id: 'r-hou-2', type: 'restaurant', title: 'Pappas Bar-B-Q', lat: 29.7099, lng: -95.4029, details: { address: '7050 S Main St, Houston, TX', cuisine: 'Texas BBQ', hours: '10:30 AM – 9:30 PM', priceRange: '$$', signature: 'Chopped beef, brisket sandwich' } },
      { id: 'r-hou-3', type: 'restaurant', title: 'Ninfa\'s on Navigation', lat: 29.7546, lng: -95.3358, details: { address: '2704 Navigation Blvd, Houston, TX', cuisine: 'Tex-Mex (institution)', hours: '11 AM – 10 PM', priceRange: '$$', signature: 'Inventor of fajitas (1973), beef tacos al carbon' } },
    ],
  },
  {
    match: ['gillette', 'boston stadium', 'foxborough'],
    hotels: [
      { id: 'h-bos-1', type: 'hotel', title: 'Renaissance Patriot Place', lat: 42.0936, lng: -71.2628, details: { address: '28 Patriot Pl, Foxborough, MA', pricePerNight: '$310/night', walkDistance: '0.3 mi (walkable)', amenities: 'Pool, on-site dining, walkable to gate', description: 'The only on-site hotel — directly attached to Patriot Place.' } },
      { id: 'h-bos-2', type: 'hotel', title: 'Hilton Garden Inn Foxborough', lat: 42.0721, lng: -71.2604, details: { address: '35 Foxborough Blvd, Foxborough, MA', pricePerNight: '$210/night', walkDistance: '2 mi (5 min)', amenities: 'Pool, free parking, gym', description: 'Best mid-range option near the stadium.' } },
      { id: 'h-bos-3', type: 'hotel', title: 'Omni Boston Seaport', lat: 42.3473, lng: -71.0431, details: { address: '450 Summer St, Boston, MA', pricePerNight: '$380/night', walkDistance: '30 mi (45-60 min)', amenities: 'Luxury, pool, near MBTA', description: 'Stay in Boston proper — MBTA shuttle on event days.' } },
    ],
    restaurants: [
      { id: 'r-bos-1', type: 'restaurant', title: 'Bar Louie Patriot Place', lat: 42.0921, lng: -71.2640, details: { address: '4 Patriot Pl, Foxborough, MA', cuisine: 'American sports bar', hours: '11 AM – 12 AM', priceRange: '$$', signature: 'Burgers, martinis, big TVs — walking distance to gate' } },
      { id: 'r-bos-2', type: 'restaurant', title: 'Splitsville Luxury Lanes', lat: 42.0915, lng: -71.2649, details: { address: '200 Patriot Pl, Foxborough, MA', cuisine: 'American + bowling', hours: '11 AM – 12 AM', priceRange: '$$', signature: 'Sushi-meets-bowling, big group spot' } },
      { id: 'r-bos-3', type: 'restaurant', title: 'Union Oyster House', lat: 42.3608, lng: -71.0568, details: { address: '41 Union St, Boston, MA', cuisine: 'New England seafood (since 1826)', hours: '11 AM – 10 PM', priceRange: '$$$', signature: 'America\'s oldest restaurant; oysters, clam chowder' } },
    ],
  },
  {
    match: ['lumen field', 'seattle stadium'],
    hotels: [
      { id: 'h-sea-1', type: 'hotel', title: 'Embassy Suites Pioneer Square', lat: 47.6018, lng: -122.3357, details: { address: '255 S King St, Seattle, WA', pricePerNight: '$280/night', walkDistance: '0.2 mi (walkable)', amenities: 'Free breakfast, suites, gym', description: 'Across the street from Lumen Field.' } },
      { id: 'h-sea-2', type: 'hotel', title: 'Silver Cloud Stadium', lat: 47.5972, lng: -122.3340, details: { address: '1046 1st Ave S, Seattle, WA', pricePerNight: '$240/night', walkDistance: '0.1 mi (walkable)', amenities: 'Rooftop pool with stadium view, free breakfast', description: 'Stadium-view rooms; classic match-day hotel.' } },
      { id: 'h-sea-3', type: 'hotel', title: 'The Edgewater Hotel', lat: 47.6126, lng: -122.3506, details: { address: '2411 Alaskan Way, Seattle, WA', pricePerNight: '$350/night', walkDistance: '1.2 mi', amenities: 'Waterfront, fireplace lounge, restaurant', description: 'The Beatles famously fished from a window here in 1964.' } },
    ],
    restaurants: [
      { id: 'r-sea-1', type: 'restaurant', title: 'Pike Place Chowder', lat: 47.6093, lng: -122.3425, details: { address: '1530 Post Aly, Seattle, WA', cuisine: 'Seafood / chowder', hours: '11 AM – 5 PM', priceRange: '$$', signature: 'Award-winning New England clam chowder' } },
      { id: 'r-sea-2', type: 'restaurant', title: 'Salumi', lat: 47.6010, lng: -122.3271, details: { address: '404 Occidental Ave S, Seattle, WA', cuisine: 'Italian deli / cured meats', hours: '11 AM – 4 PM', priceRange: '$$', signature: 'Porchetta sandwich, family-run by Batali clan' } },
      { id: 'r-sea-3', type: 'restaurant', title: 'Quality Athletics', lat: 47.5993, lng: -122.3318, details: { address: '121 S King St, Seattle, WA', cuisine: 'American sports bar', hours: '11 AM – 11 PM', priceRange: '$$', signature: 'Across from Lumen — perfect pre-match spot' } },
    ],
  },
  {
    match: ['bmo field', 'toronto stadium'],
    hotels: [
      { id: 'h-tor-1', type: 'hotel', title: 'Hotel X Toronto', lat: 43.6307, lng: -79.4119, details: { address: '111 Princes\' Blvd, Toronto, ON', pricePerNight: 'CA$420/night', walkDistance: '0.2 mi (walkable)', amenities: 'Rooftop pool, spa, falcon-themed luxury', description: 'On Exhibition Place grounds — closest luxury option.' } },
      { id: 'h-tor-2', type: 'hotel', title: 'Thompson Toronto', lat: 43.6404, lng: -79.4022, details: { address: '550 Wellington St W, Toronto, ON', pricePerNight: 'CA$340/night', walkDistance: '2.5 mi to BMO', amenities: 'Rooftop pool, boutique, lounge', description: 'King West neighborhood, easy streetcar to stadium.' } },
      { id: 'h-tor-3', type: 'hotel', title: 'Fairmont Royal York', lat: 43.6457, lng: -79.3812, details: { address: '100 Front St W, Toronto, ON', pricePerNight: 'CA$390/night', walkDistance: '3 mi (10 min on 509 streetcar)', amenities: 'Historic luxury, spa, multiple restaurants', description: 'Iconic 1929 chateau across from Union Station.' } },
    ],
    restaurants: [
      { id: 'r-tor-1', type: 'restaurant', title: 'Bar Wellington (Liberty Village)', lat: 43.6390, lng: -79.4198, details: { address: '935 King St W, Toronto, ON', cuisine: 'Gastropub', hours: '11 AM – 12 AM', priceRange: 'CA$$', signature: 'Local craft beer, pub fare — pre-match favourite' } },
      { id: 'r-tor-2', type: 'restaurant', title: 'St. Lawrence Market', lat: 43.6485, lng: -79.3716, details: { address: '93 Front St E, Toronto, ON', cuisine: 'Public market / multi-vendor', hours: '8 AM – 7 PM (closed Sun-Mon)', priceRange: 'CA$', signature: 'Peameal bacon sandwich at Carousel Bakery' } },
      { id: 'r-tor-3', type: 'restaurant', title: 'Khao San Road', lat: 43.6492, lng: -79.3878, details: { address: '11 Charlotte St, Toronto, ON', cuisine: 'Thai', hours: '11:30 AM – 10 PM', priceRange: 'CA$$', signature: 'Pad Thai, khao soi noodles — Entertainment District' } },
    ],
  },
  {
    match: ['bc place', 'vancouver stadium'],
    hotels: [
      { id: 'h-van-1', type: 'hotel', title: 'JW Marriott Parq Vancouver', lat: 49.2750, lng: -123.1126, details: { address: '39 Smithe St, Vancouver, BC', pricePerNight: 'CA$430/night', walkDistance: '0.1 mi (walkable)', amenities: 'Casino, spa, rooftop garden', description: 'Across the plaza from BC Place — top luxury choice.' } },
      { id: 'h-van-2', type: 'hotel', title: 'Rosewood Hotel Georgia', lat: 49.2828, lng: -123.1192, details: { address: '801 W Georgia St, Vancouver, BC', pricePerNight: 'CA$480/night', walkDistance: '0.8 mi', amenities: 'Historic luxury, spa, fine dining', description: '1927 landmark hotel, downtown core.' } },
      { id: 'h-van-3', type: 'hotel', title: 'OPUS Hotel Yaletown', lat: 49.2750, lng: -123.1213, details: { address: '322 Davie St, Vancouver, BC', pricePerNight: 'CA$320/night', walkDistance: '0.5 mi', amenities: 'Boutique, free bike rentals, lounge', description: 'Hip Yaletown boutique, walking distance to stadium.' } },
    ],
    restaurants: [
      { id: 'r-van-1', type: 'restaurant', title: 'Tap & Barrel BC Place', lat: 49.2772, lng: -123.1100, details: { address: '1 Robson St, Vancouver, BC', cuisine: 'Canadian gastropub', hours: '11 AM – 12 AM', priceRange: 'CA$$', signature: 'Patio overlooking the stadium, BC craft beers' } },
      { id: 'r-van-2', type: 'restaurant', title: 'Hawksworth Restaurant', lat: 49.2828, lng: -123.1190, details: { address: '801 W Georgia St, Vancouver, BC', cuisine: 'Modern Pacific Northwest', hours: '5 PM – 10 PM', priceRange: 'CA$$$$', signature: 'Tasting menu, BC seafood, in Rosewood Hotel' } },
      { id: 'r-van-3', type: 'restaurant', title: 'Japadog Robson', lat: 49.2856, lng: -123.1212, details: { address: '530 Robson St, Vancouver, BC', cuisine: 'Japanese-Canadian hot dogs', hours: '10 AM – 12 AM', priceRange: 'CA$', signature: 'Terimayo dog — Vancouver street food icon' } },
    ],
  },
  {
    match: ['azteca', 'banorte', 'mexico city stadium'],
    hotels: [
      { id: 'h-mex-1', type: 'hotel', title: 'Camino Real Pedregal', lat: 19.3245, lng: -99.2078, details: { address: 'Av. de las Fuentes 31, CDMX', pricePerNight: 'MX$4,500/night', walkDistance: '6 mi (25 min)', amenities: 'Pool, spa, restaurant', description: 'Quiet upscale option closer to Azteca than downtown.' } },
      { id: 'h-mex-2', type: 'hotel', title: 'Hotel Carlota', lat: 19.4283, lng: -99.1571, details: { address: 'Río Amazonas 73, CDMX', pricePerNight: 'MX$3,200/night', walkDistance: '10 mi (35-60 min)', amenities: 'Pool, design hotel, rooftop bar', description: 'Boutique design hotel in central Cuauhtémoc.' } },
      { id: 'h-mex-3', type: 'hotel', title: 'Four Seasons Mexico City', lat: 19.4222, lng: -99.1647, details: { address: 'Paseo de la Reforma 500, CDMX', pricePerNight: 'MX$8,500/night', walkDistance: '11 mi', amenities: 'Luxury, courtyard garden, spa', description: 'Reforma flagship, walking distance to Chapultepec.' } },
    ],
    restaurants: [
      { id: 'r-mex-1', type: 'restaurant', title: 'Pujol', lat: 19.4291, lng: -99.1916, details: { address: 'Tennyson 133, CDMX', cuisine: 'Modern Mexican (Enrique Olvera)', hours: '1 PM – 11 PM', priceRange: 'MX$$$$', signature: 'Mole madre tasting menu — book months ahead' } },
      { id: 'r-mex-2', type: 'restaurant', title: 'El Cardenal Centro', lat: 19.4349, lng: -99.1394, details: { address: 'Palma 23, CDMX (Centro Histórico)', cuisine: 'Traditional Mexican', hours: '8 AM – 6:30 PM', priceRange: 'MX$$', signature: 'Chiles en nogada (in season), hot chocolate with sweet bread' } },
      { id: 'r-mex-3', type: 'restaurant', title: 'Mercado de Coyoacán', lat: 19.3493, lng: -99.1614, details: { address: 'Calle Ignacio Allende, Coyoacán, CDMX', cuisine: 'Street market (multi-vendor)', hours: '8 AM – 6 PM', priceRange: 'MX$', signature: 'Tostadas de tinga, pambazos — closest to the stadium' } },
    ],
  },
  {
    match: ['akron', 'guadalajara', 'zapopan'],
    hotels: [
      { id: 'h-gdl-1', type: 'hotel', title: 'Riu Plaza Guadalajara', lat: 20.6736, lng: -103.4097, details: { address: 'Av. López Mateos Sur 830, Zapopan', pricePerNight: 'MX$2,800/night', walkDistance: '4 mi (15 min)', amenities: 'Pool, rooftop bar, business center', description: 'High-rise hotel in Andares area, near stadium.' } },
      { id: 'h-gdl-2', type: 'hotel', title: 'Hard Rock Hotel Guadalajara', lat: 20.6850, lng: -103.4150, details: { address: 'Av. Vallarta 5455, Zapopan', pricePerNight: 'MX$3,500/night', walkDistance: '3 mi (10 min)', amenities: 'Pool, music memorabilia, restaurant', description: 'Music-themed luxury, closest to stadium.' } },
      { id: 'h-gdl-3', type: 'hotel', title: 'Hotel Demetria', lat: 20.6826, lng: -103.3736, details: { address: 'Av. de la Paz 2219, Guadalajara', pricePerNight: 'MX$2,400/night', walkDistance: '6 mi', amenities: 'Boutique, restaurant, gym', description: 'Stylish design hotel in central Guadalajara.' } },
    ],
    restaurants: [
      { id: 'r-gdl-1', type: 'restaurant', title: 'La Tequila Restaurant', lat: 20.6783, lng: -103.3909, details: { address: 'Av. México 2916, Guadalajara', cuisine: 'Traditional Jalisco', hours: '1 PM – 12 AM', priceRange: 'MX$$', signature: 'Birria, carne en su jugo, 200+ tequilas' } },
      { id: 'r-gdl-2', type: 'restaurant', title: 'Karne Garibaldi', lat: 20.6890, lng: -103.3725, details: { address: 'Calle Garibaldi 1306, Guadalajara', cuisine: 'Carne en su jugo', hours: '8 AM – 1 AM', priceRange: 'MX$', signature: 'Guinness record for fastest service (13.5 sec)' } },
      { id: 'r-gdl-3', type: 'restaurant', title: 'Tlaquepaque (district)', lat: 20.6411, lng: -103.3132, details: { address: 'Calle Independencia, Tlaquepaque', cuisine: 'Multiple Mexican restaurants', hours: '11 AM – 11 PM', priceRange: 'MX$$', signature: 'Mariachi plazas, artisan crafts, Casa Luna restaurant' } },
    ],
  },
  {
    match: ['bbva', 'monterrey', 'guadalupe'],
    hotels: [
      { id: 'h-mty-1', type: 'hotel', title: 'Quinta Real Monterrey', lat: 25.6531, lng: -100.3576, details: { address: 'Av. Diego Rivera 500, San Pedro Garza García', pricePerNight: 'MX$4,200/night', walkDistance: '8 mi (20 min)', amenities: 'Luxury, spa, fine dining', description: 'Top luxury in San Pedro, closer to stadium than downtown.' } },
      { id: 'h-mty-2', type: 'hotel', title: 'Live Aqua Urban Resort', lat: 25.6502, lng: -100.3559, details: { address: 'Calzada del Valle 305, San Pedro Garza García', pricePerNight: 'MX$3,800/night', walkDistance: '8 mi', amenities: 'Rooftop pool, spa, restaurants', description: 'Modern luxury in San Pedro\'s upscale district.' } },
      { id: 'h-mty-3', type: 'hotel', title: 'Holiday Inn Express Monterrey', lat: 25.6712, lng: -100.2832, details: { address: 'Av. Pablo Livas 5400, Guadalupe, NL', pricePerNight: 'MX$1,800/night', walkDistance: '1.5 mi (closest to BBVA)', amenities: 'Free breakfast, gym, parking', description: 'The closest hotel to Estadio BBVA.' } },
    ],
    restaurants: [
      { id: 'r-mty-1', type: 'restaurant', title: 'El Rey del Cabrito', lat: 25.6695, lng: -100.3105, details: { address: 'Av. Constitución 825, Monterrey', cuisine: 'Cabrito (regional)', hours: '12 PM – 11 PM', priceRange: 'MX$$', signature: 'Roasted kid goat — Monterrey\'s signature dish' } },
      { id: 'r-mty-2', type: 'restaurant', title: 'La Nacional', lat: 25.6671, lng: -100.3079, details: { address: 'Calle Morelos 1238, Barrio Antiguo, Monterrey', cuisine: 'Mexican / regional', hours: '1 PM – 12 AM', priceRange: 'MX$$', signature: 'Live music nights in Barrio Antiguo' } },
      { id: 'r-mty-3', type: 'restaurant', title: 'Pangea', lat: 25.6580, lng: -100.3608, details: { address: 'Bosques del Valle 110, San Pedro Garza García', cuisine: 'Modern Mexican / international', hours: '1 PM – 11 PM', priceRange: 'MX$$$$', signature: 'Tasting menu, one of Monterrey\'s top fine-dining' } },
    ],
  },
]

/**
 * Resolve a stadium string to its hotels & restaurants list.
 * Returns { hotels: [...], restaurants: [...] } or null if no match.
 */
export function lookupNearby(stadiumString) {
  if (!stadiumString) return null
  const s = stadiumString.toLowerCase()
  return NEARBY.find(entry => entry.match.some(m => s.includes(m))) || null
}
