require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Station = require('./models/Station');
const Line = require('./models/Line');
const CompatMatrix = require('./models/CompatMatrix');

const seed = async () => {
  await connectDB();
  
  // Clear existing data
  await Station.deleteMany({});
  await Line.deleteMany({});
  await CompatMatrix.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // ── STATIONS ──────────────────────────────────────────
  const stationsData = [
    // Yellow Line
    { name: 'Samaypur Badli', code: 'SB', coordinates: { x: 280, y: 30 }, facilities: { accessible: true, parking: true, exits: 3 } },
    { name: 'Rohini Sector 18', code: 'RS', coordinates: { x: 280, y: 70 }, facilities: { accessible: true, parking: false, exits: 2 } },
    { name: 'Haiderpur Badli', code: 'HB', coordinates: { x: 280, y: 110 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Jahangirpuri', code: 'JP', coordinates: { x: 280, y: 150 }, facilities: { accessible: true, parking: true, exits: 4 } },
    { name: 'Adarsh Nagar', code: 'AN', coordinates: { x: 280, y: 190 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Azadpur', code: 'AZ', coordinates: { x: 280, y: 230 }, facilities: { accessible: true, parking: true, exits: 4 } }, // interchange
    { name: 'Model Town', code: 'MT', coordinates: { x: 280, y: 270 }, facilities: { accessible: true, parking: false, exits: 3 } },
    { name: 'GTB Nagar', code: 'GN', coordinates: { x: 280, y: 310 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Vishwa Vidyalaya', code: 'VV', coordinates: { x: 280, y: 350 }, facilities: { accessible: true, parking: false, exits: 3 } },
    { name: 'Vidhan Sabha', code: 'VS', coordinates: { x: 280, y: 390 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Civil Lines', code: 'CL', coordinates: { x: 280, y: 430 }, facilities: { accessible: true, parking: false, exits: 2 } },
    { name: 'Kashmere Gate', code: 'KG', coordinates: { x: 280, y: 470 }, facilities: { accessible: true, parking: true, exits: 6 } }, // interchange
    { name: 'Chandni Chowk', code: 'CC', coordinates: { x: 280, y: 510 }, facilities: { accessible: true, parking: false, exits: 4 } },
    { name: 'Chawri Bazaar', code: 'CB', coordinates: { x: 280, y: 550 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'New Delhi', code: 'ND', coordinates: { x: 280, y: 590 }, facilities: { accessible: true, parking: true, exits: 8 } }, // interchange
    { name: 'Rajiv Chowk', code: 'RC', coordinates: { x: 280, y: 630 }, facilities: { accessible: true, parking: false, exits: 6 } }, // interchange
    { name: 'Patel Chowk', code: 'PC', coordinates: { x: 280, y: 670 }, facilities: { accessible: true, parking: false, exits: 3 } },
    { name: 'Central Secretariat', code: 'CS', coordinates: { x: 280, y: 710 }, facilities: { accessible: true, parking: false, exits: 4 } }, // interchange
    { name: 'Udyog Bhawan', code: 'UB', coordinates: { x: 280, y: 750 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Lok Kalyan Marg', code: 'LK', coordinates: { x: 280, y: 790 }, facilities: { accessible: true, parking: true, exits: 3 } },
    { name: 'AIIMS', code: 'AI', coordinates: { x: 280, y: 830 }, facilities: { accessible: true, parking: true, exits: 5 } },
    { name: 'Green Park', code: 'GP', coordinates: { x: 280, y: 870 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Hauz Khas', code: 'HK', coordinates: { x: 280, y: 910 }, facilities: { accessible: true, parking: true, exits: 4 } }, // interchange
    { name: 'Malviya Nagar', code: 'MN', coordinates: { x: 280, y: 950 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Saket', code: 'SK', coordinates: { x: 280, y: 990 }, facilities: { accessible: true, parking: true, exits: 4 } },
    { name: 'Qutab Minar', code: 'QM', coordinates: { x: 280, y: 1030 }, facilities: { accessible: true, parking: true, exits: 3 } },
    { name: 'Chattarpur', code: 'CP', coordinates: { x: 280, y: 1070 }, facilities: { accessible: false, parking: true, exits: 2 } },
    { name: 'HUDA City Centre', code: 'HCC', coordinates: { x: 280, y: 1110 }, facilities: { accessible: true, parking: true, exits: 4 } },

    // Blue Line (additional unique stations)
    { name: 'Dwarka Sec 21', code: 'DW21', coordinates: { x: 30, y: 630 }, facilities: { accessible: true, parking: true, exits: 2 } },
    { name: 'Dwarka Sec 9', code: 'DW9', coordinates: { x: 70, y: 630 }, facilities: { accessible: false, parking: true, exits: 2 } },
    { name: 'Dwarka', code: 'DW', coordinates: { x: 110, y: 630 }, facilities: { accessible: true, parking: true, exits: 4 } },
    { name: 'Dwarka Mor', code: 'DM', coordinates: { x: 150, y: 630 }, facilities: { accessible: true, parking: false, exits: 3 } },
    { name: 'Uttam Nagar West', code: 'UW', coordinates: { x: 190, y: 630 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Janakpuri West', code: 'JW', coordinates: { x: 220, y: 620 }, facilities: { accessible: true, parking: true, exits: 4 } },
    { name: 'Tilak Nagar', code: 'TN', coordinates: { x: 230, y: 615 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Subhash Nagar', code: 'SN', coordinates: { x: 240, y: 612 }, facilities: { accessible: true, parking: false, exits: 2 } },
    { name: 'Tagore Garden', code: 'TG', coordinates: { x: 248, y: 610 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Rajouri Garden', code: 'RG', coordinates: { x: 255, y: 620 }, facilities: { accessible: true, parking: true, exits: 4 } },
    { name: 'Ramesh Nagar', code: 'RN', coordinates: { x: 258, y: 625 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Moti Nagar', code: 'MO', coordinates: { x: 260, y: 627 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Kirti Nagar', code: 'KN', coordinates: { x: 262, y: 628 }, facilities: { accessible: true, parking: false, exits: 3 } }, // interchange
    { name: 'Shadipur', code: 'SD', coordinates: { x: 265, y: 629 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Patel Nagar', code: 'PN', coordinates: { x: 268, y: 630 }, facilities: { accessible: true, parking: false, exits: 2 } },
    { name: 'Rajendra Place', code: 'RP', coordinates: { x: 270, y: 630 }, facilities: { accessible: true, parking: true, exits: 4 } },
    { name: 'Karol Bagh', code: 'KB', coordinates: { x: 273, y: 630 }, facilities: { accessible: true, parking: false, exits: 3 } },
    { name: 'Jhandewalan', code: 'JH', coordinates: { x: 276, y: 630 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Yamuna Bank', code: 'YB', coordinates: { x: 310, y: 630 }, facilities: { accessible: true, parking: true, exits: 3 } }, // interchange
    { name: 'Indraprastha', code: 'IP', coordinates: { x: 340, y: 630 }, facilities: { accessible: true, parking: false, exits: 3 } },
    { name: 'Pragati Maidan', code: 'PM', coordinates: { x: 370, y: 630 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Mandi House', code: 'MH', coordinates: { x: 400, y: 630 }, facilities: { accessible: true, parking: false, exits: 4 } }, // interchange
    { name: 'Barakhamba Road', code: 'BR', coordinates: { x: 420, y: 630 }, facilities: { accessible: true, parking: false, exits: 3 } },
    { name: 'Noida Sec 15', code: 'N15', coordinates: { x: 480, y: 630 }, facilities: { accessible: true, parking: true, exits: 2 } },
    { name: 'Noida Sec 16', code: 'N16', coordinates: { x: 520, y: 630 }, facilities: { accessible: true, parking: true, exits: 2 } },
    { name: 'Noida Sec 18', code: 'N18', coordinates: { x: 560, y: 630 }, facilities: { accessible: true, parking: true, exits: 3 } },
    { name: 'Botanical Garden', code: 'BG', coordinates: { x: 600, y: 630 }, facilities: { accessible: true, parking: true, exits: 4 } },

    // Pink Line (additional)
    { name: 'Majlis Park', code: 'MAP', coordinates: { x: 150, y: 230 }, facilities: { accessible: true, parking: true, exits: 2 } },
    { name: 'Shalimar Bagh', code: 'SHB', coordinates: { x: 200, y: 230 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Netaji Subhash Place', code: 'NSP', coordinates: { x: 250, y: 230 }, facilities: { accessible: true, parking: true, exits: 4 } }, // interchange
    { name: 'Punjabi Bagh', code: 'PB', coordinates: { x: 200, y: 260 }, facilities: { accessible: true, parking: true, exits: 3 } },
    { name: 'ESI Hospital', code: 'ESI', coordinates: { x: 200, y: 290 }, facilities: { accessible: true, parking: false, exits: 2 } },
    { name: 'Rajouri Garden Pink', code: 'RGP', coordinates: { x: 200, y: 320 }, facilities: { accessible: true, parking: true, exits: 3 } },
    { name: 'Maya Puri', code: 'MP', coordinates: { x: 200, y: 380 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Durgabai Deshmukh South', code: 'DDS', coordinates: { x: 200, y: 910 }, facilities: { accessible: true, parking: false, exits: 2 } },
    { name: 'Lajpat Nagar', code: 'LN', coordinates: { x: 340, y: 830 }, facilities: { accessible: true, parking: true, exits: 4 } },
    { name: 'Vinobapuri', code: 'VP', coordinates: { x: 380, y: 830 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Ashram', code: 'ASH', coordinates: { x: 410, y: 830 }, facilities: { accessible: true, parking: false, exits: 3 } },
    { name: 'Hazrat Nizamuddin', code: 'HN', coordinates: { x: 440, y: 810 }, facilities: { accessible: true, parking: true, exits: 4 } },
    { name: 'Sarai Kale Khan', code: 'SKK', coordinates: { x: 460, y: 790 }, facilities: { accessible: true, parking: true, exits: 3 } }, // interchange
    { name: 'Mayur Vihar I', code: 'MV1', coordinates: { x: 490, y: 770 }, facilities: { accessible: true, parking: true, exits: 4 } },
    { name: 'Trilokpuri Sanjay Lake', code: 'TSL', coordinates: { x: 520, y: 760 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'East Vinod Nagar', code: 'EVN', coordinates: { x: 550, y: 750 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Mandawali', code: 'MDW', coordinates: { x: 580, y: 740 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Anand Vihar', code: 'AV', coordinates: { x: 480, y: 500 }, facilities: { accessible: true, parking: true, exits: 5 } }, // interchange
    { name: 'Karkarduma', code: 'KK', coordinates: { x: 460, y: 500 }, facilities: { accessible: false, parking: false, exits: 2 } },
    { name: 'Preet Vihar', code: 'PV', coordinates: { x: 440, y: 500 }, facilities: { accessible: true, parking: false, exits: 3 } },
    { name: 'Welcome', code: 'WL', coordinates: { x: 400, y: 470 }, facilities: { accessible: true, parking: false, exits: 3 } },
    { name: 'Seelampur', code: 'SEL', coordinates: { x: 360, y: 470 }, facilities: { accessible: false, parking: false, exits: 2 } },
  ];

  const stations = await Station.insertMany(stationsData);
  console.log(`✅ Inserted ${stations.length} stations`);

  // Build a name→id map
  const stationMap = {};
  stations.forEach(s => { stationMap[s.code] = s._id; });

  // ── LINES ──────────────────────────────────────────────
  const yellowStationCodes = ['SB','RS','HB','JP','AN','AZ','MT','GN','VV','VS','CL','KG','CC','CB','ND','RC','PC','CS','UB','LK','AI','GP','HK','MN','SK','QM','CP','HCC'];
  const blueStationCodes = ['DW21','DW9','DW','DM','UW','JW','TN','SN','TG','RG','RN','MO','KN','SD','PN','RP','KB','JH','RC','KG','YB','IP','PM','MH','BR','ND','N15','N16','N18','BG'];
  const pinkStationCodes = ['MAP','SHB','NSP','AZ','PB','ESI','RGP','MP','KN','HK','DDS','CS','MH','LN','VP','ASH','HN','SKK','MV1','TSL','EVN','MDW'];

  const linesData = [
    {
      name: 'Yellow Line',
      code: 'YL',
      color: '#FFD700',
      stations: yellowStationCodes
        .filter(c => stationMap[c])
        .map((c, i) => ({ stationId: stationMap[c], order: i })),
    },
    {
      name: 'Blue Line',
      code: 'BL',
      color: '#0060A8',
      stations: blueStationCodes
        .filter(c => stationMap[c])
        .map((c, i) => ({ stationId: stationMap[c], order: i })),
    },
    {
      name: 'Pink Line',
      code: 'PL',
      color: '#E91E8C',
      stations: pinkStationCodes
        .filter(c => stationMap[c])
        .map((c, i) => ({ stationId: stationMap[c], order: i })),
    },
  ];

  const lines = await Line.insertMany(linesData);
  console.log(`✅ Inserted ${lines.length} metro lines`);

  // Update station lineIds and isInterchange
  for (const line of lines) {
    for (const s of line.stations) {
      await Station.findByIdAndUpdate(s.stationId, { $addToSet: { lineIds: line._id } });
    }
  }

  // Detect interchanges
  const allStations = await Station.find();
  for (const s of allStations) {
    if (s.lineIds.length > 1) {
      await Station.findByIdAndUpdate(s._id, { isInterchange: true });
    }
  }
  console.log('✅ Interchange stations flagged');

  // ── COMPAT MATRIX ──────────────────────────────────────
  const versions = ['v1.0', 'v1.1', 'v2.0', 'v2.1', 'v3.0'];
  const matrixEntries = [];
  const matrixRules = {
    'v1.0-v1.1': { status: 'direct', reason: 'Minor update, fully compatible' },
    'v1.0-v2.0': { status: 'intermediate', reason: 'Requires v1.1 intermediate upgrade' },
    'v1.0-v2.1': { status: 'intermediate', reason: 'Requires v1.1, v2.0 intermediate' },
    'v1.0-v3.0': { status: 'blocked', reason: 'Too many breaking changes, migration not supported' },
    'v1.1-v2.0': { status: 'direct', reason: 'Supported direct upgrade' },
    'v1.1-v2.1': { status: 'direct', reason: 'Supported direct upgrade' },
    'v1.1-v3.0': { status: 'intermediate', reason: 'Requires v2.x intermediate' },
    'v2.0-v2.1': { status: 'direct', reason: 'Patch update, direct' },
    'v2.0-v3.0': { status: 'intermediate', reason: 'Requires v2.1 intermediate' },
    'v2.1-v3.0': { status: 'direct', reason: 'Supported direct upgrade' },
  };

  for (const from of versions) {
    for (const to of versions) {
      if (from === to) continue;
      const key = `${from}-${to}`;
      const reverseKey = `${to}-${from}`;
      const rule = matrixRules[key] || matrixRules[reverseKey];
      matrixEntries.push({
        fromVersion: from,
        toVersion: to,
        status: rule ? rule.status : 'blocked',
        reason: rule ? rule.reason : 'Downgrade not supported',
      });
    }
  }

  await CompatMatrix.insertMany(matrixEntries);
  console.log(`✅ Inserted ${matrixEntries.length} compatibility matrix entries`);

  console.log('\n🎉 Seed complete! Metro network is ready.');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });