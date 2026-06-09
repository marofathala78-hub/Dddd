import React, { useState } from 'react';
import { Shield, Sparkles, Check, Flame, MessageSquare, Ticket, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Pitch } from '../types';

interface BookingFormProps {
  selectedPitch: Pitch;
  selectedDate: string;
  selectedTime: string;
  duration: number;
  onConfirm: (formData: {
    customerName: string;
    customerPhone: string;
    isMatchSearch: boolean;
    discountedPrice: number;
    promoApplied: string | null;
  }) => void;
  currentUsername: string;
  onChangeUsername: (name: string) => void;
}

export default function BookingForm({
  selectedPitch,
  selectedDate,
  selectedTime,
  duration,
  onConfirm,
  currentUsername,
  onChangeUsername
}: BookingFormProps) {
  const [phone, setPhone] = useState('010');
  const [isMatchSearch, setIsMatchSearch] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isSubmitPending, setIsSubmitPending] = useState(false);

  // Price calculations
  const basePrice = selectedPitch.ratePerHour * duration;
  const discountAmount = Math.round(basePrice * (discountPercent / 100));
  const finalPrice = basePrice - discountAmount;

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (code === 'YOUTH20' || code === 'KORA20') {
      setDiscountPercent(20);
      setPromoMessage('تم تطبيق كود الشباب الموفر! خصم 20% ✓');
    } else if (code === 'ZAWBA50') {
      setDiscountPercent(50);
      setPromoMessage('كود إعصار الزوبعة المعتمد! خصم 50% كاش! ⭐');
    } else {
      setDiscountPercent(0);
      setPromoMessage('عذراً، كود الخصم غير صحيح أو منتهي.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUsername.trim() || !phone.trim() || phone.trim().length < 8) {
      alert('يرجى التحقق من إدخال الاسم ورقم الهاتف بشكل كامل.');
      return;
    }

    setIsSubmitPending(true);
    // Simulate slight process delay for modern youth feedback
    setTimeout(() => {
      onConfirm({
        customerName: currentUsername,
        customerPhone: phone,
        isMatchSearch,
        discountedPrice: finalPrice,
        promoApplied: discountPercent > 0 ? promoCode.toUpperCase().trim() : null
      });
      setIsSubmitPending(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden" id="booking-checkout-form">
      {/* Dynamic fluorescent corner design */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />

      <h4 className="text-lg font-black text-white flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-emerald-400" />
        تأكيد تفاصيل الحجز والدفع الإفتراضي
      </h4>

      {/* Recapitulation details summary grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-950/40 p-3 rounded-2xl border border-white/5">
          <span className="text-[10px] text-slate-400 block font-medium">الملعب المختَار</span>
          <span className="text-xs font-black text-white block mt-0.5 truncate">{selectedPitch.name}</span>
        </div>
        <div className="bg-slate-950/40 p-3 rounded-2xl border border-white/5">
          <span className="text-[10px] text-slate-400 block font-medium">اليوم والـتـاريخ</span>
          <span className="text-xs font-black text-emerald-400 block mt-0.5">{selectedDate}</span>
        </div>
        <div className="bg-slate-950/40 p-3 rounded-2xl border border-white/5">
          <span className="text-[10px] text-slate-400 block font-medium">مـوعد اللعب</span>
          <span className="text-xs font-black text-white block mt-0.5">{selectedTime}</span>
        </div>
        <div className="bg-slate-950/40 p-3 rounded-2xl border border-white/5">
          <span className="text-[10px] text-slate-400 block font-medium">مدة الحجوزات</span>
          <span className="text-xs font-black text-white block mt-0.5">
            {duration === 1.5 ? 'ساعة ونصف' : duration === 2 ? 'ساعتين كاملتين' : 'ساعة واحدة'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">اسم الكابتن لحجز الساعة</label>
            <input
              type="text"
              required
              value={currentUsername}
              onChange={(e) => onChangeUsername(e.target.value)}
              placeholder="اكتب اسمك الثلاثي"
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 font-bold focus:border-emerald-500/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">رقم موبايل الكابتن (للمتابعة)</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="أدخل رقمك للتواصل"
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Promo Code Voucher section */}
        <div className="bg-slate-950/30 p-4 rounded-2xl border border-slate-850">
          <label className="text-[11px] text-slate-300 block mb-1.5 flex items-center gap-1">
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            هل تمتلك كود خصم للشباب؟
            <span className="text-[9px] text-emerald-400 mr-auto font-black font-sans bg-emerald-500/10 px-1.5 py-0.5 rounded">جرب ZAWBA50 أو YOUTH20</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="كود الخصم (مثال: YOUTH20)"
              className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-slate-550 focus:outline-none focus:border-emerald-500/30"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black px-4 py-2 rounded-xl border border-slate-700 transition"
            >
              تـطـبـيـق
            </button>
          </div>
          {promoMessage && (
            <p className={`text-[10px] mt-2 font-bold ${discountPercent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {promoMessage}
            </p>
          )}
        </div>

        {/* Interactive Match Challenger toggle option */}
        <div className="bg-slate-950/30 p-4 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs font-black text-orange-400 block flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              افتح باب الانضمام للشباب (انشر الماتش عمومي)
            </span>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              تفعيل هذا الخيار سيقوم بإضافة ماتشك على بوردة التحديات ليتمكن اللاعبون الآخرون من الانضمام معك لملء الملعب المختار والبدء في ثوان!
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsMatchSearch(!isMatchSearch)}
            className={`cursor-pointer w-12 h-6 flex items-center rounded-full p-1 transition-all ${
              isMatchSearch ? 'bg-orange-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <motion.div
              layout
              className="w-4 h-4 rounded-full bg-white shadow-md"
            />
          </button>
        </div>

        {/* Total Pricing panel */}
        <div className="pt-4 border-t border-slate-850/80 flex items-center justify-between">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium">المبلغ الإجمالي المستحق</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              {discountPercent > 0 && (
                <span className="text-xs text-rose-500 line-through font-sans">{basePrice} ج.م</span>
              )}
              <span className="text-2xl font-black text-emerald-400 font-sans">{finalPrice}</span>
              <span className="text-xs font-bold text-slate-300">جنيه مصرى (دفع كاش بالملعب)</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitPending}
            className={`cursor-pointer relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-3.5 rounded-2xl text-xs font-black shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 ${
              isSubmitPending ? 'opacity-85 pointer-events-none' : ''
            }`}
          >
            {isSubmitPending ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                يرسل الطلب للملعب...
              </>
            ) : (
              <>
                تـأكيد حجز الملعب خماسي
                <Check className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Safety check label */}
      <p className="text-[10px] text-slate-500 text-center mt-4 flex justify-center items-center gap-1 font-medium">
        <Shield className="w-3.5 h-3.5" />
        حجز آمن 100%. الدفع يتم في الملعب مباشرةً قبل بدء المباراة.
      </p>
    </div>
  );
}
