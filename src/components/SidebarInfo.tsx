import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Volume2,
  Square,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Landmark,
  Camera,
  Maximize2,
} from 'lucide-react';
import { TourSpot, TOUR_SPOTS } from '../data/tourData';

interface SidebarInfoProps {
  spot: TourSpot | null;
  onClose: () => void;
  onSelectSpot: (spot: TourSpot) => void;
  onOpenQuiz: () => void;
}

const FALLBACK_IMAGE = './images/heritage/cottage-3.jpg';

export const SidebarInfo: React.FC<SidebarInfoProps> = ({
  spot,
  onClose,
  onSelectSpot,
  onOpenQuiz,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedArtifactIdx, setSelectedArtifactIdx] = useState<number>(0);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    setSelectedArtifactIdx(0);
    setSelectedPhotoIdx(0);
    setIsLightboxOpen(false);
    stopSpeech();
    return () => {
      stopSpeech();
    };
  }, [spot, stopSpeech]);

  if (!spot) return null;

  const photos =
    spot.gallery && spot.gallery.length > 0
      ? spot.gallery
      : [{ url: spot.imageUrl, caption: spot.imageCaption }];

  const activePhoto = photos[selectedPhotoIdx] || photos[0];

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();

    const narrationText = `${spot.title}. ${spot.historicalStory} Liên hệ Tư tưởng Hồ Chí Minh: ${spot.hcmThoughtConnection} ${spot.keyQuote.quote}`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.96;

    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('vi') ||
        v.name.toLowerCase().includes('viet')
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
    const currentIndex = TOUR_SPOTS.findIndex((s) => s.id === spot.id);
    if (currentIndex === -1) return;
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % TOUR_SPOTS.length
        : (currentIndex - 1 + TOUR_SPOTS.length) % TOUR_SPOTS.length;
    onSelectSpot(TOUR_SPOTS[nextIndex]);
  };

  return (
    <>
      <aside className="fixed top-20 bottom-20 right-4 z-30 w-[calc(100vw-2rem)] sm:w-[430px] lg:w-[460px] flex flex-col rounded-2xl museum-panel overflow-hidden">
        {/* Header địa điểm */}
        <div className="px-5 pt-4 pb-3.5 border-b border-[#D6CBB8]/15 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-[#C6A87C] font-medium">
              <span>Điểm {spot.id}/{TOUR_SPOTS.length}</span>
              <span>•</span>
              <span>{spot.zone}</span>
            </div>
            <h2 className="mt-1 text-lg sm:text-xl font-editorial font-semibold text-[#F5F2EB] leading-snug">
              {spot.title}
            </h2>
            <p className="mt-0.5 text-xs text-[#A8A29E]">{spot.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Đóng thuyết minh"
            className="p-1.5 rounded-lg text-[#A8A29E] hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* 1. BỘ SƯU TẬP ẢNH TƯ LIỆU THỰC TẾ TẠI KHU DI TÍCH */}
          <div className="rounded-xl overflow-hidden border border-[#D6CBB8]/20 bg-[#111311]">
            <div className="relative aspect-[16/10] w-full bg-[#1C1F1D] overflow-hidden group">
              <img
                key={activePhoto.url}
                src={activePhoto.url}
                alt={`${spot.title} - Ảnh tư liệu ${selectedPhotoIdx + 1}`}
                loading="eager"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('cottage-3.jpg')) {
                    target.src = FALLBACK_IMAGE;
                  }
                }}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/75 text-[#F5F2EB] text-[11px] flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-[#C6A87C]" />
                <span>
                  Ảnh tư liệu thực tế ({selectedPhotoIdx + 1}/{photos.length})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                title="Phóng to ảnh tư liệu"
                className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-black/75 text-[#F5F2EB] hover:bg-black/90 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {photos.length > 1 && (
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1">
                  {photos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhotoIdx(idx)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                        selectedPhotoIdx === idx
                          ? 'bg-[#8C6747] text-white'
                          : 'bg-black/75 text-[#D6CFC2] hover:bg-black/90'
                      }`}
                    >
                      Ảnh {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Thanh thumbnail khi có nhiều ảnh tư liệu */}
            {photos.length > 1 && (
              <div className="px-3.5 pt-2.5 flex items-center gap-2 overflow-x-auto">
                {photos.map((photo, idx) => (
                  <button
                    key={photo.url}
                    type="button"
                    onClick={() => setSelectedPhotoIdx(idx)}
                    className={`relative w-16 h-10 rounded-md overflow-hidden border shrink-0 cursor-pointer transition-opacity ${
                      selectedPhotoIdx === idx
                        ? 'border-[#C6A87C] opacity-100'
                        : 'border-white/10 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={`Ảnh nhỏ ${idx + 1}`}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith('cottage-3.jpg')) {
                          target.src = FALLBACK_IMAGE;
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <p className="px-3.5 py-2.5 text-[11px] text-[#B8B2A6] leading-relaxed border-t border-[#D6CBB8]/10 mt-2">
              {activePhoto.caption}
            </p>
          </div>

          {/* Nút Nghe thuyết minh Audio */}
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-[#7C2D12] text-white border border-[#C6A87C]/40'
                : 'museum-button'
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Dừng đọc thuyết minh</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#C6A87C]" />
                <span>Nghe thuyết minh địa điểm</span>
              </>
            )}
          </button>

          {/* 2. GIỚI THIỆU LỊCH SỬ */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C6A87C]">
              <Landmark className="w-3.5 h-3.5" />
              <span>Giá trị lịch sử &amp; không gian</span>
            </div>
            <p className="text-xs sm:text-[13px] text-[#E7E2D8] leading-relaxed">
              {spot.historicalStory}
            </p>
          </section>

          {/* 3. HIỆN VẬT & HẠNG MỤC TIÊU BIỂU */}
          <section className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C6A87C]">
              Hiện vật &amp; hạng mục tại khu vực
            </div>
            <div className="flex flex-wrap gap-1.5">
              {spot.artifactDetails.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedArtifactIdx(idx)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${
                    selectedArtifactIdx === idx
                      ? 'bg-[#8C6747]/30 border-[#C6A87C] text-[#FAF8F5] font-medium'
                      : 'bg-white/[0.03] border-white/10 text-[#C8C2B6] hover:border-white/25'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {spot.artifactDetails[selectedArtifactIdx] && (
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[#D6CBB8]/15 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#F5F2EB]">
                    {spot.artifactDetails[selectedArtifactIdx].name}
                  </span>
                  <span className="text-[11px] text-[#C6A87C]">
                    {spot.artifactDetails[selectedArtifactIdx].origin}
                  </span>
                </div>
                <p className="text-xs text-[#D6CFC2] leading-relaxed">
                  {spot.artifactDetails[selectedArtifactIdx].description}
                </p>
              </div>
            )}
          </section>

          {/* 4. TRÍCH DẪN & LIÊN HỆ TƯ TƯỞNG HỒ CHÍ MINH */}
          <section className="p-4 rounded-xl bg-[#222623] border border-[#C6A87C]/25 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C6A87C]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Liên hệ Tư tưởng Hồ Chí Minh</span>
            </div>
            <p className="text-xs sm:text-[13px] text-[#E7E2D8] leading-relaxed">
              {spot.hcmThoughtConnection}
            </p>

            <blockquote className="pt-2 border-t border-white/10 text-xs sm:text-[13px] italic font-editorial text-[#F2E8D5] leading-relaxed">
              {spot.keyQuote.quote}
              <footer className="mt-1 not-italic text-[11px] font-sans text-[#B8B2A6]">
                — {spot.keyQuote.context}
              </footer>
            </blockquote>

            <div className="pt-1 flex flex-wrap gap-1.5">
              {spot.coreValues.map((val, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-white/[0.04] border border-[#D6CBB8]/15 text-[11px] text-[#D6CFC2]"
                >
                  {val}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Footer điều hướng gọn nhẹ */}
        <div className="px-5 py-3 border-t border-[#D6CBB8]/15 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handlePrevNext('prev')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs museum-button cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Điểm trước</span>
            </button>
            <button
              type="button"
              onClick={() => handlePrevNext('next')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs museum-button cursor-pointer"
            >
              <span>Điểm tiếp</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenQuiz}
            className="px-3 py-1.5 rounded-lg text-xs font-medium museum-button hover:border-[#C6A87C] text-[#E5DEC9] cursor-pointer"
          >
            Câu hỏi ôn tập
          </button>
        </div>
      </aside>

      {/* Lightbox xem ảnh tư liệu kích thước lớn */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-[#181A18] border border-[#D6CBB8]/25 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activePhoto.url}
              alt={spot.title}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('cottage-3.jpg')) {
                  target.src = FALLBACK_IMAGE;
                }
              }}
              className="w-full max-h-[76vh] object-contain bg-black"
            />
            <div className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-2xl">
                <h3 className="text-sm font-semibold text-[#F5F2EB]">
                  {spot.title} ({selectedPhotoIdx + 1}/{photos.length})
                </h3>
                <p className="text-xs text-[#B8B2A6] mt-0.5">
                  {activePhoto.caption}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPhotoIdx(
                          (prev) => (prev - 1 + photos.length) % photos.length
                        )
                      }
                      className="px-3 py-1.5 rounded-lg text-xs museum-button cursor-pointer"
                    >
                      Ảnh trước
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPhotoIdx((prev) => (prev + 1) % photos.length)
                      }
                      className="px-3 py-1.5 rounded-lg text-xs museum-button cursor-pointer"
                    >
                      Ảnh tiếp
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs museum-button cursor-pointer"
                >
                  Đóng ảnh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarInfo;
