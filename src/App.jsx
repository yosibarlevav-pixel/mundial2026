import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Star, 
  Share2, 
  Search, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Heart, 
  Award, 
  TrendingUp, 
  Check, 
  RefreshCw, 
  Volume2, 
  VolumeX,
  Sparkles,
  Info
} from 'lucide-react';

// בסיס הנתונים הרשמי של 48 הנבחרות לפי 12 הבתים (א' - יב')
const initialTeams = [
  // בית א'
  { id: 'mex', name: 'מקסיקו', flag: '🇲🇽', group: 'א', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'הירבינג לוזאנו', starClub: 'פ.ס.וו איינדהובן', starAge: 30, rating: 84, position: 'התקפה', rank: 15 },
  { id: 'rsa', name: 'דרום אפריקה', flag: '🇿🇦', group: 'א', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'פרסי טאו', starClub: 'אל אהלי', starAge: 32, rating: 78, position: 'קישור', rank: 59 },
  { id: 'kor', name: 'קוריאה הדרומית', flag: '🇰🇷', group: 'א', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'סונג היונג-מין', starClub: 'טוטנהאם', starAge: 33, rating: 87, position: 'התקפה', rank: 22 },
  { id: 'cze', name: 'צ׳כיה', flag: '🇨🇿', group: 'א', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'תומאש סוצ׳ק', starClub: 'ווסטהאם', starAge: 31, rating: 83, position: 'קישור', rank: 36 },

  // בית ב'
  { id: 'can', name: 'קנדה', flag: '🇨🇦', group: 'ב', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'אלפונסו דייוויס', starClub: 'באיירן מינכן', starAge: 25, rating: 88, position: 'הגנה', rank: 40 },
  { id: 'bih', name: 'בוסניה והרצגובינה', flag: '🇧🇦', group: 'ב', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'אדין דז׳קו', starClub: 'פנרבחצ׳ה', starAge: 40, rating: 81, position: 'התקפה', rank: 75 },
  { id: 'qat', name: 'קטאר', flag: '🇶🇦', group: 'ב', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'אכרם עפיף', starClub: 'אל סאד', starAge: 29, rating: 79, position: 'התקפה', rank: 34 },
  { id: 'sui', name: 'שווייץ', flag: '🇨🇭', group: 'ב', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'גרניט ג׳אקה', starClub: 'באייר לברקוזן', starAge: 33, rating: 85, position: 'קישור', rank: 19 },

  // בית ג'
  { id: 'bra', name: 'ברזיל', flag: '🇧🇷', group: 'ג', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'ויניסיוס ג׳וניור', starClub: 'ריאל מדריד', starAge: 25, rating: 91, position: 'התקפה', rank: 5 },
  { id: 'mar', name: 'מרוקו', flag: '🇲🇦', group: 'ג', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'אשרף חכימי', starClub: 'פ.ס.ז׳', starAge: 27, rating: 88, position: 'הגנה', rank: 13 },
  { id: 'hai', name: 'האיטי', flag: '🇭🇹', group: 'ג', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'פרנצדי פיירו', starClub: 'מכבי חיפה', starAge: 31, rating: 77, position: 'התקפה', rank: 86 },
  { id: 'sco', name: 'סקוטלנד', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'ג', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'סקוט מקטומיניי', starClub: 'נאפולי', starAge: 29, rating: 82, position: 'קישור', rank: 39 },

  // בית ד'
  { id: 'usa', name: 'ארצות הברית', flag: '🇺🇸', group: 'ד', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'כריסטיאן פוליסיק', starClub: 'מילאן', starAge: 27, rating: 85, position: 'קישור', rank: 16 },
  { id: 'par', name: 'פרגוואי', flag: '🇵🇾', group: 'ד', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'מיגל אלמירון', starClub: 'ניוקאסל', starAge: 32, rating: 80, position: 'קישור', rank: 56 },
  { id: 'aus', name: 'אוסטרליה', flag: '🇦🇺', group: 'ד', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'מת׳יו ראיין', starClub: 'אלקמאר', starAge: 34, rating: 79, position: 'שוער', rank: 24 },
  { id: 'tur', name: 'טורקיה', flag: '🇹🇷', group: 'ד', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'הקאן צ׳להאנולו', starClub: 'אינטר', starAge: 32, rating: 86, position: 'קישור', rank: 40 },

  // בית ה'
  { id: 'ger', name: 'גרמניה', flag: '🇩🇪', group: 'ה', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'ג׳מאל מוסיאלה', starClub: 'באיירן מינכן', starAge: 23, rating: 90, position: 'קישור', rank: 11 },
  { id: 'cuw', name: 'קוראסאו', flag: '🇨🇼', group: 'ה', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'ג׳וניניו באקונה', starClub: 'ברמינגהאם', starAge: 28, rating: 72, position: 'קישור', rank: 90 },
  { id: 'civ', name: 'חוף השנהב', flag: '🇨🇮', group: 'ה', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'סבסטיאן האלר', starClub: 'לגאנס', starAge: 31, rating: 81, position: 'התקפה', rank: 38 },
  { id: 'ecu', name: 'אקוודור', flag: '🇪🇨', group: 'ה', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'מויסס קאייסדו', starClub: 'צ׳לסי', starAge: 24, rating: 85, position: 'קישור', rank: 31 },

  // בית ו'
  { id: 'ned', name: 'הולנד', flag: '🇳🇱', group: 'ו', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'וירג׳יל ואן דייק', starClub: 'ליברפול', starAge: 34, rating: 89, position: 'הגנה', rank: 7 },
  { id: 'jpn', name: 'יפן', flag: '🇯🇵', group: 'ו', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'קאורו מיטומה', starClub: 'ברייטון', starAge: 29, rating: 84, position: 'קישור', rank: 18 },
  { id: 'swe', name: 'שוודיה', flag: '🇸🇪', group: 'ו', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'אלכסנדר איסק', starClub: 'ניוקאסל', starAge: 26, rating: 86, position: 'התקפה', rank: 28 },
  { id: 'tun', name: 'טוניסיה', flag: '🇹🇳', group: 'ו', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'אליאס סחירי', starClub: 'איינטרכט פרנקפורט', starAge: 31, rating: 80, position: 'קישור', rank: 41 },

  // בית ז'
  { id: 'esp', name: 'ספרד', flag: '🇪🇸', group: 'ז', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'לאמין ימאל', starClub: 'ברצלונה', starAge: 18, rating: 91, position: 'התקפה', rank: 3 },
  { id: 'cpv', name: 'כף ורדה', flag: '🇨🇻', group: 'ז', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'ראיין מנדש', starClub: 'קארגומרוק', starAge: 36, rating: 74, position: 'התקפה', rank: 65 },
  { id: 'ksa', name: 'ערב הסעודית', flag: '🇸🇦', group: 'ז', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'סאלם אל-דאווסרי', starClub: 'אל הילאל', starAge: 34, rating: 78, position: 'קישור', rank: 53 },
  { id: 'uru', name: 'אורוגוואי', flag: '🇺🇾', group: 'ז', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'פדריקו ואלוורדה', starClub: 'ריאל מדריד', starAge: 27, rating: 89, position: 'קישור', rank: 14 },

  // בית ח'
  { id: 'bel', name: 'בלגיה', flag: '🇧🇪', group: 'ח', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'קווין דה בריינה', starClub: 'מנצ׳סטר סיטי', starAge: 34, rating: 90, position: 'קישור', rank: 8 },
  { id: 'egy', name: 'מצרים', flag: '🇪🇬', group: 'ח', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'מוחמד סלאח', starClub: 'ליברפול', starAge: 33, rating: 89, position: 'התקפה', rank: 36 },
  { id: 'irn', name: 'איראן', flag: '🇮🇷', group: 'ח', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'מהדי טארמי', starClub: 'אינטר', starAge: 33, rating: 82, position: 'התקפה', rank: 20 },
  { id: 'nzl', name: 'ניו זילנד', flag: '🇳🇿', group: 'ח', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'כריס ווד', starClub: 'נוטינגהאם פורסט', starAge: 34, rating: 79, position: 'התקפה', rank: 104 },

  // בית ט'
  { id: 'fra', name: 'צרפת', flag: '🇫🇷', group: 'ט', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'קיליאן אמבפה', starClub: 'ריאל מדריד', starAge: 27, rating: 93, position: 'התקפה', rank: 2 },
  { id: 'sen', name: 'סנגל', flag: '🇸🇳', group: 'ט', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'סאדיו מאנה', starClub: 'אל נאסר', starAge: 34, rating: 83, position: 'התקפה', rank: 21 },
  { id: 'irq', name: 'עיראק', flag: '🇮🇶', group: 'ט', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'איימן חוסיין', starClub: 'אל חור', starAge: 30, rating: 75, position: 'התקפה', rank: 58 },
  { id: 'nor', name: 'נורווגיה', flag: '🇳🇴', group: 'ט', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'ארלינג הולאנד', starClub: 'מנצ׳סטר סיטי', starAge: 25, rating: 91, position: 'התקפה', rank: 44 },

  // בית י'
  { id: 'arg', name: 'ארגנטינה', flag: '🇦🇷', group: 'י', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'ליונל מסי', starClub: 'אינטר מיאמי', starAge: 38, rating: 94, position: 'התקפה', rank: 1 },
  { id: 'alg', name: 'אלג׳יריה', flag: '🇩🇿', group: 'י', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'ריאד מחרז', starClub: 'אל אהלי', starAge: 35, rating: 82, position: 'התקפה', rank: 43 },
  { id: 'aut', name: 'אוסטריה', flag: '🇦🇹', group: 'י', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'מרסל זביצר', starClub: 'בורוסיה דורטמונד', starAge: 32, rating: 84, position: 'קישור', rank: 25 },
  { id: 'jor', name: 'ירדן', flag: '🇯🇴', group: 'י', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'מוסא אל-תעמרי', starClub: 'מונפלייה', starAge: 28, rating: 80, position: 'התקפה', rank: 71 },

  // בית יא'
  { id: 'por', name: 'פורטוגל', flag: '🇵🇹', group: 'יא', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'כריסטיאנו רונאלדו', starClub: 'אל נאסר', starAge: 41, rating: 89, position: 'התקפה', rank: 6 },
  { id: 'cod', name: 'קונגו הדמוקרטית', flag: '🇨🇩', group: 'יא', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'שנסל מבמבה', starClub: 'מרסיי', starAge: 31, rating: 79, position: 'הגנה', rank: 61 },
  { id: 'uzb', name: 'אוזבקיסטן', flag: '🇺🇿', group: 'יא', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'אלדור שומורודוב', starClub: 'קליארי', starAge: 30, rating: 76, position: 'התקפה', rank: 64 },
  { id: 'col', name: 'קולומביה', flag: '🇨🇴', group: 'יא', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'לואיס דיאז', starClub: 'ליברפול', starAge: 29, rating: 87, position: 'התקפה', rank: 12 },

  // בית יב'
  { id: 'eng', name: 'אנגליה', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'יב', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'ג׳וד בלינגהאם', starClub: 'ריאל מדריד', starAge: 22, rating: 91, position: 'קישור', rank: 4 },
  { id: 'cro', name: 'קרואטיה', flag: '🇭🇷', group: 'יב', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'לוקה מודריץ׳', starClub: 'ריאל מדריד', starAge: 40, rating: 86, position: 'קישור', rank: 9 },
  { id: 'gha', name: 'גאנה', flag: '🇬🇭', group: 'יב', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'מוחמד קודוס', starClub: 'ווסטהאם', starAge: 25, rating: 84, position: 'קישור', rank: 64 },
  { id: 'pan', name: 'פנמה', flag: '🇵🇦', group: 'יב', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, star: 'אדאלברטו קראסקייה', starClub: 'יוסטון דינמו', starAge: 27, rating: 77, position: 'קישור', rank: 43 },
];

const initialMatches = [
  // מחזור 1
  { id: 1, home: 'mex', away: 'rsa', group: 'א', date: '11/06/2026', time: '22:00', stadium: 'מקסיקו סיטי', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 2, home: 'kor', away: 'cze', group: 'א', date: '12/06/2026', time: '05:00', stadium: 'גוואדלחרה', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 3, home: 'can', away: 'bih', group: 'ב', date: '12/06/2026', time: '22:00', stadium: 'טורונטו', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 4, home: 'usa', away: 'par', group: 'ד', date: '13/06/2026', time: '04:00', stadium: 'לוס אנגלס', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 5, home: 'aus', away: 'tur', group: 'ד', date: '13/06/2026', time: '07:00', stadium: 'ואנקובר', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 6, home: 'qat', away: 'sui', group: 'ב', date: '13/06/2026', time: '22:00', stadium: 'סן פרנסיסקו', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 7, home: 'bra', away: 'mar', group: 'ג', date: '14/06/2026', time: '01:00', stadium: 'ניו ג׳רזי', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 8, home: 'hai', away: 'sco', group: 'ג', date: '14/06/2026', time: '04:00', stadium: 'בוסטון', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 9, home: 'ger', away: 'cuw', group: 'ה', date: '14/06/2026', time: '20:00', stadium: 'יוסטון', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 10, home: 'ned', away: 'jpn', group: 'ו', date: '14/06/2026', time: '23:00', stadium: 'דאלאס', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 11, home: 'civ', away: 'ecu', group: 'ה', date: '15/06/2026', time: '02:00', stadium: 'פילדלפיה', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 12, home: 'swe', away: 'tun', group: 'ו', date: '15/06/2026', time: '05:00', stadium: 'מונטריי', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 13, home: 'esp', away: 'cpv', group: 'ז', date: '15/06/2026', time: '19:00', stadium: 'אטלנטה', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 14, home: 'bel', away: 'egy', group: 'ח', date: '15/06/2026', time: '22:00', stadium: 'סיאטל', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 15, home: 'ksa', away: 'uru', group: 'ז', date: '16/06/2026', time: '01:00', stadium: 'מיאמי', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 16, home: 'irn', away: 'nzl', group: 'ח', date: '16/06/2026', time: '04:00', stadium: 'לוס אנגלס', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 17, home: 'fra', away: 'sen', group: 'ט', date: '16/06/2026', time: '22:00', stadium: 'ניו ג׳רזי', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 18, home: 'irq', away: 'nor', group: 'ט', date: '17/06/2026', time: '01:00', stadium: 'בוסטון', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 19, home: 'arg', away: 'alg', group: 'י', date: '17/06/2026', time: '04:00', stadium: 'קנזס סיטי', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 20, home: 'aut', away: 'jor', group: 'י', date: '17/06/2026', time: '07:00', stadium: 'סן פרנסיסקו', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 21, home: 'por', away: 'cod', group: 'יא', date: '17/06/2026', time: '20:00', stadium: 'יוסטון', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 22, home: 'eng', away: 'cro', group: 'יב', date: '17/06/2026', time: '23:00', stadium: 'דאלאס', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 23, home: 'gha', away: 'pan', group: 'יב', date: '18/06/2026', time: '02:00', stadium: 'טורונטו', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 24, home: 'uzb', away: 'col', group: 'יא', date: '18/06/2026', time: '05:00', stadium: 'מקסיקו סיטי', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },

  // מחזור 2
  { id: 25, home: 'cze', away: 'rsa', group: 'א', date: '18/06/2026', time: '19:00', stadium: 'אטלנטה', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 26, home: 'sui', away: 'bih', group: 'ב', date: '18/06/2026', time: '22:00', stadium: 'לוס אנגלס', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 27, home: 'can', away: 'qat', group: 'ב', date: '19/06/2026', time: '01:00', stadium: 'ואנקובר', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 28, home: 'mex', away: 'kor', group: 'א', date: '19/06/2026', time: '04:00', stadium: 'גוואדלחרה', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 29, home: 'tur', away: 'par', group: 'ד', date: '19/06/2026', time: '07:00', stadium: 'סן פרנסיסקו', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 30, home: 'usa', away: 'aus', group: 'ד', date: '19/06/2026', time: '22:00', stadium: 'סיאטל', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 31, home: 'sco', away: 'mar', group: 'ג', date: '20/06/2026', time: '01:00', stadium: 'בוסטון', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 32, home: 'bra', away: 'hai', group: 'ג', date: '20/06/2026', time: '04:00', stadium: 'פילדלפיה', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 33, home: 'ned', away: 'swe', group: 'ו', date: '20/06/2026', time: '20:00', stadium: 'יוסטון', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 34, home: 'ger', away: 'civ', group: 'ה', date: '20/06/2026', time: '23:00', stadium: 'טורונטו', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 35, home: 'ecu', away: 'cuw', group: 'ה', date: '21/06/2026', time: '03:00', stadium: 'קנזס סיטי', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 36, home: 'tun', away: 'jpn', group: 'ו', date: '21/06/2026', time: '07:00', stadium: 'מונטריי', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 37, home: 'ksa', away: 'esp', group: 'ז', date: '21/06/2026', time: '19:00', stadium: 'אטלנטה', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 38, home: 'bel', away: 'irn', group: 'ח', date: '21/06/2026', time: '22:00', stadium: 'לוס אנגלס', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 39, home: 'uru', away: 'cpv', group: 'ז', date: '22/06/2026', time: '01:00', stadium: 'מיאמי', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 40, home: 'nzl', away: 'egy', group: 'ח', date: '22/06/2026', time: '04:00', stadium: 'ואנקובר', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 41, home: 'arg', away: 'aut', group: 'י', date: '22/06/2026', time: '20:00', stadium: 'דאלאס', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 42, home: 'fra', away: 'irq', group: 'ט', date: '23/06/2026', time: '00:00', stadium: 'פילדלפיה', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 43, home: 'nor', away: 'sen', group: 'ט', date: '23/06/2026', time: '03:00', stadium: 'ניו ג׳רזי', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 44, home: 'jor', away: 'alg', group: 'י', date: '23/06/2026', time: '06:00', stadium: 'סן פרנסיסקו', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 45, home: 'por', away: 'uzb', group: 'יא', date: '23/06/2026', time: '20:00', stadium: 'יוסטון', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 46, home: 'eng', away: 'gha', group: 'יב', date: '23/06/2026', time: '23:00', stadium: 'בוסטון', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 47, home: 'cro', away: 'pan', group: 'יב', date: '24/06/2026', time: '02:00', stadium: 'טורונטו', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 48, home: 'col', away: 'cod', group: 'יא', date: '24/06/2026', time: '05:00', stadium: 'גוואדלחרה', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },

  // מחזור 3
  { id: 49, home: 'sui', away: 'can', group: 'ב', date: '24/06/2026', time: '22:00', stadium: 'ואנקובר', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 50, home: 'bih', away: 'qat', group: 'ב', date: '24/06/2026', time: '22:00', stadium: 'סיאטל', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 51, home: 'sco', away: 'bra', group: 'ג', date: '25/06/2026', time: '01:00', stadium: 'מיאמי', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 52, home: 'mar', away: 'hai', group: 'ג', date: '25/06/2026', time: '01:00', stadium: 'אטלנטה', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 53, home: 'cze', away: 'mex', group: 'א', date: '25/06/2026', time: '04:00', stadium: 'מקסיקו סיטי', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 54, home: 'rsa', away: 'kor', group: 'א', date: '25/06/2026', time: '04:00', stadium: 'מונטריי', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 55, home: 'ecu', away: 'ger', group: 'ה', date: '25/06/2026', time: '23:00', stadium: 'ניו ג׳רזי', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 56, home: 'cuw', away: 'civ', group: 'ה', date: '25/06/2026', time: '23:00', stadium: 'פילדלפיה', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 57, home: 'jpn', away: 'swe', group: 'ו', date: '26/06/2026', time: '02:00', stadium: 'דאלאס', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 58, home: 'ned', away: 'tun', group: 'ו', date: '26/06/2026', time: '02:00', stadium: 'קנזס סיטי', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 59, home: 'usa', away: 'tur', group: 'ד', date: '26/06/2026', time: '05:00', stadium: 'לוס אנגלס', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 60, home: 'par', away: 'aus', group: 'ד', date: '26/06/2026', time: '05:00', stadium: 'סן פרנסיסקו', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 61, home: 'nor', away: 'fra', group: 'ט', date: '26/06/2026', time: '22:00', stadium: 'בוסטון', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 62, home: 'sen', away: 'irq', group: 'ט', date: '26/06/2026', time: '22:00', stadium: 'טורונטו', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 63, home: 'cpv', away: 'ksa', group: 'ז', date: '27/06/2026', time: '03:00', stadium: 'יוסטון', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 64, home: 'uru', away: 'esp', group: 'ז', date: '27/06/2026', time: '03:00', stadium: 'גוואדלחרה', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 65, home: 'egy', away: 'irn', group: 'ח', date: '27/06/2026', time: '06:00', stadium: 'סיאטל', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 66, home: 'nzl', away: 'bel', group: 'ח', date: '27/06/2026', time: '06:00', stadium: 'ואנקובר', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 67, home: 'pan', away: 'eng', group: 'יב', date: '28/06/2026', time: '00:00', stadium: 'ניו ג׳רזי', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 68, home: 'cro', away: 'gha', group: 'יב', date: '28/06/2026', time: '00:00', stadium: 'פילדלפיה', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 69, home: 'col', away: 'por', group: 'יא', date: '28/06/2026', time: '02:30', stadium: 'מיאמי', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 70, home: 'cod', away: 'uzb', group: 'יא', date: '28/06/2026', time: '02:30', stadium: 'אטלנטה', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 71, home: 'alg', away: 'aut', group: 'י', date: '28/06/2026', time: '05:00', stadium: 'קנזס סיטי', broadcaster: 'כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
  { id: 72, home: 'jor', away: 'arg', group: 'י', date: '28/06/2026', time: '05:00', stadium: 'דאלאס', broadcaster: 'כאן 11, כאן box, ספורט 1', homeScore: null, awayScore: null, predictedHome: '', predictedAway: '' },
];

const getDayOfWeekHebrew = (dateStr) => {
  const [day, month, year] = dateStr.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayIndex = dateObj.getDay();
  const days = [
    'יום ראשון',
    'יום שני',
    'יום שלישי',
    'יום רביעי',
    'יום חמישי',
    'יום שישי',
    'יום שבת'
  ];
  return days[dayIndex];
};

let globalAudioCtx = null;

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [teams, setTeams] = useState(initialTeams);
  const [matches, setMatches] = useState(initialMatches);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [votedPlayer, setVotedPlayer] = useState(null);
  const [playerVotes, setPlayerVotes] = useState({
    'ליונל מסי': 4510,
    'קיליאן אמבפה': 3980,
    'ויניסיוס ג׳וניור': 3850,
    'לאמין ימאל': 4230,
    'כריסטיאנו רונאלדו': 4100,
    'הארי קיין': 2200,
    'אלפונסו דייוויס': 3120,
    'ארלינג הולאנד': 3540
  });
  const [selectedTeamDetails, setSelectedTeamDetails] = useState(null);
  
  // עץ ניחושים לשלבי הנוקאאוט
  const [bracket, setBracket] = useState({
    qf1: { id: 'arg', name: 'ארגנטינה', flag: '🇦🇷' },
    qf2: { id: 'eng', name: 'אנגליה', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    qf3: { id: 'esp', name: 'ספרד', flag: '🇪🇸' },
    qf4: { id: 'ita', name: 'איטליה', flag: '🇮🇹' },
    qf5: { id: 'fra', name: 'צרפת', flag: '🇫🇷' },
    qf6: { id: 'bra', name: 'ברזיל', flag: '🇧🇷' },
    qf7: { id: 'ger', name: 'גרמניה', flag: '🇩🇪' },
    qf8: { id: 'por', name: 'פורטוגל', flag: '🇵🇹' },
    
    sf1: null,
    sf2: null,
    sf3: null,
    sf4: null,

    f1: null,
    f2: null,

    champion: null
  });

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dialog Refs
  const teamDialogRef = useRef(null);
  const shareDialogRef = useRef(null);

  // ספירה לאחור ומצב שידור ישיר חי בזמן אמת
  const [countdownText, setCountdownText] = useState({ isLive: false, days: 0, hours: 0, mins: 0, secs: 0, home: null, away: null });
  const [countdownTitle, setCountdownTitle] = useState('טוען משחק קרוב...');

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      
      const matchesWithDates = matches.map(m => {
        const [day, month, year] = m.date.split('/').map(Number);
        const [hours, minutes] = m.time.split(':').map(Number);
        const matchDate = new Date(year, month - 1, day, hours, minutes);
        return { ...m, matchDate };
      });

      const sortedMatches = [...matchesWithDates].sort((a, b) => a.matchDate - b.matchDate);

      const activeLiveMatch = sortedMatches.find(m => {
        const gameDuration = 105 * 60 * 1000;
        return now >= m.matchDate && now < new Date(m.matchDate.getTime() + gameDuration);
      });

      if (activeLiveMatch) {
        const homeT = teams.find(t => t.id === activeLiveMatch.home);
        const awayT = teams.find(t => t.id === activeLiveMatch.away);
        setCountdownTitle(`שידור ישיר • בית ${activeLiveMatch.group}`);
        setCountdownText({
          isLive: true,
          home: homeT,
          away: awayT,
          homeScore: activeLiveMatch.homeScore !== null ? activeLiveMatch.homeScore : 0,
          awayScore: activeLiveMatch.awayScore !== null ? activeLiveMatch.awayScore : 0,
          days: 0, hours: 0, mins: 0, secs: 0
        });
        return;
      }

      let targetMatch = sortedMatches.find(m => m.matchDate > now);

      if (!targetMatch) {
        targetMatch = sortedMatches[0];
      }

      if (targetMatch) {
        const homeT = teams.find(t => t.id === targetMatch.home);
        const awayT = teams.find(t => t.id === targetMatch.away);
        setCountdownTitle(`${homeT?.flag || ''} ${homeT?.name || ''} נגד ${awayT?.name || ''} ${awayT?.flag || ''}`);
        
        let diff = targetMatch.matchDate - now;
        if (diff < 0) {
          diff = Math.abs(diff);
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdownText({
          isLive: false,
          days,
          hours,
          mins,
          secs,
          home: homeT,
          away: awayT
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [matches, teams]);

  useEffect(() => {
    fetch('/api/get-scores')
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(liveScores => {
        if (Array.isArray(liveScores) && liveScores.length > 0) {
          setMatches(prevMatches => prevMatches.map(m => {
            const liveMatch = liveScores.find(lm => lm.id === m.id);
            if (liveMatch) {
              return {
                ...m,
                homeScore: liveMatch.homeScore,
                awayScore: liveMatch.awayScore
              };
            }
            return m;
          }));
        }
      })
      .catch(err => console.log('Running with local/mock predictions:', err));
  }, []);

  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
      }

      const osc = globalAudioCtx.createOscillator();
      const gain = globalAudioCtx.createGain();
      osc.connect(gain);
      gain.connect(globalAudioCtx.destination);

      if (type === 'click') {
        osc.frequency.setValueAtTime(400, globalAudioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, globalAudioCtx.currentTime);
        osc.start();
        osc.stop(globalAudioCtx.currentTime + 0.05);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, globalAudioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, globalAudioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, globalAudioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, globalAudioCtx.currentTime);
        osc.start();
        osc.stop(globalAudioCtx.currentTime + 0.35);
      } else if (type === 'cheer') {
        const bufferSize = globalAudioCtx.sampleRate * 1.5;
        const buffer = globalAudioCtx.createBuffer(1, bufferSize, globalAudioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = globalAudioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = globalAudioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        noise.connect(filter);
        filter.connect(gain);
        gain.gain.setValueAtTime(0.1, globalAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, globalAudioCtx.currentTime + 1.5);
        noise.start();
        noise.stop(globalAudioCtx.currentTime + 1.5);
      }
    } catch (e) {
      console.warn("Audio Context blocked or not supported yet.", e);
    }
  };

  const toggleFavorite = (matchId) => {
    playSound('click');
    setFavorites(prev => 
      prev.includes(matchId) ? prev.filter(id => id !== matchId) : [...prev, matchId]
    );
  };

  const updatePrediction = (matchId, teamType, val) => {
    if (val !== '' && !/^\d+$/.test(val)) return;
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return teamType === 'home' 
          ? { ...m, predictedHome: val } 
          : { ...m, predictedAway: val };
      }
      return m;
    }));
  };

  const calculatedGroups = useMemo(() => {
    const stats = {};
    teams.forEach(t => {
      stats[t.id] = { ...t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 };
    });

    matches.forEach(m => {
      const hScore = m.homeScore !== null ? m.homeScore : (m.predictedHome !== '' ? parseInt(m.predictedHome) : null);
      const aScore = m.awayScore !== null ? m.awayScore : (m.predictedAway !== '' ? parseInt(m.predictedAway) : null);

      if (hScore !== null && aScore !== null) {
        const h = stats[m.home];
        const a = stats[m.away];
        if (h && a) {
          h.played += 1;
          a.played += 1;
          h.gf += hScore;
          h.ga += aScore;
          a.gf += aScore;
          a.ga += hScore;

          if (hScore > aScore) {
            h.won += 1;
            h.points += 3;
            a.lost += 1;
          } else if (hScore < aScore) {
            a.won += 1;
            a.points += 3;
            h.lost += 1;
          } else {
            h.drawn += 1;
            a.drawn += 1;
            h.points += 1;
            a.points += 1;
          }
        }
      }
    });

    const groups = {};
    Object.values(stats).forEach(team => {
      if (!groups[team.group]) {
        groups[team.group] = [];
      }
      groups[team.group].push(team);
    });

    Object.keys(groups).forEach(gName => {
      groups[gName].sort((a, b) => {
        const diffA = a.gf - a.ga;
        const diffB = b.gf - b.ga;
        if (b.points !== a.points) return b.points - a.points;
        if (diffB !== diffA) return diffB - diffA;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return a.name.localeCompare(b.name);
      });
    });

    return groups;
  }, [teams, matches]);

  const simulateAllMatches = () => {
    playSound('cheer');
    setMatches(prev => prev.map(m => {
      const homeRandom = Math.floor(Math.random() * 4);
      const awayRandom = Math.floor(Math.random() * 3);
      return {
        ...m,
        homeScore: homeRandom,
        awayScore: awayRandom,
        predictedHome: homeRandom.toString(),
        predictedAway: awayRandom.toString()
      };
    }));
  };

  const resetAllData = () => {
    playSound('click');
    setMatches(initialMatches);
    setTeams(initialTeams);
  };

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const homeTeam = teams.find(t => t.id === m.home);
      const awayTeam = teams.find(t => t.id === m.away);
      const matchesSearch = 
        homeTeam?.name.includes(searchQuery) || 
        awayTeam?.name.includes(searchQuery) ||
        m.group.includes(searchQuery);
      
      const matchesGroup = selectedGroup === 'All' || m.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [matches, searchQuery, selectedGroup, teams]);

  const filteredTeams = useMemo(() => {
    return teams.filter(t => 
      t.name.includes(searchQuery) || 
      t.star.includes(searchQuery) || 
      t.group.includes(searchQuery)
    );
  }, [teams, searchQuery]);

  const handleVote = (playerName) => {
    if (votedPlayer === playerName) return;
    playSound('success');
    setVotedPlayer(playerName);
    setPlayerVotes(prev => ({
      ...prev,
      [playerName]: prev[playerName] + 1
    }));
  };

  const advanceTeam = (slot, team) => {
    if (!team) return;
    playSound('click');
    setBracket(prev => {
      const next = { ...prev };
      next[slot] = team;
      if (slot === 'sf1' || slot === 'sf2') { next.f1 = null; next.champion = null; }
      if (slot === 'sf3' || slot === 'sf4') { next.f2 = null; next.champion = null; }
      if (slot === 'f1' || slot === 'f2') { next.champion = null; }
      return next;
    });
  };

  const getShareText = () => {
    const champ = bracket.champion ? `${bracket.champion.flag} ${bracket.champion.name}` : 'עדיין לא נבחרה';
    const final1 = bracket.f1 ? `${bracket.f1.flag} ${bracket.f1.name}` : '?';
    const final2 = bracket.f2 ? `${bracket.f2.flag} ${bracket.f2.name}` : '?';
    const s1 = bracket.sf1 ? bracket.sf1.name : '?';
    const s2 = bracket.sf2 ? bracket.sf2.name : '?';
    const s3 = bracket.sf3 ? bracket.sf3.name : '?';
    const s4 = bracket.sf4 ? bracket.sf4.name : '?';

    return `🏆 הניחוש שלי למונדיאל 2026! 🏆\n\n🥇 האלופה שלי: ${champ}\n🥈 פיינליסטיות: ${final1} נגד ${final2}\n\n⚽ חצי הגמר:\n• ${s1}\n• ${s2}\n• ${s3}\n• ${s4}\n\nנחשו גם אתם בפורטל המונדיאל האינטראקטיבי! ⚽🏆`;
  };

  const copyToClipboard = () => {
    playSound('success');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(getShareText())
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy:', err);
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = getShareText();
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };


  useEffect(() => {
    if (selectedTeamDetails) {
      teamDialogRef.current?.showModal();
    } else {
      teamDialogRef.current?.close();
    }
  }, [selectedTeamDetails]);

  useEffect(() => {
    if (shareModalOpen) {
      shareDialogRef.current?.showModal();
    } else {
      shareDialogRef.current?.close();
    }
  }, [shareModalOpen]);

  const handleDialogBackdropClick = (e, ref, setter) => {
    if (e.target === ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isDialogContent) {
        setter(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900" dir="rtl">
      
      {/* Glow Backgrounds */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-lg blur opacity-70 animate-pulse"></div>
              <div className="relative bg-slate-900 p-2 rounded-lg border border-slate-700">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-l from-amber-200 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                מונדיאל 2026 • הלוח הרשמי
              </h1>
              <span className="text-xs text-slate-400 block font-mono">מסונכרן עם ערוצי השידור בישראל 🇮🇱</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 rounded-full py-1.5 px-3.5 border border-slate-700/50 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-300">שעון ירושלים (UTC+3)</span>
            </div>
            
            <button 
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) {
                  setTimeout(() => playSound('success'), 100);
                }
              }} 
              className={`p-2 rounded-full border transition-all cursor-pointer ${soundEnabled ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={() => { playSound('click'); setShareModalOpen(true); }}
              className="flex items-center gap-1.5 bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-amber-500/20 text-xs md:text-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>שיתוף ניחוש</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Countdown Widget */}
      <section className="relative overflow-hidden border-b border-slate-800 py-8 px-4 bg-gradient-to-b from-slate-900/40 to-slate-955">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right space-y-2 md:max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              משחקי שלב הבתים - 48 נבחרות, 12 בתים
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              הפורטל האינטראקטיבי <br className="hidden md:inline" />
              של <span className="text-amber-400 underline decoration-amber-400/40 underline-offset-8">גביע העולם 2026</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              מעקב מלא וחי בזמן אמת אחר כל 72 המשחקים לפי שעון ישראל, סימולציות בתים וחלוקה לערוצי השידור בישראל: כאן 11, ספורט 1 וכאן Box.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-750 p-4 rounded-2xl shadow-xl w-full md:w-auto max-w-md flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              {countdownText.isLive ? 'שידור חי פעיל ברגע זה! 🔥' : 'המשחק הבא בטורניר מתחיל בעוד'}
            </span>
            {countdownText.isLive ? (
              <div className="flex flex-col items-center justify-center p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl w-full">
                <div className="flex items-center gap-6 justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl filter drop-shadow-md">{countdownText.home?.flag}</span>
                    <span className="text-xs font-extrabold mt-1.5 text-slate-200">{countdownText.home?.name}</span>
                  </div>
                  <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
                    <span className="text-3xl font-black font-mono text-amber-400">
                      {countdownText.homeScore !== undefined ? countdownText.homeScore : 0} : {countdownText.awayScore !== undefined ? countdownText.awayScore : 0}
                    </span>
                    <span className="block text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5 animate-pulse">מחצית א׳</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl filter drop-shadow-md">{countdownText.away?.flag}</span>
                    <span className="text-xs font-extrabold mt-1.5 text-slate-200">{countdownText.away?.name}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 text-center" dir="ltr">
                <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl min-w-[64px]">
                  <span className="text-2xl font-bold font-mono text-emerald-400">{countdownText.days}</span>
                  <span className="text-[10px] text-slate-500 block font-sans">ימים</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl min-w-[64px]">
                  <span className="text-2xl font-bold font-mono text-slate-100">{countdownText.hours}</span>
                  <span className="text-[10px] text-slate-500 block font-sans">שעות</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl min-w-[64px]">
                  <span className="text-2xl font-bold font-mono text-slate-100">{countdownText.mins}</span>
                  <span className="text-[10px] text-slate-500 block font-sans">דקות</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl min-w-[64px]">
                  <span className="text-2xl font-bold font-mono text-amber-400 animate-pulse">{countdownText.secs}</span>
                  <span className="text-[10px] text-slate-500 block font-sans">שניות</span>
                </div>
              </div>
            )}
            <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5 border-t border-slate-850 pt-2 w-full justify-center text-center">
              <span>{countdownTitle}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Menu */}
      <div className="bg-slate-900 border-b border-slate-800/80 sticky top-[69px] z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <nav className="flex gap-1.5 bg-slate-950 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => { playSound('click'); setActiveTab('schedule'); }}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'schedule' ? 'bg-amber-400 text-slate-955 shadow-md shadow-amber-400/10' : 'text-slate-300 hover:bg-slate-900'}`}
            >
              <Calendar className="w-4 h-4" />
              לוח משחקים
            </button>
            <button
              onClick={() => { playSound('click'); setActiveTab('groups'); }}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'groups' ? 'bg-amber-400 text-slate-955 shadow-md shadow-amber-400/10' : 'text-slate-300 hover:bg-slate-900'}`}
            >
              <Trophy className="w-4 h-4" />
              טבלאות בתים
            </button>
            <button
              onClick={() => { playSound('click'); setActiveTab('bracket'); }}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'bracket' ? 'bg-amber-400 text-slate-955 shadow-md shadow-amber-400/10' : 'text-slate-300 hover:bg-slate-900'}`}
            >
              <TrendingUp className="w-4 h-4" />
              מנחש אלופה
            </button>
            <button
              onClick={() => { playSound('click'); setActiveTab('stars'); }}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'stars' ? 'bg-amber-400 text-slate-955 shadow-md shadow-amber-400/10' : 'text-slate-300 hover:bg-slate-900'}`}
            >
              <Users className="w-4 h-4" />
              כוכבים ונבחרות
            </button>
          </nav>

          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={simulateAllMatches}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              סימולציה אוטומטית
            </button>
            <button 
              onClick={resetAllData}
              className="flex-1 md:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700/60 text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer"
            >
              איפוס הכל
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:py-8">

        {/* Tab 1: Schedule */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Search and Filters */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              
              <div className="relative w-full md:w-96">
                <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="חפש נבחרת..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-amber-400 transition-all text-slate-100"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {['All', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'].map((groupOpt) => (
                  <button
                    key={groupOpt}
                    onClick={() => { playSound('click'); setSelectedGroup(groupOpt); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedGroup === groupOpt ? 'bg-slate-850 text-amber-400 border border-amber-400/40' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    {groupOpt === 'All' ? 'כל המשחקים' : `בית ${groupOpt}`}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>מסומנים בלב: </span>
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                  {favorites.length}
                </span>
              </div>
            </div>

            {/* Matches list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => {
                  const homeT = teams.find(t => t.id === match.home);
                  const awayT = teams.find(t => t.id === match.away);
                  const isFav = favorites.includes(match.id);

                  return (
                    <div 
                      key={match.id} 
                      className={`relative bg-slate-900 border transition-all rounded-2xl overflow-hidden hover:scale-[1.01] hover:shadow-lg ${isFav ? 'border-rose-500/30 shadow-rose-900/5' : 'border-slate-800/60'}`}
                    >
                      <div className="bg-slate-955 px-4 py-2.5 flex justify-between items-center text-xs border-b border-slate-850">
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">בית {match.group}</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span className="font-extrabold text-amber-400 ml-1">{getDayOfWeekHebrew(match.date)}</span>
                            <span>({match.date}) | {match.time} (שעון ישראל)</span>
                          </span>
                        </div>
                        <button 
                          onClick={() => toggleFavorite(match.id)}
                          className="text-slate-400 hover:text-rose-400 p-1 rounded-full transition-colors cursor-pointer"
                        >
                          <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                        </button>
                      </div>

                      <div className="p-5 flex items-center justify-between gap-2">
                        
                        {/* Home team */}
                        <div 
                          className="flex flex-col items-center flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedTeamDetails(homeT)}
                        >
                          <span className="text-4xl filter drop-shadow-md mb-1">{homeT?.flag}</span>
                          <span className="font-bold text-slate-100 text-sm md:text-base text-center">{homeT?.name}</span>
                          <span className="text-[10px] text-slate-500">דירוג: #{homeT?.rank}</span>
                        </div>

                        {/* Mid score predictor */}
                        <div className="flex flex-col items-center px-2">
                          {match.homeScore !== null ? (
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-2.5 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/20 shadow-inner">
                                <span className="text-lg font-black font-mono text-emerald-400">{match.homeScore}</span>
                                <span className="text-slate-500 font-bold font-mono text-xs">:</span>
                                <span className="text-lg font-black font-mono text-emerald-400">{match.awayScore}</span>
                              </div>
                              <span className="mt-2 text-[9px] font-black text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                סופי
                              </span>
                              {(match.predictedHome !== '' || match.predictedAway !== '') && (
                                <span className="mt-1 text-[9px] text-slate-500 font-medium">
                                  ניחוש: {match.predictedAway || 0} - {match.predictedHome || 0}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={match.predictedHome}
                                  onChange={(e) => updatePrediction(match.id, 'home', e.target.value)}
                                  placeholder="-"
                                  className="w-10 h-10 bg-slate-955 text-slate-100 font-bold font-mono text-center rounded-lg border border-slate-700/80 focus:border-amber-400 focus:outline-none text-lg transition-colors"
                                />
                                <span className="text-slate-500 font-bold font-mono text-lg">:</span>
                                <input
                                  type="text"
                                  value={match.predictedAway}
                                  onChange={(e) => updatePrediction(match.id, 'away', e.target.value)}
                                  placeholder="-"
                                  className="w-10 h-10 bg-slate-955 text-slate-100 font-bold font-mono text-center rounded-lg border border-slate-700/80 focus:border-amber-400 focus:outline-none text-lg transition-colors"
                                />
                              </div>
                              <div className="mt-2 text-[10px] text-slate-400 font-semibold bg-slate-800/40 px-2 py-0.5 rounded-full">
                                הזן ניחוש משלך
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Away team */}
                        <div 
                          className="flex flex-col items-center flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedTeamDetails(awayT)}
                        >
                          <span className="text-4xl filter drop-shadow-md mb-1">{awayT?.flag}</span>
                          <span className="font-bold text-slate-100 text-sm md:text-base text-center">{awayT?.name}</span>
                          <span className="text-[10px] text-slate-500">דירוג: #{awayT?.rank}</span>
                        </div>

                      </div>

                      {/* Broadcaster & Stadium */}
                      <div className="bg-slate-955/40 px-4 py-2.5 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-850 flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{match.stadium}</span>
                        </div>
                        {match.broadcaster && (
                          <div className="flex items-center gap-1 bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            <span>שידור: {match.broadcaster}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="text-slate-500 text-3xl mb-2">⚽</div>
                  <p className="text-slate-400">לא נמצאו משחקים העונים לחיפוש שלך.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Groups standings */}
        {activeTab === 'groups' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-2xl text-xs md:text-sm text-slate-300 flex items-center justify-between flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Info className="w-4 h-4 flex-shrink-0" />
                הניחושים שלך משפיעים על הטבלה! הזן תוצאות בלוח המשחקים כדי לעדכן את מיקומי הבתים.
              </span>
              <button 
                onClick={simulateAllMatches}
                className="bg-amber-400 hover:bg-amber-500 text-slate-955 font-bold px-3 py-1.5 rounded-lg transition-colors text-xs cursor-pointer"
              >
                הדמיית כל הבתים ברנדומליות
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(calculatedGroups).map((gName) => (
                <div key={gName} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                  
                  <div className="bg-slate-955 p-4 flex justify-between items-center border-b border-slate-800">
                    <span className="font-extrabold text-amber-400 text-base md:text-lg">בית {gName}</span>
                    <span className="text-[10px] text-slate-400">2 המובילות מעפילות לנוקאאוט</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs md:text-sm min-w-[320px]">
                      <thead>
                        <tr className="bg-slate-955/50 text-slate-400 border-b border-slate-855 text-[11px] font-bold">
                          <th className="py-3 px-4 text-center w-12">מקום</th>
                          <th className="py-3 px-2">נבחרת</th>
                          <th className="py-3 px-2 text-center font-mono">מש׳</th>
                          <th className="py-3 px-2 text-center font-mono">נצ׳</th>
                          <th className="py-3 px-2 text-center font-mono">תיקו</th>
                          <th className="py-3 px-2 text-center font-mono">הפ׳</th>
                          <th className="py-3 px-2 text-center font-mono">יחס</th>
                          <th className="py-3 px-4 text-center bg-slate-955 font-mono">נק׳</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculatedGroups[gName].map((team, idx) => {
                          const goalDiff = team.gf - team.ga;
                          const isQualified = idx < 2;

                          return (
                            <tr 
                              key={team.id} 
                              onClick={() => setSelectedTeamDetails(team)}
                              className="border-b border-slate-850 hover:bg-slate-800/40 transition-colors cursor-pointer group"
                            >
                              <td className="py-3 px-4 text-center font-bold">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${isQualified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                  {idx + 1}
                                </span>
                              </td>
                              
                              <td className="py-3 px-2 font-semibold">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl filter drop-shadow-sm">{team.flag}</span>
                                  <span className="text-slate-100 group-hover:text-amber-400 transition-colors">{team.name}</span>
                                </div>
                              </td>

                              <td className="py-3 px-2 text-center font-mono text-slate-300">{team.played}</td>
                              <td className="py-3 px-2 text-center font-mono text-emerald-400">{team.won}</td>
                              <td className="py-3 px-2 text-center font-mono text-slate-300">{team.drawn}</td>
                              <td className="py-3 px-2 text-center font-mono text-rose-400">{team.lost}</td>
                              
                              <td className="py-3 px-2 text-center font-mono">
                                <span className={goalDiff > 0 ? 'text-emerald-400' : goalDiff < 0 ? 'text-rose-400' : 'text-slate-400'}>
                                  {goalDiff > 0 ? `+${goalDiff}` : goalDiff} ({team.gf}:{team.ga})
                                </span>
                              </td>

                              <td className="py-3 px-4 text-center font-extrabold font-mono text-amber-400 bg-slate-955/30">
                                {team.points}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Bracket Predictor */}
        {activeTab === 'bracket' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 max-w-4xl mx-auto shadow-xl">
              <div className="w-14 h-14 bg-amber-400/10 rounded-2xl flex items-center justify-center mx-auto border border-amber-400/20 shadow-inner">
                <Award className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black">מנחש שלבי הנוקאאוט והאלופה</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-xs md:text-sm">
                בחר את המנצחות שלך שלב אחר שלב מרבע הגמר ועד להנפת הגביע! לחץ על הנבחרת המועדפת עליך כדי להעלות אותה לשלב הבא.
              </p>
            </div>

            {/* Visual Bracket */}
            <div className="overflow-x-auto py-8">
              <div className="min-w-[1000px] flex justify-between items-center gap-4 px-4">
                
                {/* 1. Left side Quarter Finals */}
                <div className="flex flex-col gap-8 w-60">
                  <span className="text-[11px] font-extrabold text-emerald-400 tracking-wider text-center uppercase border-b border-emerald-500/20 pb-2">רבע גמר (שמאל)</span>
                  
                  {/* Pair 1: QF1 vs QF2 */}
                  <div className="space-y-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                    <button 
                      onClick={() => advanceTeam('sf1', bracket.qf1)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${bracket.sf1?.id === bracket.qf1.id ? 'bg-amber-400 text-slate-955 border-amber-400 font-extrabold' : 'bg-slate-950 hover:bg-slate-850 text-slate-200 border-slate-800'}`}
                    >
                      <span>{bracket.qf1.flag} {bracket.qf1.name}</span>
                      {bracket.sf1?.id === bracket.qf1.id && <Check className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => advanceTeam('sf1', bracket.qf2)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${bracket.sf1?.id === bracket.qf2.id ? 'bg-amber-400 text-slate-955 border-amber-400 font-extrabold' : 'bg-slate-950 hover:bg-slate-850 text-slate-200 border-slate-800'}`}
                    >
                      <span>{bracket.qf2.flag} {bracket.qf2.name}</span>
                      {bracket.sf1?.id === bracket.qf2.id && <Check className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Pair 2: QF3 vs QF4 */}
                  <div className="space-y-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                    <button 
                      onClick={() => advanceTeam('sf2', bracket.qf3)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${bracket.sf2?.id === bracket.qf3.id ? 'bg-amber-400 text-slate-955 border-amber-400 font-extrabold' : 'bg-slate-950 hover:bg-slate-850 text-slate-200 border-slate-800'}`}
                    >
                      <span>{bracket.qf3.flag} {bracket.qf3.name}</span>
                      {bracket.sf2?.id === bracket.qf3.id && <Check className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => advanceTeam('sf2', bracket.qf4)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${bracket.sf2?.id === bracket.qf4.id ? 'bg-amber-400 text-slate-955 border-amber-400 font-extrabold' : 'bg-slate-950 hover:bg-slate-850 text-slate-200 border-slate-800'}`}
                    >
                      <span>{bracket.qf4.flag} {bracket.qf4.name}</span>
                      {bracket.sf2?.id === bracket.qf4.id && <Check className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 2. Left side Semi Finals */}
                <div className="flex flex-col gap-16 w-56">
                  <span className="text-[11px] font-extrabold text-emerald-400 tracking-wider text-center uppercase border-b border-emerald-500/20 pb-2">חצי גמר (שמאל)</span>
                  
                  <div className="space-y-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 shadow-xl">
                    <button 
                      disabled={!bracket.sf1}
                      onClick={() => advanceTeam('f1', bracket.sf1)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-all ${bracket.sf1 ? 'bg-slate-955 border-slate-800 text-slate-200 hover:bg-slate-850 cursor-pointer' : 'bg-slate-950/30 border-slate-900/60 text-slate-500 cursor-not-allowed'} ${bracket.f1?.id === bracket.sf1?.id && bracket.sf1 ? '!bg-amber-400 !text-slate-955 !border-amber-400' : ''}`}
                    >
                      <span>{bracket.sf1 ? `${bracket.sf1.flag} ${bracket.sf1.name}` : "מנצחת רבע 1"}</span>
                      {bracket.f1?.id === bracket.sf1?.id && bracket.sf1 && <Check className="w-4 h-4" />}
                    </button>
                    <button 
                      disabled={!bracket.sf2}
                      onClick={() => advanceTeam('f1', bracket.sf2)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-all ${bracket.sf2 ? 'bg-slate-955 border-slate-800 text-slate-200 hover:bg-slate-850 cursor-pointer' : 'bg-slate-950/30 border-slate-900/60 text-slate-500 cursor-not-allowed'} ${bracket.f1?.id === bracket.sf2?.id && bracket.sf2 ? '!bg-amber-400 !text-slate-955 !border-amber-400' : ''}`}
                    >
                      <span>{bracket.sf2 ? `${bracket.sf2.flag} ${bracket.sf2.name}` : "מנצחת רבע 2"}</span>
                      {bracket.f1?.id === bracket.sf2?.id && bracket.sf2 && <Check className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 3. Center Finals & Champion */}
                <div className="flex flex-col items-center justify-center gap-8 px-4 w-72">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full flex flex-col items-center gap-4 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-emerald-500"></div>
                    <span className="text-[11px] font-extrabold text-amber-400 tracking-wider uppercase">הגמר הגדול</span>
                    
                    <div className="w-full space-y-3">
                      <button 
                        disabled={!bracket.f1}
                        onClick={() => advanceTeam('champion', bracket.f1)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl text-xs font-extrabold border transition-all ${bracket.f1 ? 'bg-slate-955 border-slate-700 text-slate-200 hover:bg-slate-850 cursor-pointer' : 'bg-slate-950/30 border-slate-900/40 text-slate-500 cursor-not-allowed'} ${bracket.champion?.id === bracket.f1?.id && bracket.f1 ? '!bg-gradient-to-r !from-amber-400 !to-amber-500 !text-slate-955 !border-amber-400 shadow-lg' : ''}`}
                      >
                        <span>{bracket.f1 ? `${bracket.f1.flag} ${bracket.f1.name}` : "פיינליסטית 1"}</span>
                        {bracket.champion?.id === bracket.f1?.id && bracket.f1 && <Trophy className="w-4 h-4" />}
                      </button>

                      <div className="text-center font-mono font-bold text-xs text-slate-500">VS</div>

                      <button 
                        disabled={!bracket.f2}
                        onClick={() => advanceTeam('champion', bracket.f2)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl text-xs font-extrabold border transition-all ${bracket.f2 ? 'bg-slate-955 border-slate-700 text-slate-200 hover:bg-slate-850 cursor-pointer' : 'bg-slate-950/30 border-slate-900/40 text-slate-500 cursor-not-allowed'} ${bracket.champion?.id === bracket.f2?.id && bracket.f2 ? '!bg-gradient-to-r !from-amber-400 !to-amber-500 !text-slate-955 !border-amber-400 shadow-lg' : ''}`}
                      >
                        <span>{bracket.f2 ? `${bracket.f2.flag} ${bracket.f2.name}` : "פיינליסטית 2"}</span>
                        {bracket.champion?.id === bracket.f2?.id && bracket.f2 && <Trophy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {bracket.champion && (
                    <div className="bg-slate-900/80 border border-amber-500/30 p-5 rounded-2xl text-center w-full shadow-2xl animate-fadeIn relative">
                      <div className="absolute top-2 right-2 text-amber-400"><Sparkles className="w-4 h-4 animate-pulse" /></div>
                      <div className="absolute bottom-2 left-2 text-amber-400"><Sparkles className="w-4 h-4 animate-pulse" /></div>
                      
                      <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
                        <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
                      </div>
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase block tracking-wider">אלופת מונדיאל 2026</span>
                      <h3 className="text-xl font-black mt-1 text-slate-100 flex items-center justify-center gap-2">
                        <span>{bracket.champion.flag}</span>
                        <span>{bracket.champion.name}</span>
                      </h3>
                      <button 
                        onClick={() => { playSound('cheer'); setShareModalOpen(true); }}
                        className="mt-3 text-xs bg-amber-400 hover:bg-amber-500 text-slate-955 font-bold py-1.5 px-4 rounded-lg w-full transition-colors cursor-pointer"
                      >
                        שתף את הבחירה שלך!
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Right side Semi Finals */}
                <div className="flex flex-col gap-16 w-56">
                  <span className="text-[11px] font-extrabold text-emerald-400 tracking-wider text-center uppercase border-b border-emerald-500/20 pb-2">חצי גמר (ימין)</span>
                  
                  <div className="space-y-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 shadow-xl">
                    <button 
                      disabled={!bracket.sf3}
                      onClick={() => advanceTeam('f2', bracket.sf3)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-all ${bracket.sf3 ? 'bg-slate-955 border-slate-800 text-slate-200 hover:bg-slate-850 cursor-pointer' : 'bg-slate-950/30 border-slate-900/60 text-slate-500 cursor-not-allowed'} ${bracket.f2?.id === bracket.sf3?.id && bracket.sf3 ? '!bg-amber-400 !text-slate-955 !border-amber-400' : ''}`}
                    >
                      <span>{bracket.sf3 ? `${bracket.sf3.flag} ${bracket.sf3.name}` : "מנצחת רבע 3"}</span>
                      {bracket.f2?.id === bracket.sf3?.id && bracket.sf3 && <Check className="w-4 h-4" />}
                    </button>
                    <button 
                      disabled={!bracket.sf4}
                      onClick={() => advanceTeam('f2', bracket.sf4)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-all ${bracket.sf4 ? 'bg-slate-955 border-slate-800 text-slate-200 hover:bg-slate-850 cursor-pointer' : 'bg-slate-950/30 border-slate-900/60 text-slate-500 cursor-not-allowed'} ${bracket.f2?.id === bracket.sf4?.id && bracket.sf4 ? '!bg-amber-400 !text-slate-955 !border-amber-400' : ''}`}
                    >
                      <span>{bracket.sf4 ? `${bracket.sf4.flag} ${bracket.sf4.name}` : "מנצחת רבע 4"}</span>
                      {bracket.f2?.id === bracket.sf4?.id && bracket.sf4 && <Check className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 5. Right side Quarter Finals */}
                <div className="flex flex-col gap-8 w-60">
                  <span className="text-[11px] font-extrabold text-emerald-400 tracking-wider text-center uppercase border-b border-emerald-500/20 pb-2">רבע גמר (ימין)</span>
                  
                  {/* Pair 3: QF5 vs QF6 */}
                  <div className="space-y-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                    <button 
                      onClick={() => advanceTeam('sf3', bracket.qf5)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${bracket.sf3?.id === bracket.qf5.id ? 'bg-amber-400 text-slate-955 border-amber-400 font-extrabold' : 'bg-slate-950 hover:bg-slate-850 text-slate-200 border-slate-800'}`}
                    >
                      <span>{bracket.qf5.flag} {bracket.qf5.name}</span>
                      {bracket.sf3?.id === bracket.qf5.id && <Check className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => advanceTeam('sf3', bracket.qf6)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${bracket.sf3?.id === bracket.qf6.id ? 'bg-amber-400 text-slate-955 border-amber-400 font-extrabold' : 'bg-slate-950 hover:bg-slate-850 text-slate-200 border-slate-800'}`}
                    >
                      <span>{bracket.qf6.flag} {bracket.qf6.name}</span>
                      {bracket.sf3?.id === bracket.qf6.id && <Check className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Pair 4: QF7 vs QF8 */}
                  <div className="space-y-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                    <button 
                      onClick={() => advanceTeam('sf4', bracket.qf7)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${bracket.sf4?.id === bracket.qf7.id ? 'bg-amber-400 text-slate-955 border-amber-400 font-extrabold' : 'bg-slate-950 hover:bg-slate-850 text-slate-200 border-slate-800'}`}
                    >
                      <span>{bracket.qf7.flag} {bracket.qf7.name}</span>
                      {bracket.sf4?.id === bracket.qf7.id && <Check className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => advanceTeam('sf4', bracket.qf8)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${bracket.sf4?.id === bracket.qf8.id ? 'bg-amber-400 text-slate-955 border-amber-400 font-extrabold' : 'bg-slate-950 hover:bg-slate-850 text-slate-200 border-slate-800'}`}
                    >
                      <span>{bracket.qf8.flag} {bracket.qf8.name}</span>
                      {bracket.sf4?.id === bracket.qf8.id && <Check className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Stars & Teams */}
        {activeTab === 'stars' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-md">
              <div className="relative w-full sm:w-96">
                <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="חפש נבחרת או שחקן כוכב..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-amber-400 transition-all text-slate-100"
                />
              </div>
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
                <Users className="w-4 h-4" />
                <span>מציג {filteredTeams.length} נבחרות משתתפות</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTeams.map((team) => {
                const hasVotedThis = votedPlayer === team.star;

                return (
                  <div key={team.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all flex flex-col justify-between">
                    
                    <div className="bg-slate-955 p-4 flex items-center justify-between border-b border-slate-850">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl filter drop-shadow-sm">{team.flag}</span>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-100">{team.name}</h3>
                          <span className="text-[10px] text-slate-400">בית {team.group}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                        דירוג #{team.rank}
                      </span>
                    </div>

                    <div className="p-4 space-y-4 flex-1">
                      <div className="bg-slate-955/50 p-3 rounded-xl border border-slate-800/80 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">כוכב הנבחרת:</span>
                          <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                            {team.star}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">קבוצה:</span>
                          <span className="font-semibold text-slate-200">{team.starClub}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">גיל:</span>
                          <span className="font-semibold text-slate-200 font-mono">{team.starAge}</span>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-slate-800/60 pt-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">הצבעות לכוכב:</span>
                          <span className="font-extrabold text-amber-400 font-mono">
                            {playerVotes[team.star]?.toLocaleString()}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleVote(team.star)}
                          disabled={hasVotedThis}
                          className={`w-full text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${hasVotedThis ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700'}`}
                        >
                          {hasVotedThis ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>הצבעת כבר שחקן זה</span>
                            </>
                          ) : (
                            <>
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              <span>הצבע לכוכב הטורניר</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => { playSound('click'); setSelectedTeamDetails(team); }}
                      className="bg-slate-955/40 hover:bg-slate-950 text-slate-400 hover:text-amber-400 text-xs py-2 border-t border-slate-850 flex items-center justify-center gap-1 transition-colors cursor-pointer w-full"
                    >
                      <span>צפה בפרופיל נבחרת מלא</span>
                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                    </button>

                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Dialog 1: Team details */}
      <dialog 
        ref={teamDialogRef} 
        closedby="any" 
        onClick={(e) => handleDialogBackdropClick(e, teamDialogRef, setSelectedTeamDetails)}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 text-slate-100 p-0 rounded-3xl max-w-md w-[90%] shadow-2xl backdrop:bg-slate-955/70 backdrop:backdrop-blur-sm focus:outline-none open:animate-fadeIn z-50 overflow-hidden"
      >
        {selectedTeamDetails && (
          <div className="relative">
            <div className="bg-slate-955 p-6 flex items-center justify-between border-b border-slate-850">
              <div className="flex items-center gap-3">
                <span className="text-5xl filter drop-shadow-md">{selectedTeamDetails.flag}</span>
                <div>
                  <h3 className="text-xl font-black text-slate-100">{selectedTeamDetails.name}</h3>
                  <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full font-bold inline-block mt-1">
                    בית {selectedTeamDetails.group} • דירוג פיפ״א: #{selectedTeamDetails.rank}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => { playSound('click'); setSelectedTeamDetails(null); }}
                className="text-slate-400 hover:text-slate-200 text-2xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h4 className="font-extrabold text-sm text-amber-400 border-b border-slate-800 pb-1">פרופיל שחקן כוכב</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-850">
                  <span className="text-slate-400 block mb-0.5">שם כוכב:</span>
                  <span className="font-bold text-slate-100 text-sm">{selectedTeamDetails.star}</span>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-850">
                  <span className="text-slate-400 block mb-0.5">קבוצה מקצוענית:</span>
                  <span className="font-bold text-slate-100 text-sm">{selectedTeamDetails.starClub}</span>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-850">
                  <span className="text-slate-400 block mb-0.5">גיל:</span>
                  <span className="font-bold text-slate-100 text-sm font-mono">{selectedTeamDetails.starAge}</span>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-850">
                  <span className="text-slate-400 block mb-0.5">ציון שחקן (Rating):</span>
                  <span className="font-bold text-amber-400 text-sm font-mono">{selectedTeamDetails.rating}/100</span>
                </div>
              </div>

              <h4 className="font-extrabold text-sm text-amber-400 border-b border-slate-800 pb-1 pt-2">נתוני סימולציה נוכחיים</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950/30 p-2.5 rounded-lg border border-slate-855">
                  <span className="text-slate-500 block mb-0.5">משחקים:</span>
                  <span className="font-bold font-mono text-slate-200">{selectedTeamDetails.played}</span>
                </div>
                <div className="bg-slate-950/30 p-2.5 rounded-lg border border-slate-855">
                  <span className="text-slate-500 block mb-0.5">ניצחונות:</span>
                  <span className="font-bold font-mono text-emerald-400">{selectedTeamDetails.won}</span>
                </div>
                <div className="bg-slate-950/30 p-2.5 rounded-lg border border-slate-855">
                  <span className="text-slate-500 block mb-0.5">הפסדים:</span>
                  <span className="font-bold font-mono text-rose-400">{selectedTeamDetails.lost}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-955/40 p-4 border-t border-slate-850 flex justify-end">
              <button 
                onClick={() => { playSound('click'); setSelectedTeamDetails(null); }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                סגור פרופיל
              </button>
            </div>
          </div>
        )}
      </dialog>

      {/* Dialog 2: Share modal */}
      <dialog 
        ref={shareDialogRef} 
        closedby="any" 
        onClick={(e) => handleDialogBackdropClick(e, shareDialogRef, setShareModalOpen)}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 text-slate-100 p-0 rounded-3xl max-w-md w-[90%] shadow-2xl backdrop:bg-slate-955/70 backdrop:backdrop-blur-sm focus:outline-none open:animate-fadeIn z-50 overflow-hidden"
      >
        <div className="relative">
          <div className="bg-slate-955 p-5 flex items-center justify-between border-b border-slate-850">
            <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-amber-400" />
              <span>שיתוף ניחוש מונדיאל 2026</span>
            </h3>
            <button 
              onClick={() => { playSound('click'); setShareModalOpen(false); }}
              className="text-slate-400 hover:text-slate-200 text-2xl font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-400">העתק את טקסט הניחוש שלך ושתף אותו ברשתות החברתיות:</p>
            <div className="bg-slate-955 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 select-all whitespace-pre-wrap leading-relaxed text-right">
              {getShareText()}
            </div>
            
            <button 
              onClick={copyToClipboard}
              className={`w-full font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-amber-400 hover:bg-amber-500 text-slate-950'}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>הועתק ללוח בהצלחה!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>העתק טקסט ללוח</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-955/40 p-4 border-t border-slate-850 flex justify-end">
            <button 
              onClick={() => { playSound('click'); setShareModalOpen(false); }}
              className="bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              סגור חלון
            </button>
          </div>
        </div>
      </dialog>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-955/80 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>פורטל מונדיאל 2026 אינטראקטיבי. עיצוב פרימיום מלא ללא פשרות.</span>
          <span className="font-mono text-[10px]">© 2026 World Cup Center Israel 🇮🇱</span>
        </div>
      </footer>

    </div>
  );
}
