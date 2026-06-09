import React, { useState } from 'react';
import { Flame, Star, Trophy, Users, Plus, Phone, Calendar, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MatchChallenge, SkillLevel } from '../types';

interface ChallengesBoardProps {
  challenges: MatchChallenge[];
  onAddChallenge: (newChallenge: Omit<MatchChallenge, 'id' | 'joinedUsers'>) => void;
  onJoinChallenge: (id: string, participantName: string) => void;
  currentUsername: string;
}

export default function ChallengesBoard({
  challenges,
  onAddChallenge,
  onJoinChallenge,
  currentUsername
}: ChallengesBoardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  // Form states
  const [title, setTitle] = useState('');
  const [pitchName, setPitchName] = useState('ملعب السوبر التركي (الخارجي)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('20:00');
  const [creatorName, setCreatorName] = useState(currentUsername || '');
  const [creatorPhone, setCreatorPhone] = useState('010');
  const [requiredPlayers, setRequiredPlayers] = useState(10);
  const [level, setLevel] = useState<SkillLevel>(SkillLevel.INTERMEDIATE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !creatorName || !creatorPhone) return;

    onAddChallenge({
      title,
      pitchName,
      date,
      time,
      creatorName,
      creatorPhone,
      currentPlayers: 1, // Start with the creator as player 1
      requiredPlayers,
      level
    });

    // Reset Form
    setTitle('');
    setCreatorPhone('010');
    setShowAddForm(false);
  };

  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.pitchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterLevel === 'ALL') return matchesSearch;
    return matchesSearch && c.level === filterLevel;
  });

  return (
    <div className="space-y-6" id="challenges-board-container">
      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h4 className="text-xl font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            تحدي الفرق الخماسية
          </h4>
          <p className="text-xs text-slate-400 mt-1">هل ينقص فريقك لاعبين؟ أو تبحث عن تحدٍ قوي اليوم؟ انضم الآن!</p>
        </div>

        {/* Add Challenge CTA */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="cursor-pointer bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-black shadow-[0_4px_12px_rgba(234,88,12,0.3)] transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          أنشئ تحدي جديد
        </button>
      </div>

      {/* Embedded Form with slide-down animation */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-slate-900/60 border border-orange-500/20 rounded-3xl p-6 space-y-4 backdrop-blur-md"
            >
              <h5 className="text-sm font-black text-orange-400">كابتن الفريق، عبّئ تفاصيل التحدي:</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">عنوان التحدي (مثال: نحتاج حارس ولاعب اليوم)</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ماتش خماسي سريع - حريفة فقط"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">اختر الملعب المتاح</label>
                  <select
                    value={pitchName}
                    onChange={(e) => setPitchName(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:border-orange-500/50 focus:outline-none"
                  >
                    <option value="ملعب السوبر التركي (الخارجي)">ملعب السوبر التركي</option>
                    <option value="صالة الكابيتانو المغطاة (VIP)">صالة الكابيتانو (VIP)</option>
                    <option value="أرينا الأضواء الذهبية المضيئة">أرينا الأضواء الذهبية</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">تاريخ ووقت اللعب</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500/50 focus:outline-none"
                    />
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">مستوى لعب اللاعبين المطلوبة</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as SkillLevel)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:border-orange-500/50 focus:outline-none"
                  >
                    <option value={SkillLevel.BEGINNER}>{SkillLevel.BEGINNER}</option>
                    <option value={SkillLevel.INTERMEDIATE}>{SkillLevel.INTERMEDIATE}</option>
                    <option value={SkillLevel.PRO}>{SkillLevel.PRO}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">اسمك كمنظم للتحدي</label>
                  <input
                    type="text"
                    required
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="اسم الكابتن"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:border-orange-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">رقم الواتساب للتواصل وتنسيق المباراة</label>
                  <input
                    type="tel"
                    required
                    value={creatorPhone}
                    onChange={(e) => setCreatorPhone(e.target.value)}
                    placeholder="رقم الموبايل"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:border-orange-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">العدد الإجمالي المطلوب للمباراة</label>
                  <input
                    type="number"
                    min={6}
                    max={14}
                    value={requiredPlayers}
                    onChange={(e) => setRequiredPlayers(parseInt(e.target.value))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:border-orange-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="cursor-pointer bg-orange-600 hover:bg-orange-500 text-white text-xs font-black px-5 py-2 rounded-xl"
                >
                  انشر التحدي الآن
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث بالنص عن تحديات، ملاعب أو لاعبين..."
            className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500/40 text-right"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-auto right-4 top-3.5" />
        </div>

        <div className="flex gap-2">
          {['ALL', SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE, SkillLevel.PRO].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterLevel === lvl
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-transparent text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {lvl === 'ALL' ? 'الكل' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="challenges-grid">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge, idx) => {
            const isFull = challenge.currentPlayers >= challenge.requiredPlayers;
            const hasJoined = challenge.joinedUsers.includes(currentUsername);

            return (
              <motion.div
                key={challenge.id}
                id={`challenge-card-${challenge.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-orange-500/20 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1 overflow-hidden">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        challenge.level === SkillLevel.PRO
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/10'
                          : challenge.level === SkillLevel.INTERMEDIATE
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/10'
                            : 'bg-slate-800 text-slate-300'
                      }`}>
                        {challenge.level}
                      </span>
                    </span>

                    <span className="text-[11px] text-slate-400 font-sans block">{challenge.time} • {challenge.date}</span>
                  </div>

                  <h5 className="text-sm font-black text-white group-hover:text-orange-400 duration-150 leading-relaxed">
                    {challenge.title}
                  </h5>

                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-yellow-500/80" />
                    الموقع: {challenge.pitchName}
                  </p>
                </div>

                {/* Team Info / Players joined */}
                <div className="bg-slate-950/40 rounded-2xl p-3 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">اللاعبين في المجموع</span>
                    <span className="text-white flex items-center gap-1 font-sans">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      {challenge.currentPlayers} / {challenge.requiredPlayers} لاعب
                    </span>
                  </div>

                  {/* Joined names list */}
                  {challenge.joinedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-900/50">
                      <span className="text-[10px] text-slate-400 w-full mb-1">المنضمين معنا:</span>
                      {challenge.joinedUsers.map((user, i) => (
                        <span key={i} className="text-[10px] bg-slate-950/90 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md">
                          {user}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400/90 font-medium pt-1.5 border-t border-slate-900/50">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      المنظم: {challenge.creatorName}
                    </span>
                    <a href={`https://wa.me/${challenge.creatorPhone}`} className="text-orange-400 flex items-center gap-1 inline-flex hover:underline">
                      <Phone className="w-3 h-3" />
                      تواصل
                    </a>
                  </div>
                </div>

                {/* Join challenge button */}
                <div className="pt-2">
                  {isFull ? (
                    <span className="w-full block text-center text-xs text-slate-500 bg-slate-950/80 py-2.5 rounded-2xl font-bold">
                      اكتمل عدد الفريق كامل ✓
                    </span>
                  ) : hasJoined ? (
                    <span className="w-full block text-center text-xs text-emerald-400 bg-emerald-950/10 border border-emerald-500/10 py-2.5 rounded-2xl font-bold">
                      مسجّل في الماتش كلاعب ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => onJoinChallenge(challenge.id, currentUsername)}
                      className="cursor-pointer w-full bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white py-2.5 rounded-2xl text-xs font-black border border-slate-700/50 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      سجّل كلاعب معنا
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/10 rounded-3xl border border-dashed border-slate-850">
            لا توجد تحديات نشطة توافق هذا البحث حالياً. كن أول من ينشر تحدي!
          </div>
        )}
      </div>
    </div>
  );
}
