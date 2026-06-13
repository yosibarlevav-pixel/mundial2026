const teamCodeMap = {
  'mex': 'MEX', 'rsa': 'RSA', 'kor': 'KOR', 'cze': 'CZE',
  'can': 'CAN', 'bih': 'BIH', 'qat': 'QAT', 'sui': 'SUI',
  'bra': 'BRA', 'mar': 'MAR', 'hai': 'HAI', 'sco': 'SCO',
  'usa': 'USA', 'par': 'PAR', 'aus': 'AUS', 'tur': 'TUR',
  'ger': 'GER', 'cuw': 'CUW', 'civ': 'CIV', 'ecu': 'ECU',
  'ned': 'NED', 'jpn': 'JPN', 'swe': 'SWE', 'tun': 'TUN',
  'esp': 'ESP', 'cpv': 'CPV', 'ksa': 'KSA', 'uru': 'URU',
  'bel': 'BEL', 'egy': 'EGY', 'irn': 'IRN', 'nzl': 'NZL',
  'fra': 'FRA', 'sen': 'SEN', 'irq': 'IRQ', 'nor': 'NOR',
  'arg': 'ARG', 'alg': 'ALG', 'aut': 'AUT', 'jor': 'JOR',
  'por': 'POR', 'cod': 'COD', 'uzb': 'UZB', 'col': 'COL',
  'eng': 'ENG', 'cro': 'CRO', 'gha': 'GHA', 'pan': 'PAN'
};

const matchesTemplate = [
  { id: 1, home: 'mex', away: 'rsa' },
  { id: 2, home: 'kor', away: 'cze' },
  { id: 3, home: 'can', away: 'bih' },
  { id: 4, home: 'usa', away: 'par' },
  { id: 5, home: 'aus', away: 'tur' },
  { id: 6, home: 'qat', away: 'sui' },
  { id: 7, home: 'bra', away: 'mar' },
  { id: 8, home: 'hai', away: 'sco' },
  { id: 9, home: 'ger', away: 'cuw' },
  { id: 10, home: 'ned', away: 'jpn' },
  { id: 11, home: 'civ', away: 'ecu' },
  { id: 12, home: 'swe', away: 'tun' },
  { id: 13, home: 'esp', away: 'cpv' },
  { id: 14, home: 'bel', away: 'egy' },
  { id: 15, home: 'ksa', away: 'uru' },
  { id: 16, home: 'irn', away: 'nzl' },
  { id: 17, home: 'fra', away: 'sen' },
  { id: 18, home: 'irq', away: 'nor' },
  { id: 19, home: 'arg', away: 'alg' },
  { id: 20, home: 'aut', away: 'jor' },
  { id: 21, home: 'por', away: 'cod' },
  { id: 22, home: 'eng', away: 'cro' },
  { id: 23, home: 'gha', away: 'pan' },
  { id: 24, home: 'uzb', away: 'col' },
  { id: 25, home: 'cze', away: 'rsa' },
  { id: 26, home: 'sui', away: 'bih' },
  { id: 27, home: 'can', away: 'qat' },
  { id: 28, home: 'mex', away: 'kor' },
  { id: 29, home: 'tur', away: 'par' },
  { id: 30, home: 'usa', away: 'aus' },
  { id: 31, home: 'sco', away: 'mar' },
  { id: 32, home: 'bra', away: 'hai' },
  { id: 33, home: 'ned', away: 'swe' },
  { id: 34, home: 'ger', away: 'civ' },
  { id: 35, home: 'ecu', away: 'cuw' },
  { id: 36, home: 'tun', away: 'jpn' },
  { id: 37, home: 'ksa', away: 'esp' },
  { id: 38, home: 'bel', away: 'irn' },
  { id: 39, home: 'uru', away: 'cpv' },
  { id: 40, home: 'nzl', away: 'egy' },
  { id: 41, home: 'arg', away: 'aut' },
  { id: 42, home: 'fra', away: 'irq' },
  { id: 43, home: 'nor', away: 'sen' },
  { id: 44, home: 'jor', away: 'alg' },
  { id: 45, home: 'por', away: 'uzb' },
  { id: 46, home: 'eng', away: 'gha' },
  { id: 47, home: 'cro', away: 'pan' },
  { id: 48, home: 'col', away: 'cod' },
  { id: 49, home: 'sui', away: 'can' },
  { id: 50, home: 'bih', away: 'qat' },
  { id: 51, home: 'sco', away: 'bra' },
  { id: 52, home: 'mar', away: 'hai' },
  { id: 53, home: 'cze', away: 'mex' },
  { id: 54, home: 'rsa', away: 'kor' },
  { id: 55, home: 'ecu', away: 'ger' },
  { id: 56, home: 'cuw', away: 'civ' },
  { id: 57, home: 'jpn', away: 'swe' },
  { id: 58, home: 'ned', away: 'tun' },
  { id: 59, home: 'usa', away: 'tur' },
  { id: 60, home: 'par', away: 'aus' },
  { id: 61, home: 'nor', away: 'fra' },
  { id: 62, home: 'sen', away: 'irq' },
  { id: 63, home: 'cpv', away: 'ksa' },
  { id: 64, home: 'uru', away: 'esp' },
  { id: 65, home: 'egy', away: 'irn' },
  { id: 66, home: 'nzl', away: 'bel' },
  { id: 67, home: 'pan', away: 'eng' },
  { id: 68, home: 'cro', away: 'gha' },
  { id: 69, home: 'col', away: 'por' },
  { id: 70, home: 'cod', away: 'uzb' },
  { id: 71, home: 'alg', away: 'aut' },
  { id: 72, home: 'jor', away: 'arg' }
];

const demoScores = [
  { id: 1, homeScore: 2, awayScore: 1 },
  { id: 2, homeScore: 0, awayScore: 0 },
  { id: 3, homeScore: 1, awayScore: 3 },
  { id: 4, homeScore: 2, awayScore: 0 },
  { id: 5, homeScore: 1, awayScore: 1 }
];

export default async function handler(request, response) {
  const apiKey = process.env.RAPIDAPI_KEY;
  
  if (!apiKey) {
    // Return demo/mock updates if the API key is not configured yet
    return response.status(200).json(demoScores);
  }

  try {
    const isApiSports = apiKey.length === 32;
    const url = isApiSports 
      ? "https://v3.football.api-sports.io/fixtures?league=1&season=2026"
      : "https://api-football-v1.p.rapidapi.com/v3/fixtures?league=1&season=2026";
      
    const headers = isApiSports
      ? {
          "x-apisports-key": apiKey
        }
      : {
          "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
          "x-rapidapi-key": apiKey
        };

    const res = await fetch(url, { headers });

    if (!res.ok) {
      throw new Error(`RapidAPI responded with status ${res.status}`);
    }

    const result = await res.json();
    const fixtures = result.response || [];

    const mappedScores = [];

    fixtures.forEach(f => {
      const homeCode = f.teams.home.code;
      const awayCode = f.teams.away.code;

      if (!homeCode || !awayCode) return;

      const homeLocal = Object.keys(teamCodeMap).find(k => teamCodeMap[k] === homeCode);
      const awayLocal = Object.keys(teamCodeMap).find(k => teamCodeMap[k] === awayCode);

      if (homeLocal && awayLocal) {
        const match = matchesTemplate.find(m => m.home === homeLocal && m.away === awayLocal);
        if (match && f.goals.home !== null && f.goals.away !== null) {
          mappedScores.push({
            id: match.id,
            homeScore: f.goals.home,
            awayScore: f.goals.away
          });
        }
      }
    });

    return response.status(200).json(mappedScores.length > 0 ? mappedScores : demoScores);
  } catch (err) {
    console.error("API Fetch Error:", err);
    // Return demo scores as fallback
    return response.status(200).json(demoScores);
  }
}
