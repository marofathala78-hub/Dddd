import { Clock, Check, Users, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { Booking } from '../types';
import { BOOKING_HOURS } from '../data';

interface BookingGridProps {
  selectedPitchId: string;
  selectedDate: string;
  selectedTime: string | null;
  onSelectTime: (time: string | null) => void;
  duration: number;
  onChangeDuration: (duration: number) => void;
  bookings: Booking[];
  onJoinMatchBooking: (bookingId: string) => void;
  currentUsername: string;
}

export default function BookingGrid({
  selectedPitchId,
  selectedDate,
  selectedTime,
  onSelectTime,
  duration,
  onChangeDuration,
  bookings,
  onJoinMatchBooking,
  currentUsername
}: BookingGridProps) {
  // Filter bookings for this pitch and date
  const activeBookings = bookings.filter(
    (b) => b.pitchId === selectedPitchId && b.date === selectedDate
  );

  // Helper to determine status of a given hour slot
  const getSlotStatus = (hour: string) => {
    // Check if there is an active booking on this hour
    const booking = activeBookings.find((b) => {
      // Simple parsing of hour
      const startH = parseInt(b.startTime.split(':')[0]);
      const currentH = parseInt(hour.split(':')[0]);
      
      // Handle overnight hours 00:00, 01:00, 02:00
      let normStart = startH < 12 ? startH + 24 : startH;
      let normCurrent = currentH < 12 ? currentH + 24 : currentH;
      
      const endH = normStart + b.duration;
      return normCurrent >= normStart && normCurrent < endH;
    });

    return booking;
  };

  return (
    <div className="space-y-6" id="booking-grid-section">
      {/* Duration and Date Info */}
      <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            تحديد مدة المباراة:
          </h5>
          <p className="text-xs text-slate-400 mt-1 block font-medium">اختر المدة المناسبة للفريق لترتيب الميزانية</p>
        </div>
        <div className="flex gap-2">
          {[1, 1.5, 2].map((dur) => (
            <button
              key={dur}
              onClick={() => onChangeDuration(dur)}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black transition-all ${
                duration === dur
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_2px_8px_rgba(16,185,129,0.25)]'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {dur === 1.5 ? 'ساعة ونص' : dur === 2 ? 'ساعتين' : 'ساعة واحدة'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid hours */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-base font-black text-white">تحديد موعد اللعب</h5>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700/80 block" />
              <span>متاح</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded bg-emerald-500 block animate-pulse" />
              <span>محدد</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded bg-red-950/40 border border-red-500/20 block" />
              <span>محجوز</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3" id="hours-grid">
          {BOOKING_HOURS.map((hour) => {
            const booking = getSlotStatus(hour);
            const isBooked = !!booking;
            const isSelected = selectedTime === hour;
            const hourDisplay = parseInt(hour.split(':')[0]);
            const formattedHour = 
              hourDisplay === 12 
                ? '12:00 ظهراً' 
                : hourDisplay === 0 
                  ? '12:00 منتصف الليل'
                  : hourDisplay < 12 
                    ? `${hourDisplay}:00 بعد منتصف الليل`
                    : `${hourDisplay - 12}:00 مساءً`;

            if (isBooked && booking) {
              const joinedCount = booking.joinedPlayers?.length || 0;
              const hasJoined = booking.joinedPlayers?.includes(currentUsername);

              return (
                <div
                  key={hour}
                  className="relative rounded-2xl bg-red-950/20 border border-red-500/20 p-4 flex flex-col justify-between min-h-[105px] overflow-hidden group select-none"
                >
                  <div className="flex items-center justify-between text-red-400 mb-1">
                    <span className="text-xs font-black">{formattedHour}</span>
                    <Lock className="w-3.5 h-3.5 text-red-500/60" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-red-200/90 leading-tight truncate">
                      {booking.customerName}
                    </p>
                    <p className="text-[10px] text-red-400/80 mt-1 font-medium">ساعة محجوزة</p>
                  </div>
                  
                  {/* Join challenge action IF the booked slot was set as public/match finder */}
                  {booking.isMatchSearch && (
                    <div className="absolute inset-0 bg-slate-950/95 flex flex-col justify-center items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-[10px] text-emerald-400 font-bold mb-1.5 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        تحدي خماسي مفتوح!
                      </p>
                      
                      {hasJoined ? (
                        <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-1 rounded font-bold">
                          تم الانضمام كلاعب ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => onJoinMatchBooking(booking.id)}
                          className="cursor-pointer bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded hover:bg-emerald-400 transition-all"
                        >
                          انضم كلاديب ({joinedCount} مسجلين)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <motion.button
                key={hour}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectTime(isSelected ? null : hour)}
                className={`cursor-pointer rounded-2xl p-4 flex flex-col justify-between items-start min-h-[105px] border text-right transition-all outline-none ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'border-slate-800 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/40 text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-black ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                    {formattedHour}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                </div>
                
                <div className="text-right">
                  <p className={`text-xs font-bold ${isSelected ? 'text-slate-900' : 'text-slate-100'}`}>
                    مـتـاح للحجز
                  </p>
                  <p className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-slate-800' : 'text-slate-400/95'}`}>
                    أفضل الأوقات
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
