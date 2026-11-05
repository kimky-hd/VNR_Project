import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="quiz-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl liquid-glass overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.9)] border border-white/15"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Trophy className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-cormorant tracking-wide text-gold-leaf">
                    Trắc Nghiệm Tư Tưởng Hồ Chí Minh
                  </h2>
                  <p className="text-xs text-stone-400 font-light">
                    Hệ thống câu hỏi lý luận gắn liền với hiện vật di sản ({visitedCount}/5 điểm đã khám phá)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nội dung câu hỏi */}
            <div className="flex-1 overflow-y-auto p-6">
              {!isFinished ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-cinzel font-bold text-amber-200 bg-amber-500/15 border border-amber-400/30">
                        CÂU {currentIdx + 1}/{QUIZ_QUESTIONS.length}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] text-stone-300 bg-white/5 border border-white/10">
                        {currentQuestion.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGoToRelatedSpot(currentQuestion.spotId)}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-200 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Xem điểm #{currentQuestion.spotId}</span>
                    </button>
                  </div>

                  {/* Thanh tiến trình thanh lịch */}
                  <div className="grid grid-cols-6 gap-1.5">
                    {QUIZ_QUESTIONS.map((q, idx) => {
                      const ans = answers[idx];
                      const isCorrect = ans === q.correctIndex;
                      return (
                        <div
                          key={q.id}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            idx === currentIdx
                              ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                              : ans === null
                              ? 'bg-white/10'
                              : isCorrect
                              ? 'bg-emerald-400/80'
                              : 'bg-rose-400/80'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Thẻ câu hỏi */}
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-amber-300/80 shrink-0 mt-0.5" />
                      <h3 className="text-sm sm:text-base font-normal text-stone-100 leading-relaxed font-serif">
                        {currentQuestion.question}
                      </h3>
                    </div>
                  </div>

                  {/* Các lựa chọn */}
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrectOption = idx === currentQuestion.correctIndex;
                      const hasAnswered = selectedOption !== null;

                      let btnStyle = 'bg-white/[0.03] border-white/10 text-stone-300 hover:border-white/20';
                      if (hasAnswered) {
                        if (isCorrectOption) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-400/60 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]';
                        } else if (isSelected && !isCorrectOption) {
                          btnStyle = 'bg-rose-950/40 border-rose-400/60 text-rose-100';
                        } else {
                          btnStyle = 'bg-white/[0.01] border-white/5 text-stone-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={hasAnswered}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${btnStyle}`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-cinzel font-bold shrink-0 mt-0.5 ${
                              hasAnswered && isCorrectOption
                                ? 'bg-emerald-400 text-slate-950'
                                : hasAnswered && isSelected && !isCorrectOption
                                ? 'bg-rose-500 text-white'
                                : 'bg-white/10 text-stone-300'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 text-xs sm:text-[13px] leading-relaxed">
                            {option}
                          </span>
                          {hasAnswered && isCorrectOption && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          {hasAnswered && isSelected && !isCorrectOption && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Giải thích chi tiết */}
                  {selectedOption !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-400/25 space-y-2"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-cinzel tracking-widest text-amber-300">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>TRÍCH DẪN &amp; GIẢI THÍCH</span>
                      </div>
                      <p className="text-xs italic font-cormorant text-amber-200/90 bg-black/30 p-3 rounded-xl border border-white/5">
                        {currentQuestion.quoteReference}
                      </p>
                      <p className="text-xs text-stone-300 leading-relaxed font-light">
                        {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : (
                /* Tổng kết */
                <div className="py-6 text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/30 text-amber-300 shadow-2xl mx-auto">
                    <Trophy className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-cinzel font-semibold text-amber-200 bg-amber-500/10 border border-amber-400/25">
                      KẾT QUẢ ÔN TẬP
                    </span>
                    <h3 className="mt-3 text-2xl sm:text-3xl font-bold font-cormorant text-gold-leaf">
                      Đạt {score} / {QUIZ_QUESTIONS.length} điểm
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-stone-300 max-w-md mx-auto font-light">
                      {score === QUIZ_QUESTIONS.length
                        ? 'Chúc mừng bạn! Bạn đã nắm vững xuất sắc hệ thống lý luận và các trích dẫn Tư tưởng Hồ Chí Minh qua không gian di sản.'
                        : 'Hãy tiếp tục khám phá các điểm di sản 3D và lắng nghe thuyết minh để hiểu sâu hơn về nếp sống và tư tưởng của Bác nhé!'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs liquid-glass-pill text-stone-300 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại</span>
              </button>

              {!isFinished ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleNext}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                    selectedOption !== null
                      ? 'liquid-glass-active text-amber-100 shadow-lg'
                      : 'bg-white/5 border border-white/5 text-stone-600 cursor-not-allowed'
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-medium liquid-glass-active text-amber-100 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quay lại Không gian 3D</span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuizModal;
