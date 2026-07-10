/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Shield, Zap, Trophy, ClipboardCheck, Clock, 
  Flame, Lock, HelpCircle, CheckCircle, Sparkles, BookOpen, AlertTriangle
} from 'lucide-react';
import { Language } from '../types';

interface BadgeDefinition {
  name: string; // The literal name that aligns with the leaderboard array
  icon: React.ComponentType<any>;
  category: 'Safety' | 'BIM-IDD' | 'QAQC' | 'Operation' | 'System' | 'Special';
  color: string; // Tailwind color theme for border, text, and bg
  shadowColor: string; // For glow effect
  requirements: Record<Language, string>;
  title: Record<Language, string>;
}

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    name: '⚡ Safety Champ',
    icon: Zap,
    category: 'Safety',
    color: 'from-amber-400 to-yellow-500 text-amber-300 border-amber-500/30 bg-amber-500/5',
    shadowColor: 'shadow-amber-500/20',
    title: {
      [Language.EN]: 'Safety Champion',
      [Language.ZH]: '安全卫士',
      [Language.MS]: 'Juara Keselamatan',
      [Language.TA]: 'பாதுகாப்பு சாம்பியன்'
    },
    requirements: {
      [Language.EN]: 'Complete "Work At Height Safety (WAH)" quiz with a perfect 100% score.',
      [Language.ZH]: '以100%的满分完成“高处作业安全 (WAH)”测验。',
      [Language.MS]: 'Selesaikan kuiz "Keselamatan Bekerja di Tempat Tinggi (WAH)" dengan skor sempurna 100%.',
      [Language.TA]: '"உயரத்தில் வேலை செய்யும் பாதுகாப்பு (WAH)" வினாடி வினாவை 100% சரியான மதிப்பெண்ணுடன் முடிக்கவும்.'
    }
  },
  {
    name: '🏆 Perfectionist',
    icon: Trophy,
    category: 'Special',
    color: 'from-yellow-400 to-orange-500 text-yellow-300 border-yellow-500/30 bg-yellow-500/5',
    shadowColor: 'shadow-yellow-500/20',
    title: {
      [Language.EN]: 'Perfectionist',
      [Language.ZH]: '完美主义者',
      [Language.MS]: 'Perfeksionis',
      [Language.TA]: 'பூரணத்துவவாதி'
    },
    requirements: {
      [Language.EN]: 'Achieve 100% correct answers on all assigned safety modules.',
      [Language.ZH]: '在所有指派的安全培训模块中获得100%满分。',
      [Language.MS]: 'Capai 100% jawapan betul untuk semua modul keselamatan yang ditugaskan.',
      [Language.TA]: 'ஒதுக்கப்பட்ட அனைத்து பாதுகாப்பு தொகுப்புகளிலும் 100% சரியான பதில்களைப் பெறுங்கள்.'
    }
  },
  {
    name: '💡 Mentor',
    icon: BookOpen,
    category: 'System',
    color: 'from-emerald-400 to-teal-500 text-emerald-300 border-emerald-500/30 bg-emerald-500/5',
    shadowColor: 'shadow-emerald-500/20',
    title: {
      [Language.EN]: 'Safety Mentor',
      [Language.ZH]: '安全导师',
      [Language.MS]: 'Mentor Keselamatan',
      [Language.TA]: 'பாதுகாப்பு வழிகாட்டி'
    },
    requirements: {
      [Language.EN]: 'Actively contribute 5 or more study notes in the collaborative notepad.',
      [Language.ZH]: '在协作笔记本中积极贡献5条或更多学习笔记。',
      [Language.MS]: 'Sumbang secara aktif 5 atau lebih nota pembelajaran dalam pad nota kolaboratif.',
      [Language.TA]: 'கூட்டு நோட்பேடில் 5 அல்லது அதற்கு மேற்பட்ட ஆய்வுக் குறிப்புகளை தீவிரமாக வழங்கவும்.'
    }
  },
  {
    name: '🏗️ Prefab Master',
    icon: Award,
    category: 'BIM-IDD',
    color: 'from-purple-400 to-indigo-500 text-purple-300 border-purple-500/30 bg-purple-500/5',
    shadowColor: 'shadow-purple-500/20',
    title: {
      [Language.EN]: 'Prefab Master',
      [Language.ZH]: '预制装配大师',
      [Language.MS]: 'Pakar Prefab',
      [Language.TA]: 'முன்பே தயாரிக்கப்பட்ட மாஸ்டர்'
    },
    requirements: {
      [Language.EN]: 'Pass the "Precast Concrete Installation Guide" (PPVC) quiz on your first attempt.',
      [Language.ZH]: '在第一次尝试中通过“预制混凝土安装指南”(PPVC) 测验。',
      [Language.MS]: 'Lulus kuiz "Panduan Pemasangan Konkrit Pasang Siap" (PPVC) pada cubaan pertama anda.',
      [Language.TA]: '"முன்பே தயாரிக்கப்பட்ட கான்கிரீட் நிறுவல் வழிகாட்டி" (PPVC) வினாடி வினாவை முதல் முயற்சியிலேயே தேர்ச்சி பெறுங்கள்.'
    }
  },
  {
    name: '📊 QA Guru',
    icon: ClipboardCheck,
    category: 'QAQC',
    color: 'from-cyan-400 to-blue-500 text-cyan-300 border-cyan-500/30 bg-cyan-500/5',
    shadowColor: 'shadow-cyan-500/20',
    title: {
      [Language.EN]: 'QA Guru',
      [Language.ZH]: '质检专家',
      [Language.MS]: 'Guru QA',
      [Language.TA]: 'தரக் கட்டுப்பாட்டு குரு'
    },
    requirements: {
      [Language.EN]: 'Pass the "CONQUAS Quality Standards: Wet Trades" module with a score of 90% or higher.',
      [Language.ZH]: '以90%或以上的优异成绩通过“CONQUAS质量标准：湿作业”模块。',
      [Language.MS]: 'Lulus modul "Standard Kualiti CONQUAS: Kerja Basah" dengan skor 90% atau ke atas.',
      [Language.TA]: '"CONQUAS தரக் குறியீடுகள்: ஈரமான வர்த்தகங்கள்" தொகுப்பில் 90% அல்லது அதற்கு மேல் மதிப்பெண் பெற்று தேர்ச்சி பெறுங்கள்.'
    }
  },
  {
    name: '🏗️ Safe Lift',
    icon: Shield,
    category: 'Operation',
    color: 'from-blue-400 to-sky-500 text-blue-300 border-blue-500/30 bg-blue-500/5',
    shadowColor: 'shadow-blue-500/20',
    title: {
      [Language.EN]: 'Safe Lift Certified',
      [Language.ZH]: '安全起重认证',
      [Language.MS]: 'Persijilan Angkat Selamat',
      [Language.TA]: 'பாதுகாப்பான தூக்குதல் சான்றளிக்கப்பட்டது'
    },
    requirements: {
      [Language.EN]: 'Master crane signaling and hoisting communications with a 100% score on "Tower Crane Operation".',
      [Language.ZH]: '在“塔式起重机操作”测验中获得100%满分，熟练掌握起重机信号与吊装沟通。',
      [Language.MS]: 'Kuasai isyarat kren dan komunikasi pengangkatan dengan skor 100% dalam "Operasi Kren Menara".',
      [Language.TA]: '"கோபுர கிரேன் செயல்பாடு" இல் 100% மதிப்பெண்களுடன் கிரேன் சிக்னல் மற்றும் தூக்கும் தகவல்தொடர்புகளை மாஸ்டர் செய்யுங்கள்.'
    }
  },
  {
    name: '⏱️ Punctual',
    icon: Clock,
    category: 'System',
    color: 'from-rose-400 to-pink-500 text-rose-300 border-rose-500/30 bg-rose-500/5',
    shadowColor: 'shadow-rose-500/20',
    title: {
      [Language.EN]: 'Compliance Punctual',
      [Language.ZH]: '按时合规先锋',
      [Language.MS]: 'Patuhi Masa',
      [Language.TA]: 'காலந்தவறாத இணக்கம்'
    },
    requirements: {
      [Language.EN]: 'Complete all safety training courses at least 24 hours before the assigned deadline.',
      [Language.ZH]: '在指定截止日期前至少24小时完成所有安全培训课程。',
      [Language.MS]: 'Selesaikan semua kursus latihan keselamatan sekurang-kurangnya 24 jam sebelum tarikh akhir.',
      [Language.TA]: 'ஒதுக்கப்பட்ட காலக்கெடுவுக்கு குறைந்தது 24 மணிநேரத்திற்கு முன்பே அனைத்து பாதுகாப்பு பயிற்சி வகுப்புகளையும் முடிக்கவும்.'
    }
  },
  {
    name: '🔥 Fast Learner',
    icon: Flame,
    category: 'Special',
    color: 'from-orange-400 to-red-500 text-orange-300 border-orange-500/30 bg-orange-500/5',
    shadowColor: 'shadow-orange-500/20',
    title: {
      [Language.EN]: 'Fast Learner',
      [Language.ZH]: '极速学习者',
      [Language.MS]: 'Pelajar Cepat',
      [Language.TA]: 'விரைவாகக் கற்பவர்'
    },
    requirements: {
      [Language.EN]: 'Review and pass 3 custom training modules within your first 2 days.',
      [Language.ZH]: '在前2天内完成并通过3个定制培训模块。',
      [Language.MS]: 'Semak dan lulus 3 modul latihan tersuai dalam tempoh 2 hari pertama anda.',
      [Language.TA]: 'உங்கள் முதல் 2 நாட்களுக்குள் 3 தனிப்பயன் பயிற்சி தொகுப்புகளை மதிப்பாய்வு செய்து தேர்ச்சி பெறுங்கள்.'
    }
  },
  {
    name: '📋 Inspector',
    icon: ClipboardCheck,
    category: 'Safety',
    color: 'from-lime-400 to-emerald-500 text-lime-300 border-lime-500/30 bg-lime-500/5',
    shadowColor: 'shadow-lime-500/20',
    title: {
      [Language.EN]: 'Trench Inspector',
      [Language.ZH]: '基坑安全巡检员',
      [Language.MS]: 'Pemeriksa Parit',
      [Language.TA]: 'அகழ்வாராய்ச்சி ஆய்வாளர்'
    },
    requirements: {
      [Language.EN]: 'Complete "Excavation and Shoring Safety Measures" module with a perfect pass rate.',
      [Language.ZH]: '以完美的通过率完成“土方开挖与支护安全措施”模块。',
      [Language.MS]: 'Lulus modul "Tindakan Keselamatan Penggalian dan Penyokong" dengan kadar kelulusan sempurna.',
      [Language.TA]: '"அகழ்வாராய்ச்சி மற்றும் முட்டுக்கட்டை பாதுகாப்பு நடவடிக்கைகள்" தொகுப்பை முழுமையான தேர்ச்சி விகிதத்துடன் முடிக்கவும்.'
    }
  },
  {
    name: '🛡️ Safe Start',
    icon: Shield,
    category: 'System',
    color: 'from-teal-400 to-green-500 text-teal-300 border-teal-500/30 bg-teal-500/5',
    shadowColor: 'shadow-teal-500/20',
    title: {
      [Language.EN]: 'Safe Induction Start',
      [Language.ZH]: '安全引导启航',
      [Language.MS]: 'Permulaan Selamat',
      [Language.TA]: 'பாதுகாப்பான தொடக்கம்'
    },
    requirements: {
      [Language.EN]: 'Pass your very first safety quiz to start your on-site compliance record.',
      [Language.ZH]: '通过您的首个安全测验，开启您的施工现场合规记录。',
      [Language.MS]: 'Lulus kuiz keselamatan pertama anda untuk memulakan rekod pematuhan di tapak.',
      [Language.TA]: 'உங்கள் ஆன்-சைட் இணக்கப் பதிவைத் தொடங்க உங்கள் முதல் பாதுகாப்பு வினாடி வினாவில் தேர்ச்சி பெறுங்கள்.'
    }
  }
];

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  [Language.EN]: {
    title: "Professional Site Certifications & Badges",
    subtitle: "Earn high-level credentials to level up site safety status. Hover over any lencana to reveal requirements.",
    earned: "Earned",
    locked: "In Progress",
    xpReward: "XP Reward",
    requirementsHeader: "Certification Requirements",
    categoryLabel: "Sector",
    progress: "My Badges Progress",
    allEarned: "Perfect compliance record achieved!",
    someEarned: "Keep learning and taking quizzes to unlock remaining credentials."
  },
  [Language.ZH]: {
    title: "专业施工现场证书与微徽章",
    subtitle: "获得高级资质，提升现场安全等级。悬停或点击任意徽章可查看解锁条件。",
    earned: "已获得",
    locked: "进行中",
    xpReward: "XP 奖励",
    requirementsHeader: "证书解锁要求",
    categoryLabel: "专业领域",
    progress: "徽章解锁进度",
    allEarned: "已达成完美的现场安全合规记录！",
    someEarned: "继续学习并完成测验，以解锁其余的安全资质。"
  },
  [Language.MS]: {
    title: "Pensijilan Tapak Profesional & Lencana",
    subtitle: "Peroleh kelayakan peringkat tinggi untuk meningkatkan status keselamatan tapak. Layangkan tetikus untuk syarat lencana.",
    earned: "Diperoleh",
    locked: "Sedang Berjalan",
    xpReward: "Ganjaran XP",
    requirementsHeader: "Keperluan Pensijilan",
    categoryLabel: "Sektor",
    progress: "Kemajuan Lencana Saya",
    allEarned: "Rekod pematuhan sempurna telah dicapai!",
    someEarned: "Teruskan belajar dan ambil kuiz untuk membuka kunci kelayakan selebihnya."
  },
  [Language.TA]: {
    title: "தொழில்முறை தள சான்றிதழ்கள் & பேட்ஜ்கள்",
    subtitle: "தள பாதுகாப்பு நிலையை உயர்த்த உயர்மட்ட நற்சான்றிதழ்களைப் பெறுங்கள். தேவைகளை வெளிப்படுத்த பேட்ஜ் மீது கர்சரை நகர்த்தவும்.",
    earned: "பெறப்பட்டது",
    locked: "செயல்பாட்டில் உள்ளது",
    xpReward: "எக்ஸ்பி வெகுமதி",
    requirementsHeader: "சான்றிதழ் தேவைகள்",
    categoryLabel: "துறை",
    progress: "எனது பேட்ஜ்களின் முன்னேற்றம்",
    allEarned: "முழுமையான இணக்கப் பதிவு எட்டப்பட்டது!",
    someEarned: "மீதமுள்ள நற்சான்றிதழ்களைத் திறக்க தொடர்ந்து கற்றுக்கொண்டு வினாடி வினாக்களை எழுதுங்கள்."
  }
};

interface EarnedBadgesProps {
  userBadges: string[];
  currentLanguage: Language;
}

export const EarnedBadges: React.FC<EarnedBadgesProps> = ({ userBadges, currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS[Language.EN];
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  // Helper to normalize strings for exact matching (ignores casing and leading/trailing emojis)
  const isBadgeEarned = (badgeName: string) => {
    // Strip emojis and whitespace from both user badges and badge definitions to ensure match stability
    const cleanStr = (s: string) => s.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim().toLowerCase();
    
    return userBadges.some(userB => cleanStr(userB) === cleanStr(badgeName));
  };

  const earnedCount = BADGE_DEFINITIONS.filter(b => isBadgeEarned(b.name)).length;
  const progressPercent = Math.round((earnedCount / BADGE_DEFINITIONS.length) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl space-y-5 relative overflow-hidden" id="earned-badges-panel">
      {/* Decorative top ambient light */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />
      
      {/* Header section with icons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider font-sans">
              {t.title}
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-sans">
            {t.subtitle}
          </p>
        </div>
        
        {/* Compact stats display */}
        <div className="bg-slate-950 border border-slate-850 px-3.5 py-1.5 rounded-lg font-mono text-center flex sm:flex-col items-center justify-between sm:justify-center gap-2 sm:gap-0 shrink-0">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{t.progress}</span>
          <span className="text-sm font-extrabold text-cyan-400">
            {earnedCount} / {BADGE_DEFINITIONS.length} <span className="text-xs text-slate-500">({progressPercent}%)</span>
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850 p-0.5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.3)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>{earnedCount === BADGE_DEFINITIONS.length ? t.allEarned : t.someEarned}</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-500" />
            WSH Credentials
          </span>
        </div>
      </div>

      {/* Badges Grid with custom tooltips */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
        {BADGE_DEFINITIONS.map((badge, idx) => {
          const earned = isBadgeEarned(badge.name);
          const IconComponent = badge.icon;
          const isHovered = hoveredBadge === badge.name;

          return (
            <div 
              key={badge.name} 
              className="relative"
              onMouseEnter={() => setHoveredBadge(badge.name)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center relative h-[105px] transition-all cursor-pointer select-none ${
                  earned 
                    ? `bg-gradient-to-b ${badge.color} border-slate-800 shadow-md ${badge.shadowColor}`
                    : 'bg-slate-950/40 border-slate-900 text-slate-600'
                }`}
                id={`badge-card-${idx}`}
              >
                {/* Micro badge status indicator top right */}
                <div className="absolute top-1.5 right-1.5">
                  {earned ? (
                    <div className="w-3.5 h-3.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <Lock className="w-3 h-3 text-slate-700" />
                  )}
                </div>

                {/* Badge Icon */}
                <div className={`p-2 rounded-xl mb-1.5 shrink-0 ${
                  earned 
                    ? 'bg-slate-950/60 border border-slate-800 text-cyan-400' 
                    : 'bg-slate-950/20 border border-slate-950/40 text-slate-700'
                }`}>
                  <IconComponent className={`w-5 h-5 ${earned ? 'animate-pulse' : ''}`} />
                </div>

                {/* Badge Name */}
                <span className={`text-[10px] font-black tracking-tight font-sans text-ellipsis overflow-hidden w-full whitespace-nowrap mt-1 ${
                  earned ? 'text-slate-200' : 'text-slate-550'
                }`}>
                  {badge.title[currentLanguage] || badge.title[Language.EN]}
                </span>

                {/* Small category tag */}
                <span className="text-[8px] font-bold font-mono tracking-wider text-slate-500 mt-0.5 uppercase">
                  {badge.category}
                </span>
              </motion.div>

              {/* Precise interactive tooltip explaining requirements */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 bottom-[115px] left-1/2 -translate-x-1/2 w-[240px] bg-slate-950 border border-slate-850 p-3.5 rounded-xl shadow-2xl space-y-2 pointer-events-none"
                    id={`badge-tooltip-${idx}`}
                  >
                    <div className="flex items-center gap-1.5 border-b border-slate-850 pb-1.5">
                      <IconComponent className={`w-4 h-4 ${earned ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-extrabold text-slate-100 font-sans">
                        {badge.title[currentLanguage] || badge.title[Language.EN]}
                      </span>
                      <span className={`ml-auto text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        earned ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-900 text-slate-500 border border-slate-850'
                      }`}>
                        {earned ? t.earned : t.locked}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">{t.requirementsHeader}</p>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
                        {badge.requirements[currentLanguage] || badge.requirements[Language.EN]}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-mono border-t border-slate-850/60 pt-1.5 mt-1 text-slate-500">
                      <span>{t.categoryLabel}: <strong className="text-slate-400 font-sans">{badge.category}</strong></span>
                      <span>{t.xpReward}: <strong className="text-cyan-400">+100 XP</strong></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
