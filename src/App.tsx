import { useState, useEffect } from 'react';
import {
  Calendar,
  Trophy,
  Flame,
  Award,
  CheckCircle,
  Gift,
  HelpCircle,
  Phone,
  User,
  Plus,
  Compass,
  Sparkles,
  ShieldAlert,
  Volleyball
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Models & Types
import { Pitch, Booking, MatchChallenge, UserLoyalty, SkillLevel } from './types';
import { INITIAL_PITCHES, INITIAL_CHALLENGES, generateInitialBookings } from './data';

// Custom Subcomponents
import QuickStats from './components/QuickStats';
import PitchCard from './components/PitchCard';
import BookingGrid from './components/BookingGrid';
import ChallengesBoard from './components/ChallengesBoard';
import LoyaltyStatus from './components/LoyaltyStatus';
import BookingForm from './components/BookingForm';

export default function App() {
  // 1. Core Persistent State Management
  const [pitches] = useState<Pitch[]>(INITIAL_PITCHES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [challenges, setChallenges] = useState<MatchChallenge[]>([]);
  const [loyalty, setLoyalty] = useState<UserLoyalty>({
    name: 'كابتن معروف فتح الله', // Pre-filled name based on email marofathala78
    phone: '01099887766',
    completedBookings: 3,
    points: 180,
    tier: 'المحترف'
  });

  // 2. Active Tab & Navigation Choices
  const [activeTab, setActiveTab] = useState<'arena' | 'challenges' | 'loyalty'>('arena');

  // 3. Current Selection States (Booking Process)
  const [selectedPitch, setSelectedPitch] = useState<Pitch>(INITIAL_PITCHES[0]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(1.5); // Hours, default to 1.5

  // 4. Modal or Celebration Overlays
  const [celebrationBooking, setCelebrationBooking] = useState<Booking | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 5. Hydrate from localStorage on Startup
  useEffect(() => {
    const cachedBookings = localStorage.getItem('capitano_bookings');
    const cachedChallenges = localStorage.getItem('capitano_challenges');
    const cachedLoyalty = localStorage.getItem('capitano_loyalty');

    if (cachedBookings) {
      setBookings(JSON.parse(cachedBookings));
    } else {
      const initial = generateInitialBookings();
      setBookings(initial);
      localStorage.setItem('capitano_bookings', JSON.stringify(initial));
    }

    if (cachedChallenges) {
      setChallenges(JSON.parse(cachedChallenges));
    } else {
      setChallenges(INITIAL_CHALLENGES);
      localStorage.setItem('capitano_challenges', JSON.stringify(INITIAL_CHALLENGES));
    }

    if (cachedLoyalty) {
      setLoyalty(JSON.parse(cachedLoyalty));
    } else {
      localStorage.setItem('capitano_loyalty', JSON.stringify(loyalty));
    }
  }, []);

  // Update Username and loyalty phone globally
  const handleUpdateUser = (name: string) => {
    const updated = { ...loyalty, name };
    setLoyalty(updated);
    localStorage.setItem('capitano_loyalty', JSON.stringify(updated));
  };

  // 6. Action: Add New Custom Booking Hour
  const handleConfirmBooking = (formData: {
    customerName: string;
    customerPhone: string;
    isMatchSearch: boolean;
    discountedPrice: number;
    promoApplied: string | null;
  }) => {
    if (!selectedTime) return;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      pitchId: selectedPitch.id,
      pitchName: selectedPitch.name,
      date: selectedDate,
      startTime: selectedTime,
      duration,
      price: formData.discountedPrice,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      status: 'confirmed',
      isMatchSearch: formData.isMatchSearch,
      joinedPlayers: formData.isMatchSearch ? [formData.customerName] : []
    };

    // Save and Update Bookings State
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('capitano_bookings', JSON.stringify(updatedBookings));

    // Update Loyalty Stats: increment points by 50 and check milestones!
    const updatedCompletedBookings = loyalty.completedBookings + 1;
    let earnedPoints = 50;
    if (formData.promoApplied === 'ZAWBA50') earnedPoints = 15; // less points for huge discounts
    
    // Check if they moved up to CAPITANO tier
    const isCapitano = updatedCompletedBookings >= 5;
    const updatedLoyalty: UserLoyalty = {
      ...loyalty,
      completedBookings: updatedCompletedBookings,
      points: loyalty.points + earnedPoints,
      tier: isCapitano ? 'إعصار الزوبعة' : 'المحترف'
    };

    setLoyalty(updatedLoyalty);
    localStorage.setItem('capitano_loyalty', JSON.stringify(updatedLoyalty));

    // Automatically generate a match finder challenge if checked
    if (formData.isMatchSearch) {
      const newChallenge: MatchChallenge = {
        id: `challenge-${Date.now()}`,
        title: `تحدي كروي عام بملعب ${newBooking.pitchName} - متاح الانضمام للجميع!`,
        pitchName: newBooking.pitchName,
        date: newBooking.date,
        time: newBooking.startTime,
        creatorName: newBooking.customerName,
        creatorPhone: newBooking.customerPhone,
        currentPlayers: 1,
        requiredPlayers: selectedPitch.maxPlayers,
        level: SkillLevel.INTERMEDIATE,
        joinedUsers: [newBooking.customerName]
      };
      
      const updatedChallenges = [newChallenge, ...challenges];
      setChallenges(updatedChallenges);
      localStorage.setItem('capitano_challenges', JSON.stringify(updatedChallenges));
    }

    // Trigger Immersive modal
    setCelebrationBooking(newBooking);
    
    // Clear selections
    setSelectedTime(null);
  };

  // 7. Action: Join open challenge on challenges forum
  const handleJoinChallenge = (challengeId: string, participantName: string) => {
    const updatedChallenges = challenges.map((c) => {
      if (c.id === challengeId) {
        if (c.joinedUsers.includes(participantName)) return c;
        return {
          ...c,
          currentPlayers: c.currentPlayers + 1,
          joinedUsers: [...c.joinedUsers, participantName]
        };
      }
      return c;
    });

    setChallenges(updatedChallenges);
    localStorage.setItem('capitano_challenges', JSON.stringify(updatedChallenges));
    
    // Alert the user with youth excitement
    setSuccessMessage('ألف مبروك! انضممت للتحدي بنجاح، وتواصل الآن مع كابتن الفريق لتنسيق التبادل واللعب!');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // 8. Action: Join open bookings on scheduling grid
  const handleJoinMatchBooking = (bookingId: string) => {
    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        const currentJoined = b.joinedPlayers || [];
        if (currentJoined.includes(loyalty.name)) return b;
        return {
          ...b,
          joinedPlayers: [...currentJoined, loyalty.name]
        };
      }
      return b;
    });

    setBookings(updatedBookings);
    localStorage.setItem('capitano_bookings', JSON.stringify(updatedBookings));

    setSuccessMessage('تم انضمامك كلاعب للمباراة على الجدول بنجاح! جهّز حذاء الملاعب الخاص بك ⚽');
    setTimeout(() => setSuccessMessage(null), 4500);
  };

  // 9. Action: Add new custom match challenge posting
  const handleAddChallenge = (newChallengeData: Omit<MatchChallenge, 'id' | 'joinedUsers'>) => {
    const newChallenge: MatchChallenge = {
      ...newChallengeData,
      id: `challenge-${Date.now()}`,
      joinedUsers: [newChallengeData.creatorName]
    };

    const updated = [newChallenge, ...challenges];
    setChallenges(updated);
    localStorage.setItem('capitano_challenges', JSON.stringify(updated));

    setSuccessMessage('تم نشر تحديك الجديد بنجاح على منصة الملاعب العامة! استعد لاستقبال لاعبين حريفة.');
    setTimeout(() => setSuccessMessage(null), 4500);
  };

  // 10. Action: Claim rewards using points
  const handleClaimReward = (rewardTitle: string, pointsCost: number) => {
    if (loyalty.points < pointsCost) return;

    const updatedLoyalty: UserLoyalty = {
      ...loyalty,
      points: loyalty.points - pointsCost
    };

    setLoyalty(updatedLoyalty);
    localStorage.setItem('capitano_loyalty', JSON.stringify(updatedLoyalty));

    setSuccessMessage(`ألف مبروك! حصلت على كوبون { ${rewardTitle} } بنجاح. تم استبداله مقابل ${pointsCost} كأس، تواصل مع المشرف بالأرينا لتفعيله بنجاح! 🏆`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Get current bookings count today for stats
  const todayStr = new Date().toISOString().split('T')[0];
  const bookingsToday = bookings.filter((b) => b.date === todayStr).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative pb-12 antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Background soccer pitch fluorescent graphic design overlay */}
      <div className="absolute top-0 inset-x-0 h-[450px] bg-gradient-to-b from-emerald-950/15 via-transparent to-transparent pointer-events-none select-none z-0" />
      
      {/* Visual notification bar */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 inset-x-4 z-55 flex justify-center pointer-events-none"
          >
            <div className="bg-slate-900 border border-emerald-500 text-slate-100 font-bold px-6 py-4.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-xl text-xs leading-relaxed pointer-events-auto text-right">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Youth Header */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40 relative">
        <div className="max-w-7xl mx-auto px-4 py-4.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-[0_4px_10px_rgba(16,185,129,0.2)]">
              {/* Spinning stylized football graphic */}
              <Volleyball className="w-6 h-6 text-slate-950 animate-bounce" />
            </div>
            <div className="text-right">
              <h1 className="text-lg font-black text-white tracking-tight">مـلاعـب الـزوبـعـة الـخـمـاسـيـة</h1>
              <span className="text-[10px] text-emerald-400 font-semibold block uppercase tracking-wider">El-Zawba'a Premium Turf & Indoor Fields</span>
            </div>
          </div>

          {/* Bilingual Youth Welcome greeting */}
          <div className="flex items-center gap-5 text-right w-full sm:w-auto justify-end">
            <div className="hidden sm:block">
              <p className="text-xs text-slate-400 font-medium">مرحباً بك يا كابتن</p>
              <h3 className="text-sm font-black text-white mt-0.5">{loyalty.name}</h3>
            </div>
            
            <span className="flex items-center gap-1.5 rounded-2xl bg-slate-900 border border-slate-850 px-4 py-2 text-xs font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              أحدث عشب خماسي
            </span>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8 flex-1 z-10 relative">
        
        {/* Dynamic Stadium Headline Hero banner */}
        <section className="bg-radial-gradient from-emerald-950/20 to-transparent p-8 rounded-3xl border border-slate-900 text-center space-y-3 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black tracking-widest text-emerald-400 uppercase">
            #موسم_الزوبعة_الجديد ⚡
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            احجز ملعبك الخماسي بلمسة واحدة وسقّع سهرتك!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ملاعب بأبعاد قانونية ممتازة، عشب تركي مطاطي فاخر، صالة مغلقة ومكيفة كلياً VIP، بالإضافة لمنصة تواصل سريعة ومثيرة للانضمام لمباراة الشباب وتحدي الفرق الكبرى اليوم!
          </p>
        </section>

        {/* 1. Dashboard Statistics Counter */}
        <QuickStats
          activePitches={pitches.length}
          bookingsTodayCount={bookingsToday}
          activeChallengesCount={challenges.length}
          loyaltyPoints={loyalty.points}
        />

        {/* Tab System Switching Panel */}
        <div className="flex border-b border-slate-900/80 gap-6 overflow-x-auto pb-0.5" id="tab-nav-panel">
          {[
            { id: 'arena', label: 'حجز الملعب الخماسي', desc: 'اختر الملعب والوقت والساعة', icon: Calendar },
            { id: 'challenges', label: 'تحدي وماتشات الفرق الخماسية', desc: 'انضم لفرق خماسية ناقصة لاعبين', icon: Flame },
            { id: 'loyalty', label: 'نظام النقاط وهدايا الشباب', desc: 'استبدل كؤوسك بساعات ومياه مجانية', icon: Trophy }
          ].map((tab) => {
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`cursor-pointer pb-4 text-right flex items-start gap-3 transition-all min-w-[210px] shrink-0 border-b-2 outline-none ${
                  isSel
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${isSel ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900/40 text-slate-500'}`}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-black block leading-none">{tab.label}</span>
                  <span className="text-[10px] mt-1.5 block text-slate-450 text-slate-400 font-medium leading-none">{tab.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display of selected tab body */}
        <div className="min-h-[400px]">
          {activeTab === 'arena' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" id="arena-booking-module">
              
              {/* Left Form Selection for Pitch Cards */}
              <div className="lg:col-span-2 space-y-8">
                {/* A. Pitch Selection Stage */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-black text-white">1. اختيار الملعب الخماسي المفضل</h4>
                      <p className="text-xs text-slate-400 mt-1">تضم الأرينا خيارات مختلفة لتناسب نوع لعب فريقك وسرعته</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pitches.map((pitch) => (
                      <PitchCard
                        key={pitch.id}
                        pitch={pitch}
                        isSelected={selectedPitch.id === pitch.id}
                        onSelect={(p) => {
                          setSelectedPitch(p);
                          setSelectedTime(null); // Reset selected hour to prevent mismatching pitch price
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* B. Date Selection Stage */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-black text-white">2. اختيار تاريخ الحجز واللعب</h4>
                      <p className="text-xs text-slate-400 mt-1">يمكنك حجز الملاعب اليوم أو مسبقاً طوال الأسبوع</p>
                    </div>

                    {/* Simple Quick Day Buttons: Today, Tomorrow, Day after */}
                    <div className="flex gap-2">
                      {[
                        { label: 'اليوم', offset: 0 },
                        { label: 'غداً', offset: 1 },
                        { label: 'خلال يومين', offset: 2 }
                      ].map((item) => {
                        const targetDate = new Date(Date.now() + item.offset * 86400000)
                          .toISOString()
                          .split('T')[0];
                        const isSel = selectedDate === targetDate;

                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                              setSelectedDate(targetDate);
                              setSelectedTime(null);
                            }}
                            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSel
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-slate-900 border border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Standard date calendar selector styled sleek */}
                  <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-300 font-bold">تاريخ اللعب المحدد:</span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime(null);
                      }}
                      className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs font-black text-white focus:outline-none focus:border-emerald-500/40 text-right cursor-pointer"
                    />
                  </div>
                </div>

                {/* C. Booking Hours Grid Stage */}
                <div>
                  <h4 className="text-lg font-black text-white mb-2">3. جدول ساعات الملاعب الشاغرة</h4>
                  <p className="text-xs text-slate-400 mb-4">اضغط على الساعة المتاحة لتحديد موعد انطلاق صافرة البداية</p>

                  <BookingGrid
                    selectedPitchId={selectedPitch.id}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                    duration={duration}
                    onChangeDuration={setDuration}
                    bookings={bookings}
                    onJoinMatchBooking={handleJoinMatchBooking}
                    currentUsername={loyalty.name}
                  />
                </div>
              </div>

              {/* Sidebar Booking Checkout Details Pane */}
              <div className="space-y-6">
                <div className="sticky top-24">
                  {selectedTime ? (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <BookingForm
                        selectedPitch={selectedPitch}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        duration={duration}
                        onConfirm={handleConfirmBooking}
                        currentUsername={loyalty.name}
                        onChangeUsername={handleUpdateUser}
                      />
                    </motion.div>
                  ) : (
                    <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl p-8 text-center text-slate-500 space-y-3">
                      <Compass className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                      <h5 className="text-sm font-black text-slate-400">بانتظار اكمال الاختيار...</h5>
                      <p className="text-[11px] leading-relaxed">
                        اختر أحد الملاعب الخماسية، حدد اليوم، ثم عيّن ساعة اللعب المناسبة للانطلاق في صفحة الدفع الفوري وتأكيد الحجز.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'challenges' && (
            <ChallengesBoard
              challenges={challenges}
              onJoinChallenge={handleJoinChallenge}
              onAddChallenge={handleAddChallenge}
              currentUsername={loyalty.name}
            />
          )}

          {activeTab === 'loyalty' && (
            <LoyaltyStatus
              loyalty={loyalty}
              onClaimReward={handleClaimReward}
            />
          )}
        </div>

      </main>

      {/* Gamified Immersive Celebration Modal */}
      <AnimatePresence>
        {celebrationBooking && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-slate-900 border border-emerald-500/40 rounded-[32px] p-8 max-w-lg w-full text-center space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.25)] relative overflow-hidden"
              id="success-celebration-popup"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-10 h-10 text-slate-950" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                  تـم الحجز بنجاح يا بطل! ⭐
                </span>
                <h3 className="text-xl font-black text-white mt-3">ملعبك محجوز وجاهز للمباراة!</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  ألف مبروك يا كابتن {celebrationBooking.customerName}! تم إرسال طلب الحجز لصافرة الملعب ومبين على الجدول بنجاح.
                </p>
              </div>

              {/* Recapitulation cards */}
              <div className="bg-slate-950/80 rounded-2xl p-4 text-right divide-y divide-slate-900 border border-white/5 space-y-3">
                <div className="pb-3 flex justify-between text-xs">
                  <span className="text-slate-400">اسم الملعب المحجوز:</span>
                  <span className="text-white font-black">{celebrationBooking.pitchName}</span>
                </div>
                <div className="py-3 flex justify-between text-xs">
                  <span className="text-slate-400">التاريخ ووقت البدء:</span>
                  <span className="text-emerald-400 font-bold font-sans">
                    {celebrationBooking.date} في تمام الساعة {celebrationBooking.startTime}
                  </span>
                </div>
                <div className="py-3 flex justify-between text-xs">
                  <span className="text-slate-400">قيمة تذكرة اللعب الكلية:</span>
                  <span className="text-white font-black font-sans">{celebrationBooking.price} ج.م (الدفع كاش هناك)</span>
                </div>
                <div className="pt-3 flex justify-between text-xs">
                  <span className="text-slate-400">حالة باب تحدي الشباب:</span>
                  <span className={`font-bold ${celebrationBooking.isMatchSearch ? 'text-orange-400' : 'text-slate-450 text-slate-450 text-slate-400'}`}>
                    {celebrationBooking.isMatchSearch ? 'عام - متاح للجميع الانضمام' : 'خاص بفرقتك فقط'}
                  </span>
                </div>
              </div>

              {/* Gamified Rewards feedback */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-xs text-emerald-300 font-bold leading-relaxed">
                🎉 كسبت +50 كأس إفتراضي! تمت إضافتها لرصيدك لترقية الحساب والحصول على ساعتك المجانية!
              </div>

              {/* CTA actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCelebrationBooking(null);
                    if (celebrationBooking.isMatchSearch) {
                      setActiveTab('challenges');
                    }
                  }}
                  className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-2xl flex-1 text-xs font-black shadow-lg transition-all"
                >
                  {celebrationBooking.isMatchSearch ? 'شاهد تحديك بنشاط الفرق' : 'أريد العودة للملعب'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Styled Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 mt-16 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-sans">
          <p>© 2026 ملاعب الزوبعة لتنسيق وحجز الملاعب الخماسية المعتمدة. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <span className="hover:text-emerald-400 transition cursor-pointer">شروط الإستخدام</span>
            <span>•</span>
            <span className="hover:text-emerald-400 transition cursor-pointer">سياسة الإلغاء السريع</span>
            <span>•</span>
            <span className="hover:text-emerald-400 transition cursor-pointer">مساعدة الفِرَق</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
