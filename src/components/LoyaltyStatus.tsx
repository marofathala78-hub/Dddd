import { Award, Flame, Star, Trophy, Clock, CheckCircle, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import { UserLoyalty } from '../types';

interface LoyaltyStatusProps {
  loyalty: UserLoyalty;
  onClaimReward: (rewardName: string, pointCost: number) => void;
}

export default function LoyaltyStatus({ loyalty, onClaimReward }: LoyaltyStatusProps) {
  // Let's assume booking milestones: 5 bookings is a free hour!
  const progressToFreeHour = (loyalty.completedBookings % 5);
  const percentToFreeHour = (progressToFreeHour / 5) * 100;
  const remainingBookings = 5 - progressToFreeHour;

  const rewardsStore = [
    {
      id: 'reward-1',
      title: 'كوبون مياه مجانية للفريق كامل',
      description: 'كاب سن ممتع + مياه كرتونة لكل اللاعبين في الماتش',
      points: 150,
      icon: Gift
    },
    {
      id: 'reward-2',
      title: 'ساعة إحماء إضافية مجانية',
      description: 'نصف ساعة إحماء وتمرين قبل وقت اللعب الأساسي',
      points: 300,
      icon: Clock
    },
    {
      id: 'reward-3',
      title: 'حكم الزوبعة بروفيسور للمباراة',
      description: 'حكم معتمد لإدارة وتوجيه مباراة فرقك الحماسية',
      points: 400,
      icon: Trophy
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="loyalty-status-panel">
      {/* Gamified Profile Tier Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden"
      >
        {/* Glowing background circles */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-2xl text-emerald-400 font-sans">
              {loyalty.name.trim().charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] uppercase font-black tracking-wide text-emerald-400 w-fit">
              <Flame className="w-3.5 h-3.5" />
              فئة {loyalty.tier}
            </span>
            <h4 className="text-lg font-black text-white mt-1">{loyalty.name}</h4>
            <p className="text-xs text-slate-400">{loyalty.phone}</p>
          </div>
        </div>

        {/* Level up specifications */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">ماتشات محجوزة بنجاح</span>
            <span className="text-white font-black font-sans">{loyalty.completedBookings} مباريات</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">مجموع كؤوس الزوبعة</span>
            <span className="text-amber-400 font-black font-sans flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              {loyalty.points} نقطة
            </span>
          </div>
        </div>

        {/* Milestone Badge */}
        <div className="pt-4 border-t border-slate-800/80">
          <span className="text-slate-505 text-[10px] text-slate-300 font-medium block">الفئة الموالية:</span>
          <p className="text-xs font-black text-white mt-1 leading-relaxed">
            احجز {5 - (loyalty.completedBookings % 5)} ملاعب إضافية لترقية حسابك لفئة <span className="text-cyan-400">{loyalty.completedBookings >= 5 ? 'إعصار الزوبعة' : 'الحريّف'}</span>
          </p>
        </div>
      </motion.div>

      {/* Free Hour Milestones Meter */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
        <div>
          <h4 className="text-base font-black text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            حلم الزوبعة: ساعة مجانية!
          </h4>
          <p className="text-xs text-slate-450 text-slate-400 mt-1">
            كلما حجزتم 5 مباريات خماسية مع ملاعب الزوبعة، تتاح لكم الساعة السادسة مجاناً كتقدير لعشق حريفة الكرة للملعب!
          </p>
        </div>

        {/* Visual soccer meter progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-400 font-sans">مستوى التقدم: {progressToFreeHour}/5</span>
            <span className="text-slate-400 font-sans">{percentToFreeHour}% اكتمل</span>
          </div>
          
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/5 relative">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              style={{ width: `${percentToFreeHour}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950/50 rounded-2xl p-3.5 border border-white/5 flex items-center gap-3">
          <CheckCircle className={`w-8 h-8 ${progressToFreeHour >= 0 ? 'text-emerald-400' : 'text-slate-600'}`} />
          <div>
            <span className="text-[10px] text-slate-450 text-slate-400 block font-medium">خطوتك القادمة</span>
            <span className="text-xs font-black text-white">
              {remainingBookings === 5 ? 'ساعتك الـ6 القادمة مجانية!' : `تبقّى لك ${remainingBookings} حجوزات للحصول على اللعب المجاني!`}
            </span>
          </div>
        </div>
      </div>

      {/* Loyalty Points Rewards Store */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
        <div>
          <h4 className="text-base font-black text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            متجر هدايا الزوبعة للشباب
          </h4>
          <p className="text-xs text-slate-400 mt-1">استبدل رصيد نقاطك بهدايا ومميزات إضافية لفريقك داخل الملعب:</p>
        </div>

        {/* Rewards list */}
        <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1" id="rewards-store-list">
          {rewardsStore.map((reward) => {
            const canClaim = loyalty.points >= reward.points;

            return (
              <div
                key={reward.id}
                className="bg-slate-950/40 border border-slate-900 p-2.5 rounded-xl flex items-center justify-between gap-3 text-right"
              >
                <div className="flex-1">
                  <span className="text-[11px] font-black text-white block leading-tight">{reward.title}</span>
                  <p className="text-[9px] text-slate-405 text-slate-400 mt-1 leading-normal font-sans">{reward.description}</p>
                </div>

                <button
                  disabled={!canClaim}
                  onClick={() => onClaimReward(reward.title, reward.points)}
                  className={`cursor-pointer text-[10px] px-2.5 py-1.5 rounded-lg font-black transition-all ${
                    canClaim
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {reward.points} كأس
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
