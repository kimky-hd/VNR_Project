import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  Square,
  Landmark,
  BookOpen,
  Quote,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  Award,
} from 'lucide-react';
import { TourSpot, TOUR_SPOTS } from '../data/tourData';

interface SidebarInfoProps {
  spot: TourSpot | null;
  onClose: () => void;
  onSelectSpot: (spot: TourSpot) => void;
  onOpenQuiz: () => void;
}

export const SidebarInfo: React.FC<SidebarInfoProps> = ({
  spot,
  onClose,
  onSelectSpot,
  onOpenQuiz,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedArtifactIdx, setSelectedArtifactIdx] = useState<number>(0);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    setSelectedArtifactIdx(0);
    stopSpeech();
    return () => {
      stopSpeech();
    };
  }, [spot, stopSpeech]);

  const handleToggleSpeech = () => {
    if (!spot) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ Web Speech API.');
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();

    const narrationText = `${spot.title}. Hiện vật tiêu biểu gồm: ${spot.artifacts.join(
      ', '
    )}. Câu chuyện lịch sử: ${spot.historicalStory} Liên hệ Tư tưởng Hồ Chí Minh: ${
      spot.hcmThoughtConnection
    } Trích dẫn tiêu biểu: ${spot.keyQuote.quote}`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('vi') ||
        v.name.toLowerCase().includes('viet') ||
        v.name.toLowerCase().includes('an') ||
        v.name.toLowerCase().includes('linh')
    );
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrevNext = (direction: 'prev' | 'next') => {
    if (!spot) return;
    const currentIndex = TOUR_SPOTS.findIndex((s) => s.id === spot.id);
    if (currentIndex === -1) return;
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % TOUR_SPOTS.length
        : (currentIndex - 1 + TOUR_SPOTS.length) % TOUR_SPOTS.length;
    onSelectSpot(TOUR_SPOTS[nextIndex]);
  };

  return (
    <AnimatePresence>
      {spot && (
        <motion.aside
          key="sidebar-drawer"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          className="fixed top-20 bottom-24 right-5 z-30 w-[calc(100vw-2.5rem)] sm:w-[450px] lg:w-[480px] flex flex-col rounded-3xl liquid-glass overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-white/15"
        >
          {/* Header Drawer */}
          <div className="relative px-6 pt-6 pb-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-cinzel font-bold text-amber-200 bg-amber-500/15 border border-amber-400/30">
                  DI SẢN #{spot.id}/5
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-stone-300 bg-white/5 border border-white/10">
                  <Layers className="w-3 h-3 text-amber-300/80" />
                  {spot.floor}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                title="Đóng bảng thông tin"
                className="p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="mt-3 text-xl sm:text-2xl font-bold font-cormorant leading-tight text-gold-leaf tracking-wide">
              {spot.title}
            </h2>
            <p className="mt-1 text-xs text-stone-300/80 font-normal">
              {spot.subtitle}
            </p>

            {/* Thuyết minh giọng đọc */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleToggleSpeech}
                className={`w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-rose-950/80 text-rose-200 border border-rose-500/40 shadow-lg'
                    : 'liquid-glass-pill hover:liquid-glass-active text-amber-100'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Dừng đọc thuyết minh</span>
                    <span className="flex items-end gap-0.5 h-3 ml-2">
                      <span className="w-0.5 h-full bg-rose-400 rounded-full animate-soundwave-1" />
                      <span className="w-0.5 h-full bg-rose-400 rounded-full animate-soundwave-2" />
                      <span className="w-0.5 h-full bg-rose-400 rounded-full animate-soundwave-3" />
                      <span className="w-0.5 h-full bg-rose-400 rounded-full animate-soundwave-4" />
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Nghe thuyết minh audio di sản</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Nội dung chi tiết */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* 1. HIỆN VẬT TIÊU BIỂU */}
            <section>
              <div className="flex items-center gap-2 text-[11px] font-cinzel font-semibold tracking-widest text-amber-300/90 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>HIỆN VẬT TIÊU BIỂU</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {spot.artifactDetails.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedArtifactIdx(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all border cursor-pointer ${
                      selectedArtifactIdx === idx
                        ? 'bg-amber-400/15 border-amber-400/50 text-amber-200 font-medium'
                        : 'bg-white/5 border-white/10 text-stone-300 hover:border-white/20'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {spot.artifactDetails[selectedArtifactIdx] && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-amber-100 text-sm font-cormorant">
                      {spot.artifactDetails[selectedArtifactIdx].name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300/90 text-[10px] font-medium border border-amber-500/20">
                      {spot.artifactDetails[selectedArtifactIdx].origin}
                    </span>
                  </div>
                  <p className="text-stone-300 leading-relaxed pt-1">
                    {spot.artifactDetails[selectedArtifactIdx].description}
                  </p>
                </div>
              )}
            </section>

            {/* 2. CÂU CHUYỆN LỊCH SỬ */}
            <section className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center gap-2 text-[11px] font-cinzel font-semibold tracking-widest text-amber-300/90 mb-2">
                <Landmark className="w-3.5 h-3.5" />
                <span>CÂU CHUYỆN LỊCH SỬ</span>
              </div>
              <p className="text-xs sm:text-[13px] text-stone-300 leading-relaxed font-light">
                {spot.historicalStory}
              </p>
            </section>

            {/* 3. TRÍCH DẪN NỔI BẬT */}
            <section className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-500/[0.08] via-transparent to-white/[0.02] border border-amber-400/25">
              <Quote className="w-8 h-8 text-amber-400/15 absolute top-3 right-4 pointer-events-none" />
              <div className="text-[10px] font-cinzel font-semibold tracking-widest text-amber-300/80 mb-2">
                TRÍCH DẪN TƯ TƯỞNG
              </div>
              <blockquote className="text-sm sm:text-base italic font-cormorant text-amber-100/95 leading-relaxed">
                {spot.keyQuote.quote}
              </blockquote>
              <div className="mt-2.5 text-xs text-amber-300/70 font-light">
                — {spot.keyQuote.context}
              </div>
            </section>

            {/* 4. LIÊN HỆ TƯ TƯỞNG HỒ CHÍ MINH */}
            <section className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-[11px] font-cinzel font-semibold tracking-widest text-emerald-300 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>LIÊN HỆ LÝ LUẬN TƯ TƯỞNG HỒ CHÍ MINH</span>
              </div>
              <p className="text-xs sm:text-[13px] text-stone-200 leading-relaxed font-light">
                {spot.hcmThoughtConnection}
              </p>

              <div className="mt-3.5 pt-3 border-t border-emerald-500/15">
                <div className="flex items-center gap-1.5 text-[10px] font-cinzel text-emerald-300/80 mb-2">
                  <Award className="w-3 h-3" />
                  <span>LUẬN ĐIỂM CỐT LÕI:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {spot.coreValues.map((val, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-[11px] font-light bg-emerald-500/10 text-emerald-200 border border-emerald-500/25"
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Footer Điều hướng */}
          <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePrevNext('prev')}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs liquid-glass-pill text-stone-300 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Trước</span>
              </button>
              <button
                type="button"
                onClick={() => handlePrevNext('next')}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs liquid-glass-pill text-stone-300 cursor-pointer"
              >
                <span>Sau</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenQuiz}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium liquid-glass-active text-amber-200 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>Ôn tập trắc nghiệm</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default SidebarInfo;
