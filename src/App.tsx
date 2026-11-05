import React, { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  Moon,
  Layers,
  Compass,
  Play,
  Pause,
  BookOpenCheck,
  Check,
} from 'lucide-react';
import {
  TOUR_SPOTS,
  TourSpot,
  ArchitecturalViewMode,
} from './data/tourData';
import Scene3D from './components/Scene3D';
import SidebarInfo from './components/SidebarInfo';
import QuizModal from './components/QuizModal';

export const App: React.FC = () => {
  const [activeSpot, setActiveSpot] = useState<TourSpot | null>(null);
  const [visitedIds, setVisitedIds] = useState<number[]>([]);
  const [isNight, setIsNight] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ArchitecturalViewMode>('overview');
  const [isAutoTour, setIsAutoTour] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [resetTrigger, setResetTrigger] = useState<number>(0);

  const handleSelectSpot = useCallback((spot: TourSpot) => {
    setActiveSpot(spot);
    setVisitedIds((prev) =>
      prev.includes(spot.id) ? prev : [...prev, spot.id]
    );
    setViewMode(spot.recommendedViewMode);
  }, []);

  const handleSwitchViewMode = useCallback(
    (mode: ArchitecturalViewMode) => {
      setIsAutoTour(false);
      setViewMode(mode);
      if (mode === 'overview' && activeSpot?.recommendedViewMode === 'overview') {
        setActiveSpot(null);
      }
      setResetTrigger((prev) => prev + 1);
    },
    [activeSpot]
  );

  const handleOverview = useCallback(() => {
    setIsAutoTour(false);
    setActiveSpot(null);
    setViewMode('overview');
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
        setViewMode(nextSpot.recommendedViewMode);
        return nextSpot;
      });
    }, 9000);

    return () => window.clearInterval(timer);
  }, [isAutoTour, activeSpot, handleSelectSpot]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#161917] text-[#F5F2EB] select-none">
      {/* KHÔNG GIAN THAM QUAN 3D TRUNG TÂM */}
      <Scene3D
        activeSpot={activeSpot}
        visitedIds={visitedIds}
        onSelectSpot={(spot) => {
          setIsAutoTour(false);
          handleSelectSpot(spot);
        }}
        isNight={isNight}
        viewMode={viewMode}
        resetTrigger={resetTrigger}
      />

      {/* TOP HEADER – TỐI GIẢN, TRANG NHÃ */}
      <header className="fixed top-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl museum-panel">
        <div>
          <div className="text-[11px] font-medium text-[#C6A87C] uppercase tracking-wider">
            Khu Di Tích Chủ Tịch Hồ Chí Minh Tại Phủ Chủ Tịch
          </div>
          <h1 className="text-sm sm:text-base font-editorial font-semibold text-[#F5F2EB]">
            Không Gian Tham Quan Nhà Sàn Bác Hồ &amp; Tư Tưởng Hồ Chí Minh
          </h1>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Cụm chuyển đổi 3 chế độ kiến trúc: Tổng thể / Mặt cắt Tầng 1 / Mặt cắt Tầng 2 */}
          <div
            className="flex items-center gap-1 p-1 rounded-lg bg-black/25 border border-[#D6CBB8]/15"
            role="group"
            aria-label="Chế độ xem mặt cắt kiến trúc"
          >
            <span className="hidden md:flex items-center gap-1 px-2 text-[11px] text-[#C6A87C]">
              <Layers className="w-3.5 h-3.5" />
              <span>Góc nhìn:</span>
            </span>
            <button
              type="button"
              onClick={() => handleSwitchViewMode('overview')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'overview'
                  ? 'museum-button-active'
                  : 'text-[#D6CFC2] hover:text-white hover:bg-white/5'
              }`}
              title="Hiển thị đầy đủ mái ngói và toàn cảnh kiến trúc Nhà sàn"
            >
              Tổng thể
            </button>
            <button
              type="button"
              onClick={() => handleSwitchViewMode('floor1')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'floor1'
                  ? 'museum-button-active'
                  : 'text-[#D6CFC2] hover:text-white hover:bg-white/5'
              }`}
              title="Cắt lớp kiến trúc trên để quan sát rõ Phòng họp Bộ Chính trị tại Tầng 1"
            >
              Mặt cắt Tầng 1
            </button>
            <button
              type="button"
              onClick={() => handleSwitchViewMode('floor2')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'floor2'
                  ? 'museum-button-active'
                  : 'text-[#D6CFC2] hover:text-white hover:bg-white/5'
              }`}
              title="Mở mặt cắt mái ngói và hạ vách gỗ để quan sát rõ Phòng làm việc và Phòng ngủ Tầng 2"
            >
              Mặt cắt Tầng 2
            </button>
          </div>

          {/* Nút Ánh sáng Ngày / Đêm */}
          <button
            type="button"
            onClick={() => setIsNight((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              isNight ? 'museum-button-active' : 'museum-button'
            }`}
          >
            {isNight ? (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Chiều tối</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#C6A87C]" />
                <span>Ban ngày</span>
              </>
            )}
          </button>

          {/* Nút Mở Câu hỏi Ôn tập */}
          <button
            type="button"
            onClick={() => {
              setIsAutoTour(false);
              setIsQuizOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium museum-button hover:border-[#C6A87C] cursor-pointer"
          >
            <BookOpenCheck className="w-3.5 h-3.5 text-[#C6A87C]" />
            <span>Ôn tập ({visitedIds.length}/{TOUR_SPOTS.length})</span>
          </button>
        </div>
      </header>

      {/* BẢNG THUYẾT MINH THEO NGỮ CẢNH (Chỉ hiển thị khi người dùng chọn một địa điểm) */}
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

      {/* BOTTOM NAVIGATION – ĐIỀU HƯỚNG CÁC ĐỊA ĐIỂM TRONG KHU DI TÍCH */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20 max-w-[96vw] flex items-center gap-1.5 px-2.5 py-2 rounded-xl museum-panel overflow-x-auto">
        <button
          type="button"
          onClick={handleOverview}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 cursor-pointer ${
            activeSpot === null && viewMode === 'overview' && !isAutoTour
              ? 'museum-button-active'
              : 'museum-button'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Toàn cảnh</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAutoTour((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 cursor-pointer ${
            isAutoTour ? 'museum-button-active' : 'museum-button'
          }`}
        >
          {isAutoTour ? (
            <>
              <Pause className="w-3 h-3 fill-current" />
              <span>Dừng dẫn tour</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current text-[#C6A87C]" />
              <span>Tự động dẫn tour</span>
            </>
          )}
        </button>

        <div className="h-4 w-px bg-[#D6CBB8]/20 mx-1 shrink-0" />

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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 cursor-pointer ${
                isSelected ? 'museum-button-active' : 'museum-button'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                  isSelected
                    ? 'bg-white text-[#5C3D24]'
                    : isVisited
                    ? 'bg-[#2D4A38] text-[#A7D7B8]'
                    : 'bg-white/10 text-[#E5DEC9]'
                }`}
              >
                {spot.id}
              </span>
              <span className="hidden sm:inline">{spot.shortLabel}</span>
              {isVisited && !isSelected && (
                <Check className="w-3 h-3 text-[#78B890] stroke-[2.5]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* MODAL ÔN TẬP KIẾN THỨC */}
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
