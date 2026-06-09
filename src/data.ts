import { Pitch, PitchType, MatchChallenge, SkillLevel, Booking } from './types';

export const INITIAL_PITCHES: Pitch[] = [
  {
    id: 'pitch-1',
    name: 'ملعب السوبر التركي (الخارجي)',
    type: PitchType.OUTDOOR_TURF,
    ratePerHour: 180,
    rating: 4.9,
    image: 'linear-gradient(135deg, #15803d 0%, #166534 100%)', // Emerald Green grass theme
    features: ['مياه مجانية', 'غرف تبديل مساحات', 'كشافات ليد عالية الجودة', 'عشب تركي ممتاز 5 سم'],
    maxPlayers: 10
  },
  {
    id: 'pitch-2',
    name: 'صالة الزوبعة المغطاة (VIP)',
    type: PitchType.INDOOR_PRO,
    ratePerHour: 280,
    rating: 5.0,
    image: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', // Pro indoor Royal blue theme
    features: ['تكييف مركزي كامل', 'أرضيات باركيه ممتصة للصدمات', 'حمام سبا استشفائي', 'كاميرا بث وتسجيل المباريات'],
    maxPlayers: 10
  },
  {
    id: 'pitch-3',
    name: 'أرينا الأضواء الذهبية المضيئة',
    type: PitchType.GOLDEN_DOME,
    ratePerHour: 240,
    rating: 4.8,
    image: 'linear-gradient(135deg, #ca8a04 0%, #713f12 100%)', // Premium Neon Gold theme
    features: ['نظام صوت ستيريو عملاق', 'أضواء تفاعلية ذكية بقوة 2000W', 'لوحة تسجيل أرقام ديجيتال', 'حكم محترف عند الطلب'],
    maxPlayers: 12
  }
];

// Initial active challenges from different teams searching for matches or key players
export const INITIAL_CHALLENGES: MatchChallenge[] = [
  {
    id: 'challenge-1',
    title: 'تحدي حامي! ناقصنا حارس مرمى ومدافع مستوانا متوسط',
    pitchName: 'ملعب السوبر التركي (الخارجي)',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    creatorName: 'أحمد كابيتانو',
    creatorPhone: '01012345678',
    currentPlayers: 8,
    requiredPlayers: 10,
    level: SkillLevel.INTERMEDIATE,
    joinedUsers: ['يوسف', 'مصطفى']
  },
  {
    id: 'challenge-2',
    title: 'مباراة خماسية ودية - تحدي الفرق الكبيرة (حريّفة فقط)',
    pitchName: 'صالة الزوبعة المغطاة (VIP)',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    time: '21:00',
    creatorName: 'كريم التونسي',
    creatorPhone: '01234567890',
    currentPlayers: 10,
    requiredPlayers: 12,
    level: SkillLevel.PRO,
    joinedUsers: ['عمر السوري', 'خالد فوزي']
  },
  {
    id: 'challenge-3',
    title: 'تحدي ترفيهي شبابي بسيط ليلة الخميس',
    pitchName: 'أرينا الأضواء الذهبية المضيئة',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // in 2 days
    time: '18:00',
    creatorName: 'زياد مروان',
    creatorPhone: '01198765432',
    currentPlayers: 5,
    requiredPlayers: 10,
    level: SkillLevel.BEGINNER,
    joinedUsers: ['محمد سعد']
  }
];

// Seed initial bookings to show that some slots are already booked by other customers
export const generateInitialBookings = (): Booking[] => {
  const bookings: Booking[] = [];
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Some random bookings for today to simulate real life
  bookings.push({
    id: 'mock-1',
    pitchId: 'pitch-1',
    pitchName: 'ملعب السوبر التركي (الخارجي)',
    date: today,
    startTime: '17:00',
    duration: 1,
    price: 180,
    customerName: 'كابتن محمد عادل',
    customerPhone: '01500001111',
    status: 'confirmed',
    isMatchSearch: false
  });

  bookings.push({
    id: 'mock-2',
    pitchId: 'pitch-1',
    pitchName: 'ملعب السوبر التركي (الخارجي)',
    date: today,
    startTime: '20:00',
    duration: 2,
    price: 360,
    customerName: 'فريق النجوم الخماسي',
    customerPhone: '01000002222',
    status: 'confirmed',
    isMatchSearch: true,
    joinedPlayers: ['تامر', 'سعيد']
  });

  bookings.push({
    id: 'mock-3',
    pitchId: 'pitch-2',
    pitchName: 'صالة الزوبعة المغطاة (VIP)',
    date: today,
    startTime: '21:00',
    duration: 1,
    price: 280,
    customerName: 'رابطة مشجعي الأهلي',
    customerPhone: '01211112222',
    status: 'confirmed',
    isMatchSearch: false
  });

  bookings.push({
    id: 'mock-4',
    pitchId: 'pitch-3',
    pitchName: 'أرينا الأضواء الذهبية المضيئة',
    date: tomorrow,
    startTime: '16:00',
    duration: 1,
    price: 240,
    customerName: 'كابتن شريف عثمان',
    customerPhone: '01144445555',
    status: 'confirmed',
    isMatchSearch: false
  });

  bookings.push({
    id: 'mock-5',
    pitchId: 'pitch-3',
    pitchName: 'أرينا الأضواء الذهبية المضيئة',
    date: tomorrow,
    startTime: '22:00',
    duration: 2,
    price: 480,
    customerName: 'مجموعة النصر سبورت',
    customerPhone: '01066667777',
    status: 'confirmed',
    isMatchSearch: true,
    joinedPlayers: ['طارق', 'حماد', 'إلياس']
  });

  return bookings;
};

export const BOOKING_HOURS = [
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
  '00:00', '01:00', '02:00'
];
