import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  MapPin,
} from 'lucide-react';
import { QUIZ_QUESTIONS, TOUR_SPOTS, TourSpot } from '../data/tourData';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitedCount: number;
  onJumpToSpot: (spot: TourSpot) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  visitedCount,
  onJumpToSpot,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUIZ_QUESTIONS.length).fill(null)
  );
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    const updated = [...answers];
    updated[currentIdx] = optionIdx;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      const nextIndex = currentIdx + 1;
      setCurrentIdx(nextIndex);
      setSelectedOption(answers[nextIndex]);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
    setIsFinished(false);
  };

  const score = answers.reduce<number>((acc, ans, idx) => {
    if (ans === QUIZ_QUESTIONS[idx].correctIndex) return acc + 1;
    return acc;
  }, 0);

  const handleGoToRelatedSpot = (spotId: number) => {
    const found = TOUR_SPOTS.find((s) => s.id === spotId);
    if (found) {
      onClose();
      onJumpToSpot(found);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl museum-panel overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D6CBB8]/15 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-[#C6A87C] uppercase tracking-wider">
              Ôn tập kiến thức lịch sử &amp; lý luận ({visitedCount}/{TOUR_SPOTS.length} địa điểm đã xem)
            </div>
            <h2 className="text-base sm:text-lg font-editorial font-semibold text-[#F5F2EB] mt-0.5">
              Khu Di Tích Nhà Sàn Bác Hồ &amp; Tư Tưởng Hồ Chí Minh
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A8A29E] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isFinished ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#8C6747] text-white">
                    Câu {currentIdx + 1}/{QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-xs text-[#C6A87C] font-medium">
                    {currentQuestion.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoToRelatedSpot(currentQuestion.spotId)}
                  className="inline-flex items-center gap-1 text-xs text-[#C6A87C] hover:underline cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Xem địa điểm liên quan</span>
                </button>
              </div>

              {/* Câu hỏi */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-[#D6CBB8]/15">
                <h3 className="text-sm sm:text-base font-medium text-[#F5F2EB] leading-relaxed">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Phương án */}
              <div className="space-y-2">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = idx === currentQuestion.correctIndex;
                  const hasAnswered = selectedOption !== null;

                  let btnStyle =
                    'bg-white/[0.03] border-[#D6CBB8]/15 text-[#E7E2D8] hover:border-[#C6A87C]/50';
                  if (hasAnswered) {
                    if (isCorrectOption) {
                      btnStyle =
                        'bg-[#1E3A2B] border-[#529471] text-[#FAF8F5]';
                    } else if (isSelected && !isCorrectOption) {
                      btnStyle =
                        'bg-[#4A1D1D] border-[#B84A4A] text-[#FAF8F5]';
                    } else {
                      btnStyle =
                        'bg-white/[0.01] border-white/5 text-[#78716C] opacity-65';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 text-xs sm:text-[13px] leading-relaxed">
                        {option}
                      </span>
                      {hasAnswered && isCorrectOption && (
                        <CheckCircle2 className="w-4 h-4 text-[#68B88E] shrink-0 mt-0.5" />
                      )}
                      {hasAnswered && isSelected && !isCorrectOption && (
                        <XCircle className="w-4 h-4 text-[#E06C6C] shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Giải thích */}
              {selectedOption !== null && (
                <div className="p-4 rounded-xl bg-[#222623] border border-[#C6A87C]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C6A87C]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Trích dẫn &amp; Giải thích</span>
                  </div>
                  <p className="text-xs italic font-editorial text-[#F2E8D5]">
                    {currentQuestion.quoteReference}
                  </p>
                  <p className="text-xs text-[#D6CFC2] leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C6A87C]">
                Kết quả hoàn thành
              </div>
              <h3 className="text-2xl font-editorial font-semibold text-[#F5F2EB]">
                Đạt {score} / {QUIZ_QUESTIONS.length} câu trả lời đúng
              </h3>
              <p className="text-xs sm:text-sm text-[#D6CFC2] max-w-md mx-auto leading-relaxed">
                {score === QUIZ_QUESTIONS.length
                  ? 'Bạn đã nắm vững toàn bộ nội dung lịch sử Khu di tích Nhà sàn Bác Hồ và các luận điểm cốt lõi của Tư tưởng Hồ Chí Minh.'
                  : 'Bạn có thể xem lại từng địa điểm trong Khu di tích để đối chiếu hiện vật lịch sử với nội dung lý luận.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#D6CBB8]/15 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs museum-button cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại</span>
          </button>

          {!isFinished ? (
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleNext}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedOption !== null
                  ? 'museum-button-active'
                  : 'bg-white/5 text-[#78716C] cursor-not-allowed'
              }`}
            >
              <span>
                {currentIdx + 1 === QUIZ_QUESTIONS.length
                  ? 'Xem kết quả'
                  : 'Câu tiếp theo'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium museum-button-active cursor-pointer"
            >
              Quay lại tham quan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
