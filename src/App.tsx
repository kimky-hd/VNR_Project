import React, { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  Moon,
  Eye,
  EyeOff,
  Compass,
  Play,
  Pause,
  GraduationCap,
  Landmark,
  Check,
} from 'lucide-react';
import { TOUR_SPOTS, TourSpot } from './data/tourData';
import Scene3D from './components/Scene3D';
import SidebarInfo from './components/SidebarInfo';
import QuizModal from './components/QuizModal';

export const App: React.FC = () => {
  const [activeSpot, setActiveSpot] = useState<TourSpot | null>(null);
  const [visitedIds, setVisitedIds] = useState<number[]>([]);
  const [isNight, setIsNight] = useState<boolean>(false);
  const [showRoof, setShowRoof] = useState<boolean>(true);
  const [isAutoTour, setIsAutoTour] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [resetTrigger, setResetTrigger] = useState<number>(0);

  const handleSelectSpot = useCallback((spot: TourSpot) => {
    setActiveSpot(spot);
    setVisitedIds((prev) => (prev.includes(spot.id) ? prev : [...prev, spot.id]));

    if (spot.requiresXRayRoof) {
      setShowRoof(false);
    } else {
      setShowRoof(true);
    }
  }, []);

  const handleOverview = useCallback(() => {
    setIsAutoTour(false);
    setActiveSpot(null);
    setShowRoof(true);
    setResetTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!isAutoTour) return;

    if (!activeSpot) {
      handleSelectSpot(TOUR_SPOTS[0]);
    }

    const timer = window.setInterval(() => {
      setActiveSpot((current) => {
        const currentIdx = current
          ? TOUR_SPOTS.findIndex((s) => s.id === current.id)
          : -1;
        const nextIdx = (currentIdx + 1) % TOUR_SPOTS.length;
        const nextSpot = TOUR_SPOTS[nextIdx];

        setVisitedIds((prev) =>
          prev.includes(nextSpot.id) ? prev : [...prev, nextSpot.id]
        );
        setShowRoof(!nextSpot.requiresXRayRoof);
        return nextSpot;
      });
    }, 9000);

    return () => window.clearInterval(timer);
  }, [isAutoTour, activeSpot, handleSelectSpot]);

  const progressPercent = Math.round((visitedIds.length / TOUR_SPOTS.length) * 100);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05070c] text-stone-100 select-none">
      {/* ================= KHÔNG GIAN 3D ĐIỆN ẢNH ================= */}
      <Scene3D
        activeSpot={activeSpot}
        visitedIds={visitedIds}
        onSelectSpot={(spot) => {
          setIsAutoTour(false);
          handleSelectSpot(spot);
        }}
        isNight={isNight}
        showRoof={showRoof}
        resetTrigger={resetTrigger}
      />

      {/* ================= TOP HEADER (LIQUID GLASS HUD) ================= */}
      <header className="fixed top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-3xl liquid-glass shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/15">
        {/* Tên Dự Án & Biểu tượng Di sản */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            <Landmark className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-cinzel tracking-widest text-amber-300/80">
                KHÔNG GIAN DI SẢN 3D
              </span>
              {isAutoTour && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                  Tự động dẫn tour
                </span>
              )}
            </div>
            <h1 className="text-sm sm:text-base lg:text-lg font-bold font-cormorant tracking-wide text-gold-leaf leading-tight">
              Nhà Sàn Bác Hồ &amp; Tư Tưởng Hồ Chí Minh
            </h1>
          </div>
        </div>

        {/* Công cụ điều khiển */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Thanh Tiến độ khám phá thanh lịch */}
          <div className="hidden md:flex flex-col gap-1 px-4 py-1.5 rounded-2xl bg-white/[0.03] border border-white/10 min-w-[190px]">
            <div className="flex items-center justify-between text-[11px] font-light">
              <span className="text-stone-400">Đã khám phá</span>
              <span className="text-amber-200 font-cinzel font-semibold">
                {visitedIds.length}/{TOUR_SPOTS.length}
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Nút Bật/Tắt Mặt cắt Nội thất Tầng 2 */}
          <button
            type="button"
            onClick={() => setShowRoof((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-medium cursor-pointer transition-all ${
              !showRoof ? 'liquid-glass-active text-amber-200' : 'liquid-glass-pill text-stone-300'
            }`}
            title="Mở mái để nhìn nội thất phòng làm việc và phòng ngủ tầng 2"
          >
            {!showRoof ? (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span>Nội thất Tầng 2 (Mở)</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                <span>Xem nội thất Tầng 2</span>
              </>
            )}
          </button>

          {/* Nút Chế độ Ngày / Đêm */}
          <button
            type="button"
            onClick={() => setIsNight((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-medium cursor-pointer transition-all ${
              isNight ? 'liquid-glass-active text-amber-200' : 'liquid-glass-pill text-stone-300'
            }`}
            title="Chuyển đổi ánh sáng Ngày / Đêm"
          >
            {isNight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
                <span>Ban đêm</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>Ban ngày</span>
              </>
            )}
          </button>

          {/* Nút Mở Trắc nghiệm */}
          <button
            type="button"
            onClick={() => {
              setIsAutoTour(false);
              setIsQuizOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium liquid-glass-active text-amber-100 cursor-pointer shadow-lg"
          >
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>Trắc nghiệm tư tưởng</span>
          </button>
        </div>
      </header>

      {/* ================= DRAWER THÔNG TIN DI SẢN ================= */}
      <SidebarInfo
        spot={activeSpot}
        onClose={() => setActiveSpot(null)}
        onSelectSpot={(spot) => {
          setIsAutoTour(false);
          handleSelectSpot(spot);
        }}
        onOpenQuiz={() => {
          setIsAutoTour(false);
          setIsQuizOpen(true);
        }}
      />

      {/* ================= BOTTOM DOCK (LIQUID GLASS CAPSULE) ================= */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[95vw] flex items-center gap-2 px-3 py-2 rounded-3xl liquid-glass shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 overflow-x-auto">
        <button
          type="button"
          onClick={handleOverview}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeSpot === null && !isAutoTour
              ? 'liquid-glass-active text-amber-200'
              : 'liquid-glass-pill text-stone-300'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-amber-300" />
          <span>Toàn cảnh</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAutoTour((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
            isAutoTour
              ? 'liquid-glass-active text-emerald-200'
              : 'liquid-glass-pill text-stone-300'
          }`}
        >
          {isAutoTour ? (
            <>
              <Pause className="w-3 h-3 fill-current" />
              <span>Tạm dừng</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current text-amber-300" />
              <span>Tự động tour</span>
            </>
          )}
        </button>

        <div className="h-5 w-px bg-white/10 mx-1 shrink-0" />

        {/* 5 Nút chuyển nhanh theo từng điểm di sản */}
        {TOUR_SPOTS.map((spot) => {
          const isSelected = activeSpot?.id === spot.id;
          const isVisited = visitedIds.includes(spot.id);

          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => {
                setIsAutoTour(false);
                handleSelectSpot(spot);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'liquid-glass-active text-amber-100 font-semibold'
                  : isVisited
                  ? 'liquid-glass-pill text-emerald-300'
                  : 'liquid-glass-pill text-stone-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-cinzel font-bold ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950'
                    : isVisited
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/10 text-stone-300'
                }`}
              >
                {spot.id}
              </span>
              <span className="hidden sm:inline font-normal">{spot.shortLabel}</span>
              {isVisited && (
                <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ================= MODAL TRẮC NGHIỆM ================= */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        visitedCount={visitedIds.length}
        onJumpToSpot={(spot) => {
          setIsAutoTour(false);
          handleSelectSpot(spot);
        }}
      />
    </div>
  );
};

export default App;
