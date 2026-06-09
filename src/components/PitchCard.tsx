import React from 'react';
import { Star, Check, Award, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Pitch } from '../types';

interface PitchCardProps {
  key?: string | number;
  pitch: Pitch;
  isSelected: boolean;
  onSelect: (pitch: Pitch) => void;
}

export default function PitchCard({ pitch, isSelected, onSelect }: PitchCardProps) {
  return (
    <motion.div
      id={`pitch-card-${pitch.id}`}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`relative flex flex-col overflow-hidden rounded-3xl border transition-all ${
        isSelected
          ? 'border-emerald-500 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-slate-900/60'
          : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
    >
      {/* Pitch Header Color Banner representing Turf type */}
      <div 
        className="h-32 w-full p-4 flex flex-col justify-between relative"
        style={{ background: pitch.image }}
      >
        {/* Pitch overlay overlay texture resembling soccer field patterns */}
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay opacity-40" />

        <div className="flex items-center justify-between z-10">
          <span className="flex items-center gap-1 rounded-full bg-slate-950/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/10">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            {pitch.maxPlayers} لاعبين كحد أقصى
          </span>
          <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-black text-slate-950">
            <Star className="w-3.5 h-3.5 fill-current" />
            {pitch.rating}
          </span>
        </div>

        <div className="z-10">
          <span className="rounded bg-emerald-500/95 px-2 py-0.5 text-[10px] font-black tracking-wide text-white uppercase shadow-sm">
            شاهد المعرض
          </span>
        </div>
      </div>

      {/* Pitch Description Body */}
      <div className="flex-1 p-6 flex flex-col justify-between space-y-4" id={`pitch-content-${pitch.id}`}>
        <div>
          <h4 className="text-xl font-black text-white" id={`pitch-title-${pitch.id}`}>{pitch.name}</h4>
          <p className="text-xs text-slate-400 mt-1 font-medium">{pitch.type}</p>
        </div>

        {/* Dynamic Feature Badges */}
        <div className="flex flex-wrap gap-1.5" id={`pitch-features-${pitch.id}`}>
          {pitch.features.map((feature, i) => (
            <span
              key={i}
              className="text-[11px] font-medium text-emerald-300 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Pricing & Selection Panel */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">سعر الساعة لحجز الملعب</span>
            <div className="flex items-baseline gap-1" id={`pitch-price-${pitch.id}`}>
              <span className="text-2xl font-black text-emerald-400 font-sans">{pitch.ratePerHour}</span>
              <span className="text-xs font-bold text-slate-300">جنيه مصرى / ساعة</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(pitch)}
            className={`cursor-pointer px-5 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-black transition-all ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
                : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white border border-slate-700/50'
            }`}
            id={`pitch-btn-${pitch.id}`}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                ملعب مـحـدد
              </>
            ) : (
              'اختر واحجز الآن'
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
