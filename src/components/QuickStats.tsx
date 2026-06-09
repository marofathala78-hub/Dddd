import { Activity, Flame, TrendingUp, Award, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface QuickStatsProps {
  activePitches: number;
  bookingsTodayCount: number;
  activeChallengesCount: number;
  loyaltyPoints: number;
}

export default function QuickStats({
  activePitches,
  bookingsTodayCount,
  activeChallengesCount,
  loyaltyPoints
}: QuickStatsProps) {
  const stats = [
    {
      id: 'stat-pitches',
      title: 'ملاعب الزوبعة النشطة',
      value: `${activePitches} ملاعب`,
      desc: 'بأحدث عشب تركي معتمد وصالات مغطاة',
      icon: Activity,
      color: 'from-emerald-500/10 to-emerald-500/20 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'stat-hours',
      title: 'ساعات محجوزة اليوم',
      value: `${bookingsTodayCount} ساعة`,
      desc: 'النشاط الأقصى يبدأ الساعة 7:00 مساءً',
      icon: Calendar,
      color: 'from-cyan-500/10 to-cyan-500/20 text-cyan-400 border-cyan-500/20'
    },
    {
      id: 'stat-challenges',
      title: 'تحديات الفرق النشطة',
      value: `${activeChallengesCount} تحديات`,
      desc: 'انضم لفرق خماسية والعب في الزوبعة اليوم',
      icon: Flame,
      color: 'from-orange-500/10 to-orange-500/20 text-orange-400 border-orange-500/20'
    },
    {
      id: 'stat-loyalty',
      title: 'رصيد نقاط الولاء للشباب',
      value: `${loyaltyPoints} نقطة`,
      desc: 'تبقّى لك مباراتين للحصول على ساعة مجانية!',
      icon: Award,
      color: 'from-amber-500/10 to-amber-500/20 text-amber-400 border-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="quick-stats-container">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.id}
          id={stat.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className={`relative overflow-hidden rounded-2xl border bg-slate-900/40 p-5 backdrop-blur-md transition-all ${stat.color}`}
        >
          {/* Subtle background soccer ball patterns or decorative details */}
          <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-[0.03] select-none pointer-events-none">
            <TrendingUp size={120} />
          </div>

          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block tracking-wide">{stat.title}</span>
              <h3 className="text-2xl font-black font-sans tracking-tight text-white">{stat.value}</h3>
              <p className="text-xs text-slate-400/90 leading-relaxed font-sans">{stat.desc}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
